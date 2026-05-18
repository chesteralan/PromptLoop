import type {
  ExecutionChunk,
  ExecutionResult,
  ExecutionError,
  WorkflowComplete,
} from '../../electron/shared/types'

export interface ElectronAPI {
  startWorkflow(
    workflowId: string,
    config?: unknown,
    apiKeys?: Record<string, string>,
  ): Promise<{ success: boolean; workflowId: string; error?: string }>
  pauseWorkflow(
    workflowId: string,
  ): Promise<{ success: boolean; workflowId: string; error?: string }>
  stopWorkflow(
    workflowId: string,
  ): Promise<{ success: boolean; workflowId: string; error?: string }>
  retryWorkflow(
    workflowId: string,
  ): Promise<{ success: boolean; workflowId: string; error?: string }>
  onExecutionChunk(callback: (data: ExecutionChunk) => void): () => void
  onExecutionCompleted(callback: (data: ExecutionResult) => void): () => void
  onExecutionFailed(callback: (data: ExecutionError) => void): () => void
  onWorkflowCompleted(callback: (data: WorkflowComplete) => void): () => void
  encryptApiKey(provider: string, key: string): Promise<{ id: string; keyPrefix: string }>
  decryptApiKey(keyId: string): Promise<{ key: string }>
  deleteApiKey(keyId: string): Promise<{ success: boolean }>
  listApiKeys(): Promise<{ id: string; provider: string; keyPrefix: string; createdAt: string }[]>
  minimizeToTray(): void
  getAppVersion(): Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
