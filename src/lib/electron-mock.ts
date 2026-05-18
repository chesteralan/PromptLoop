import type { ElectronAPI } from './ipc'

function noop(): void {}

const asyncNoop: (...args: unknown[]) => Promise<unknown> = () => Promise.resolve(undefined)

export function injectElectronMock(): void {
  if (typeof window === 'undefined' || window.electronAPI) return

  const mock: ElectronAPI = {
    startWorkflow: asyncNoop as ElectronAPI['startWorkflow'],
    pauseWorkflow: asyncNoop as ElectronAPI['pauseWorkflow'],
    stopWorkflow: asyncNoop as ElectronAPI['stopWorkflow'],
    retryWorkflow: asyncNoop as ElectronAPI['retryWorkflow'],
    onExecutionChunk: () => noop,
    onExecutionCompleted: () => noop,
    onExecutionFailed: () => noop,
    onWorkflowCompleted: () => noop,
    encryptApiKey: asyncNoop as ElectronAPI['encryptApiKey'],
    decryptApiKey: asyncNoop as ElectronAPI['decryptApiKey'],
    deleteApiKey: asyncNoop as ElectronAPI['deleteApiKey'],
    listApiKeys: () => Promise.resolve([]),
    minimizeToTray: noop,
    getAppVersion: () => Promise.resolve('0.0.0'),
    showSaveDialog: () => Promise.resolve({ canceled: true, filePath: null }),
    showOpenDialog: () => Promise.resolve({ canceled: true, filePaths: [] }),
    writeFile: () => Promise.resolve({ success: true }),
    readFile: () => Promise.resolve({ success: true, content: '' }),
  }

  window.electronAPI = mock
}
