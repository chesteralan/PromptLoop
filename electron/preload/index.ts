import { ipcRenderer, contextBridge } from 'electron'
import type {
  ExecutionChunk,
  ExecutionResult,
  ExecutionError,
  WorkflowComplete,
} from '../shared/types'

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

  encryptApiKey: (provider: string, key: string) =>
    ipcRenderer
      .invoke('api-key:encrypt', { provider, key })
      .then((r: { success: boolean; id?: string; keyPrefix?: string; error?: string }) => {
        if (!r.success) throw new Error(r.error ?? 'Encryption failed')
        return { id: r.id!, keyPrefix: r.keyPrefix! }
      }),
  decryptApiKey: (keyId: string) =>
    ipcRenderer
      .invoke('api-key:decrypt', { keyId })
      .then((r: { success: boolean; key?: string; error?: string }) => {
        if (!r.success) throw new Error(r.error ?? 'Decryption failed')
        return { key: r.key! }
      }),
  deleteApiKey: (keyId: string) =>
    ipcRenderer.invoke('api-key:delete', { keyId }).then((r: { success: boolean }) => {
      return { success: r.success }
    }),
  listApiKeys: () =>
    ipcRenderer
      .invoke('api-key:list')
      .then(
        (r: {
          success: boolean
          keys?: { id: string; provider: string; keyPrefix: string; createdAt: string }[]
        }) => {
          return r.keys ?? []
        },
      ),

  minimizeToTray: () => ipcRenderer.send('app:minimize-to-tray'),
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),

  showSaveDialog: (options: unknown) => ipcRenderer.invoke('dialog:show-save-dialog', options),
  showOpenDialog: (options: unknown) => ipcRenderer.invoke('dialog:show-open-dialog', options),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:write', filePath, content),
  readFile: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
}

contextBridge.exposeInMainWorld('electronAPI', api)
