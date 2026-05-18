import { ipcRenderer, contextBridge } from 'electron'
import type {
  ExecutionChunk,
  ExecutionResult,
  ExecutionError,
  WorkflowComplete,
} from '../shared/types'

function assertSuccess<T extends { success: boolean; error?: string }>(
  r: T,
): Omit<T, 'success' | 'error'> {
  if (!r.success) throw new Error(r.error ?? 'Operation failed')
  const rest = { ...r }
  delete (rest as Record<string, unknown>).success
  delete (rest as Record<string, unknown>).error
  return rest as Omit<T, 'success' | 'error'>
}

export const api = {
  startWorkflow: (workflowId: string, config?: unknown, apiKeys?: Record<string, string>) =>
    ipcRenderer.invoke('workflow:start', { workflowId, config, apiKeys }),
  pauseWorkflow: (workflowId: string) => ipcRenderer.invoke('workflow:pause', { workflowId }),
  stopWorkflow: (workflowId: string) => ipcRenderer.invoke('workflow:stop', { workflowId }),
  retryWorkflow: (workflowId: string) => ipcRenderer.invoke('workflow:retry', { workflowId }),

  onExecutionChunk: (callback: (data: ExecutionChunk) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: ExecutionChunk) => callback(data)
    ipcRenderer.on('execution:chunk', handler)
    return () => {
      ipcRenderer.removeListener('execution:chunk', handler)
    }
  },
  onExecutionCompleted: (callback: (data: ExecutionResult) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: ExecutionResult) => callback(data)
    ipcRenderer.on('execution:completed', handler)
    return () => {
      ipcRenderer.removeListener('execution:completed', handler)
    }
  },
  onExecutionFailed: (callback: (data: ExecutionError) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: ExecutionError) => callback(data)
    ipcRenderer.on('execution:failed', handler)
    return () => {
      ipcRenderer.removeListener('execution:failed', handler)
    }
  },
  onWorkflowCompleted: (callback: (data: WorkflowComplete) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: WorkflowComplete) => callback(data)
    ipcRenderer.on('workflow:completed', handler)
    return () => {
      ipcRenderer.removeListener('workflow:completed', handler)
    }
  },

  encryptApiKey: async (provider: string, key: string) => {
    const r: { success: boolean; id?: string; keyPrefix?: string; error?: string } =
      await ipcRenderer.invoke('api-key:encrypt', { provider, key })
    const rest = assertSuccess(r)
    if (!rest.id || !rest.keyPrefix) throw new Error('Encryption response missing fields')
    return { id: rest.id as string, keyPrefix: rest.keyPrefix as string }
  },
  decryptApiKey: async (keyId: string) => {
    const r: { success: boolean; key?: string; error?: string } = await ipcRenderer.invoke(
      'api-key:decrypt',
      { keyId },
    )
    const rest = assertSuccess(r)
    if (!rest.key) throw new Error('Decryption response missing key')
    return { key: rest.key as string }
  },
  deleteApiKey: (keyId: string) =>
    ipcRenderer.invoke('api-key:delete', { keyId }) as Promise<{ success: boolean }>,
  listApiKeys: () =>
    ipcRenderer
      .invoke('api-key:list')
      .then(
        (r: {
          success: boolean
          keys?: { id: string; provider: string; keyPrefix: string; createdAt: string }[]
        }) => r.keys ?? [],
      ),

  minimizeToTray: () => ipcRenderer.send('app:minimize-to-tray'),
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),

  showSaveDialog: (options: unknown) => ipcRenderer.invoke('dialog:show-save-dialog', options),
  showOpenDialog: (options: unknown) => ipcRenderer.invoke('dialog:show-open-dialog', options),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:write', filePath, content) as Promise<{
      success: boolean
      error?: string
    }>,
  readFile: (filePath: string) =>
    ipcRenderer.invoke('file:read', filePath) as Promise<{
      success: boolean
      content?: string
      error?: string
    }>,
}

contextBridge.exposeInMainWorld('electronAPI', api)
