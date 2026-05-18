export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error' | 'stopped'

export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed'

export type LoopMode = 'infinite' | 'fixed' | 'single' | 'scheduled'

export interface WorkflowStartPayload {
  workflowId: string
  loopMode: LoopMode
  loopCount?: number
  delayMs?: number
}

export interface WorkflowStartResponse {
  workflowId: string
  started: boolean
}

export interface ExecutionChunk {
  workflowId: string
  promptId: string
  chunk: string
}

export interface ExecutionResult {
  workflowId: string
  promptId: string
  result: string
  tokensIn: number
  tokensOut: number
  durationMs: number
}

export interface ExecutionError {
  workflowId: string
  promptId: string
  error: string
}

export interface WorkflowComplete {
  workflowId: string
  iterations: number
}

export interface ApiKeyInfo {
  id: string
  keyPrefix: string
  provider: string
  createdAt: string
}

export interface ApiKeyEncryptPayload {
  provider: string
  apiKey: string
}

export interface ApiKeyEncryptResponse {
  id: string
  keyPrefix: string
}

export interface AppUpdateEvent {
  version: string
  releaseDate: string
  releaseNotes?: string
}

export interface WindowState {
  x: number | undefined
  y: number | undefined
  width: number
  height: number
  isMaximized: boolean
  mode: 'full' | 'compact'
}
