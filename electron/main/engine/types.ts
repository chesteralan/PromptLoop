import type { LoopMode } from '../../shared/types'

export interface PromptConfig {
  id: string
  title: string
  content: string
  systemPrompt?: string
  model: string
  position: number
  enabled: boolean
  temperature?: number
  maxTokens?: number
  delayMs?: number
}

export interface WorkflowConfig {
  id: string
  name: string
  loopMode: LoopMode
  maxIterations?: number
  prompts: PromptConfig[]
}

export type RunnerState = 'idle' | 'running' | 'paused' | 'stopped' | 'completed' | 'error'

export interface ExecutionEventMap {
  'execution:started': { workflowId: string; promptId: string; model: string; timestamp: number }
  'execution:chunk': { workflowId: string; promptId: string; chunk: string }
  'execution:completed': {
    workflowId: string
    promptId: string
    result: string
    durationMs: number
  }
  'execution:failed': { workflowId: string; promptId: string; error: string }
  'execution:status': {
    workflowId: string
    currentIndex: number
    totalPrompts: number
    loopIteration: number
    phase: 'executing' | 'waiting' | 'completed'
  }
  'workflow:completed': { workflowId: string; iterations: number }
}
