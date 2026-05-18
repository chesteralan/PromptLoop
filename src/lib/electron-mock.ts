import type { ElectronAPI } from './ipc'

const listeners: Record<string, Array<(...args: unknown[]) => void>> = {}

function on(channel: string, fn: (...args: unknown[]) => void) {
  ;(listeners[channel] ??= []).push(fn)
  return () => {
    listeners[channel] = listeners[channel]?.filter((f) => f !== fn)
  }
}

export function injectElectronMock(): void {
  if (window.electronAPI) return

  const mock: ElectronAPI = {
    startWorkflow: async () => ({ success: true, workflowId: '' }),
    pauseWorkflow: async () => ({ success: true, workflowId: '' }),
    stopWorkflow: async () => ({ success: true, workflowId: '' }),
    retryWorkflow: async () => ({ success: true, workflowId: '' }),

    onExecutionChunk: (cb) => on('execution:chunk', cb as (...args: unknown[]) => void),
    onExecutionCompleted: (cb) => on('execution:completed', cb as (...args: unknown[]) => void),
    onExecutionFailed: (cb) => on('execution:failed', cb as (...args: unknown[]) => void),
    onWorkflowCompleted: (cb) => on('workflow:completed', cb as (...args: unknown[]) => void),

    encryptApiKey: async () => ({ id: 'mock-id', keyPrefix: 'sk-****' }),
    decryptApiKey: async () => ({ key: 'mock-key' }),
    deleteApiKey: async () => ({ success: true }),
    listApiKeys: async () => [],

    minimizeToTray: () => {},
    getAppVersion: async () => '0.0.0',

    showSaveDialog: async () => ({ canceled: true, filePath: null }),
    showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
    writeFile: async () => ({ success: true }),
    readFile: async () => ({ success: true, content: '' }),
  }

  window.electronAPI = mock
}
