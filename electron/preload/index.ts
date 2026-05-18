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
    ipcRenderer.invoke('api-key:encrypt', { provider, key }),
  decryptApiKey: (keyId: string) => ipcRenderer.invoke('api-key:decrypt', { keyId }),
  deleteApiKey: (keyId: string) => ipcRenderer.invoke('api-key:delete', { keyId }),
  listApiKeys: () => ipcRenderer.invoke('api-key:list'),

  minimizeToTray: () => ipcRenderer.send('app:minimize-to-tray'),
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
}

contextBridge.exposeInMainWorld('electronAPI', api)
