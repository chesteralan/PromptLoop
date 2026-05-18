import { OpenAIAdapter } from '../providers/openai'
import type { ProviderAdapter } from '../providers/interface'
import { QueueManager } from './queue'
import { emit } from './events'
import { executeWithRetry } from './retry'
import type { RunnerState, WorkflowConfig, PromptConfig } from './types'

const PROVIDERS: Record<string, ProviderAdapter> = {
  openai: new OpenAIAdapter(),
}

function getProvider(modelId: string): ProviderAdapter | null {
  if (modelId.startsWith('gpt') || modelId.startsWith('o')) return PROVIDERS['openai']
  if (modelId.startsWith('claude')) return null
  if (modelId.startsWith('gemini')) return null
  return PROVIDERS['openai']
}

export class WorkflowRunner {
  private config: WorkflowConfig
  private apiKeys: Record<string, string>
  private state: RunnerState = 'idle'
  private abortController = new AbortController()
  private queue = new QueueManager()
  private currentIndex = 0
  private loopIteration = 0
  constructor(config: WorkflowConfig, apiKeys: Record<string, string>) {
    this.config = config
    this.apiKeys = apiKeys
  }

  get workflowId(): string {
    return this.config.id
  }

  getStatus(): { state: RunnerState; currentIndex: number; loopIteration: number } {
    return {
      state: this.state,
      currentIndex: this.currentIndex,
      loopIteration: this.loopIteration,
    }
  }

  async start(): Promise<void> {
    if (this.state !== 'idle') return
    this.state = 'running'
    this.abortController = new AbortController()
    this.currentIndex = 0
    this.loopIteration = 0
    this.queue.clear()

    const enabled = this.config.prompts
      .filter((p) => p.enabled)
      .sort((a, b) => a.position - b.position)
    for (const p of enabled) {
      this.queue.enqueue(p)
    }

    await this.runLoop()
  }

  pause(): void {
    if (this.state === 'running') {
      this.state = 'paused'
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.state = 'running'
    }
  }

  stop(): void {
    this.state = 'stopped'
    this.abortController.abort()
    this.queue.clear()
  }

  private async runLoop(): Promise<void> {
    while (this.state === 'running' && !this.abortController.signal.aborted) {
      const prompts = this.queue.getAll()
      if (prompts.length === 0) break

      for (let i = 0; i < prompts.length; i++) {
        if (this.state !== 'running' || this.abortController.signal.aborted) break

        const prompt = prompts[i]
        this.currentIndex = i

        emit('execution:status', {
          workflowId: this.config.id,
          currentIndex: i,
          totalPrompts: prompts.length,
          loopIteration: this.loopIteration,
          phase: 'executing',
        })

        await this.executePrompt(prompt)

        if (this.state !== 'running' || this.abortController.signal.aborted) break

        if (i < prompts.length - 1 && (prompt.delayMs ?? 0) > 0) {
          emit('execution:status', {
            workflowId: this.config.id,
            currentIndex: i,
            totalPrompts: prompts.length,
            loopIteration: this.loopIteration,
            phase: 'waiting',
          })
          await this.delay(prompt.delayMs ?? 0)
        }
      }

      if (this.state !== 'running' || this.abortController.signal.aborted) break

      const shouldLoop = this.evaluateLoop()
      if (!shouldLoop) break

      this.loopIteration++
    }

    if (this.state === 'running') {
      this.state = 'completed'
      emit('workflow:completed', {
        workflowId: this.config.id,
        iterations: this.loopIteration + 1,
      })
      emit('execution:status', {
        workflowId: this.config.id,
        currentIndex: 0,
        totalPrompts: 0,
        loopIteration: this.loopIteration,
        phase: 'completed',
      })
    }
  }

  private async executePrompt(prompt: PromptConfig): Promise<void> {
    const provider = getProvider(prompt.model)
    if (!provider) {
      const error = `No provider available for model: ${prompt.model}`
      emit('execution:failed', { workflowId: this.config.id, promptId: prompt.id, error })
      return
    }

    const apiKey = this.apiKeys[prompt.model.split('-')[0]] ?? ''
    if (!apiKey) {
      const error = `No API key for provider: ${prompt.model}`
      emit('execution:failed', { workflowId: this.config.id, promptId: prompt.id, error })
      return
    }

    const startTime = Date.now()

    emit('execution:started', {
      workflowId: this.config.id,
      promptId: prompt.id,
      model: prompt.model,
      timestamp: startTime,
    })

    try {
      const fullResponse = await executeWithRetry(async () => {
        const stream = await provider.stream(prompt.content, {
          apiKey,
          model: prompt.model,
          systemPrompt: prompt.systemPrompt,
          temperature: prompt.temperature,
          maxTokens: prompt.maxTokens,
          signal: this.abortController.signal,
        })

        let accumulated = ''
        for await (const chunk of stream) {
          if (this.abortController.signal.aborted) break
          accumulated += chunk
          emit('execution:chunk', {
            workflowId: this.config.id,
            promptId: prompt.id,
            chunk,
          })
        }
        return accumulated
      }, 2)

      if (this.abortController.signal.aborted) return

      emit('execution:completed', {
        workflowId: this.config.id,
        promptId: prompt.id,
        result: fullResponse,
        durationMs: Date.now() - startTime,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      emit('execution:failed', {
        workflowId: this.config.id,
        promptId: prompt.id,
        error: message,
      })
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms)
      const onAbort = () => {
        clearTimeout(timer)
        resolve()
      }
      this.abortController.signal.addEventListener('abort', onAbort, { once: true })
    })
  }

  private evaluateLoop(): boolean {
    const { loopMode, maxIterations } = this.config
    switch (loopMode) {
      case 'single':
        return false
      case 'fixed':
        return maxIterations != null && this.loopIteration + 1 < maxIterations
      case 'infinite':
        return true
      case 'scheduled':
        return false
      default:
        return false
    }
  }
}
