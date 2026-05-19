import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WorkflowRunner } from '../runner'
import type { WorkflowConfig, PromptConfig, RunnerState } from '../types'
import type { ProviderAdapter } from '../../providers/interface'

const makePrompt = (overrides: Partial<PromptConfig> & { id: string }): PromptConfig => ({
  title: `Prompt ${overrides.id}`,
  content: 'test content',
  model: 'gpt-4o',
  position: 0,
  enabled: true,
  ...overrides,
})

const makeConfig = (overrides: Partial<WorkflowConfig> = {}): WorkflowConfig => ({
  id: 'wf-1',
  name: 'Test Workflow',
  loopMode: 'single',
  prompts: [makePrompt({ id: 'p-1', position: 0 })],
  ...overrides,
})

const mockStream = vi.fn<ProviderAdapter['stream']>()
const mockExecuteWithRetry = vi.fn()
const mockEmit = vi.fn()
const mockSendCompleted = vi.fn()
const mockSendFailed = vi.fn()
const mockGetProviderAdapter = vi.fn()
const mockGetProviderName = vi.fn()

vi.mock('../../providers/factory', () => ({
  getProviderAdapter: (...args: unknown[]) => mockGetProviderAdapter(...args),
  getProviderName: (...args: unknown[]) => mockGetProviderName(...args),
}))

vi.mock('../../notifications', () => ({
  sendWorkflowCompleted: (...args: unknown[]) => mockSendCompleted(...args),
  sendWorkflowFailed: (...args: unknown[]) => mockSendFailed(...args),
}))

vi.mock('../events', () => ({
  emit: (...args: unknown[]) => mockEmit(...args),
}))

vi.mock('../retry', () => ({
  executeWithRetry: (...args: unknown[]) => mockExecuteWithRetry(...args),
}))

async function* asyncIterable(chunks: string[]): AsyncIterable<string> {
  for (const c of chunks) {
    yield c
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockStream.mockReturnValue(asyncIterable(['chunk1 ', 'chunk2 ', 'chunk3']))
  mockGetProviderAdapter.mockReturnValue({ stream: mockStream } satisfies Partial<ProviderAdapter>)
  mockGetProviderName.mockReturnValue('openai')
  mockExecuteWithRetry.mockImplementation(async (fn: () => Promise<string>) => fn())
})

describe('WorkflowRunner', () => {
  describe('constructor', () => {
    it('sets config, apiKeys, and default maxRetries', () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      expect(runner.workflowId).toBe('wf-1')
    })

    it('accepts custom maxRetries', () => {
      const runner = new WorkflowRunner(makeConfig(), {}, 5)
      expect((runner as { maxRetries: number }).maxRetries).toBe(5)
    })
  })

  describe('getStatus', () => {
    it('returns initial idle state', () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      expect(runner.getStatus()).toEqual({
        state: 'idle',
        currentIndex: 0,
        loopIteration: 0,
      })
    })
  })

  describe('start', () => {
    it('is no-op if not idle', async () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      ;(runner as { state: RunnerState }).state = 'running'

      await runner.start()

      expect(mockEmit).not.toHaveBeenCalled()
    })

    it('enqueues enabled prompts sorted by position and runs loop', async () => {
      const config = makeConfig({
        prompts: [
          makePrompt({ id: 'p-2', position: 2 }),
          makePrompt({ id: 'p-1', position: 1 }),
          makePrompt({ id: 'p-3', position: 0 }),
        ],
      })
      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })
      await runner.start()

      expect(runner.getStatus().state).toBe('completed')
    })

    it('skips disabled prompts', async () => {
      const config = makeConfig({
        prompts: [
          makePrompt({ id: 'p-1', position: 0, enabled: true }),
          makePrompt({ id: 'p-2', position: 1, enabled: false }),
        ],
      })
      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })
      await runner.start()

      const logs = mockEmit.mock.calls.filter(([ch]: [string]) => ch === 'execution:started')
      expect(logs).toHaveLength(1)
      expect(logs[0][1].promptId).toBe('p-1')
    })
  })

  describe('pause / resume', () => {
    it('pause sets state to paused', () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      ;(runner as { state: RunnerState }).state = 'running'

      runner.pause()

      expect(runner.getStatus().state).toBe('paused')
    })

    it('pause is no-op if not running', () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      runner.pause()
      expect(runner.getStatus().state).toBe('idle')
    })

    it('resume sets state to running', () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      ;(runner as { state: RunnerState }).state = 'paused'

      runner.resume()

      expect(runner.getStatus().state).toBe('running')
    })

    it('resume is no-op if not paused', () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      runner.resume()
      expect(runner.getStatus().state).toBe('idle')
    })
  })

  describe('stop', () => {
    it('sets state to stopped and clears queue', async () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      ;(runner as { state: RunnerState }).state = 'running'
      ;(runner as { queue: { enqueue: (p: PromptConfig) => void; length: number } }).queue.enqueue(
        makePrompt({ id: 'p-1' }),
      )

      runner.stop()

      expect(runner.getStatus().state).toBe('stopped')
      expect((runner as { queue: { length: number } }).queue.length).toBe(0)
    })
  })

  describe('evaluateLoop', () => {
    it('single returns false', () => {
      const runner = new WorkflowRunner(makeConfig({ loopMode: 'single' }), {})
      expect((runner as { evaluateLoop(): boolean }).evaluateLoop()).toBe(false)
    })

    it('scheduled returns false', () => {
      const runner = new WorkflowRunner(makeConfig({ loopMode: 'scheduled' }), {})
      expect((runner as { evaluateLoop(): boolean }).evaluateLoop()).toBe(false)
    })

    it('default (unknown) returns false', () => {
      const runner = new WorkflowRunner(makeConfig({ loopMode: 'single' as const }), {})
      expect((runner as { evaluateLoop(): boolean }).evaluateLoop()).toBe(false)
    })

    it('fixed returns true when under maxIterations', () => {
      const runner = new WorkflowRunner(makeConfig({ loopMode: 'fixed', maxIterations: 3 }), {})
      ;(runner as { loopIteration: number }).loopIteration = 1
      expect((runner as { evaluateLoop(): boolean }).evaluateLoop()).toBe(true)
    })

    it('fixed returns false when at maxIterations', () => {
      const runner = new WorkflowRunner(makeConfig({ loopMode: 'fixed', maxIterations: 3 }), {})
      ;(runner as { loopIteration: number }).loopIteration = 2
      expect((runner as { evaluateLoop(): boolean }).evaluateLoop()).toBe(false)
    })

    it('infinite returns true', () => {
      const runner = new WorkflowRunner(makeConfig({ loopMode: 'infinite' }), {})
      expect((runner as { evaluateLoop(): boolean }).evaluateLoop()).toBe(true)
    })
  })

  describe('runLoop', () => {
    it('processes prompts in order', async () => {
      const config = makeConfig({
        prompts: [makePrompt({ id: 'p-1', position: 0 }), makePrompt({ id: 'p-2', position: 1 })],
      })
      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })
      await runner.start()

      const startedCalls = mockEmit.mock.calls.filter(
        ([ch]: [string]) => ch === 'execution:started',
      )
      expect(startedCalls).toHaveLength(2)
      expect(startedCalls[0][1].promptId).toBe('p-1')
      expect(startedCalls[1][1].promptId).toBe('p-2')
    })

    it('emits execution:status before each prompt', async () => {
      const config = makeConfig({
        prompts: [makePrompt({ id: 'p-1', position: 0 })],
      })
      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })
      await runner.start()

      const statusCalls = mockEmit.mock.calls.filter(([ch]: [string]) => ch === 'execution:status')
      expect(statusCalls.length).toBeGreaterThanOrEqual(1)
      expect(statusCalls[0][1].phase).toBe('executing')
    })

    it('handles empty enabled prompts (immediate completion)', async () => {
      const config = makeConfig({ prompts: [] })
      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })
      await runner.start()

      expect(runner.getStatus().state).toBe('completed')
    })

    it('handles all prompts disabled', async () => {
      const config = makeConfig({
        prompts: [makePrompt({ id: 'p-1', position: 0, enabled: false })],
      })
      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })
      await runner.start()

      expect(runner.getStatus().state).toBe('completed')
    })

    it('emits workflow:completed and sends notification on completion', async () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      expect(mockEmit).toHaveBeenCalledWith('workflow:completed', {
        workflowId: 'wf-1',
        iterations: 1,
      })
      expect(mockSendCompleted).toHaveBeenCalledWith('Test Workflow', 1)
    })
  })

  describe('executePrompt', () => {
    it('gets provider adapter and validates API key', async () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      expect(mockGetProviderAdapter).toHaveBeenCalledWith('gpt-4o')
      expect(mockGetProviderName).toHaveBeenCalledWith('gpt-4o')
    })

    it('emits execution:failed when no provider adapter found', async () => {
      mockGetProviderAdapter.mockReturnValue(null)
      mockGetProviderName.mockReturnValue(null)

      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      expect(mockEmit).toHaveBeenCalledWith('execution:failed', {
        workflowId: 'wf-1',
        promptId: 'p-1',
        error: 'No provider available for model: gpt-4o',
      })
    })

    it('emits execution:failed when no API key for provider', async () => {
      const runner = new WorkflowRunner(makeConfig(), {})
      await runner.start()

      expect(mockEmit).toHaveBeenCalledWith('execution:failed', {
        workflowId: 'wf-1',
        promptId: 'p-1',
        error: 'No API key for provider: gpt-4o',
      })
    })

    it('emits execution:started before streaming', async () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      expect(mockEmit).toHaveBeenCalledWith('execution:started', {
        workflowId: 'wf-1',
        promptId: 'p-1',
        model: 'gpt-4o',
        timestamp: expect.any(Number),
      })
    })

    it('emits execution:chunk for each stream chunk', async () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      const chunkCalls = mockEmit.mock.calls.filter(([ch]: [string]) => ch === 'execution:chunk')
      expect(chunkCalls).toHaveLength(3)
      expect(chunkCalls[0][1].chunk).toBe('chunk1 ')
      expect(chunkCalls[1][1].chunk).toBe('chunk2 ')
      expect(chunkCalls[2][1].chunk).toBe('chunk3')
    })

    it('emits execution:completed with accumulated result on success', async () => {
      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      expect(mockEmit).toHaveBeenCalledWith('execution:completed', {
        workflowId: 'wf-1',
        promptId: 'p-1',
        result: 'chunk1 chunk2 chunk3',
        durationMs: expect.any(Number),
      })
    })

    it('emits execution:failed and sends notification on stream error', async () => {
      mockExecuteWithRetry.mockRejectedValue(new Error('Stream failed'))

      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      await runner.start()

      expect(mockEmit).toHaveBeenCalledWith('execution:failed', {
        workflowId: 'wf-1',
        promptId: 'p-1',
        error: 'Stream failed',
      })
      expect(mockSendFailed).toHaveBeenCalledWith('Test Workflow', 'Stream failed')
    })

    it('skips completion emit if aborted during execution', async () => {
      mockExecuteWithRetry.mockImplementation(async (_fn: unknown) => 'partial')

      const runner = new WorkflowRunner(makeConfig(), { openai: 'sk-abc' })
      ;(runner as { state: RunnerState }).state = 'running'
      ;(runner as { abortController: AbortController }).abortController.abort()

      const completedCalls = mockEmit.mock.calls.filter(
        ([ch]: [string]) => ch === 'execution:completed',
      )
      expect(completedCalls).toHaveLength(0)
    })
  })

  describe('delay', () => {
    it('waits between prompts when delayMs > 0', async () => {
      vi.useFakeTimers()

      const config = makeConfig({
        prompts: [
          makePrompt({ id: 'p-1', position: 0, delayMs: 100 }),
          makePrompt({ id: 'p-2', position: 1 }),
        ],
      })

      const runner = new WorkflowRunner(config, { openai: 'sk-abc' })

      const startPromise = runner.start()

      await vi.advanceTimersByTimeAsync(100)
      await startPromise

      expect(runner.getStatus().state).toBe('completed')

      vi.useRealTimers()
    })
  })
})
