import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  appHandlers,
  mockApp,
  mockIpcMain,
  mockDialog,
  mockGetAllWindows,
  mockCreateWindow,
  mockCreateTray,
  mockDestroyTray,
  mockSetTrayStatus,
  mockRegisterShortcuts,
  mockUnregisterShortcuts,
  mockInitSentry,
  mockRegisterWorkflowIpc,
  mockRegisterExecutionIpc,
  mockRegisterApiKeysIpc,
  mockRegisterAppIpc,
  mockWindowInstance,
} = vi.hoisted(() => {
  const appHandlers: Record<string, (...args: unknown[]) => unknown> = {}

  const mockWindowInstance = {
    webContents: { setWindowOpenHandler: vi.fn() },
    loadURL: vi.fn(),
    loadFile: vi.fn(),
  }

  const mockApp = {
    whenReady: vi.fn(),
    on: vi.fn((event: string, handler: (...args: unknown[]) => unknown) => {
      appHandlers[event] = handler
    }),
    quit: vi.fn(),
    getPath: vi.fn(),
  }

  const mockIpcMain = { on: vi.fn() }
  const mockDialog = { showErrorBox: vi.fn() }
  const mockGetAllWindows = vi.fn()

  const mockCreateWindow = vi.fn(() => mockWindowInstance)
  const mockCreateTray = vi.fn()
  const mockDestroyTray = vi.fn()
  const mockSetTrayStatus = vi.fn()

  const mockRegisterShortcuts = vi.fn()
  const mockUnregisterShortcuts = vi.fn()

  const mockInitSentry = vi.fn()

  const mockRegisterWorkflowIpc = vi.fn()
  const mockRegisterExecutionIpc = vi.fn()
  const mockRegisterApiKeysIpc = vi.fn()
  const mockRegisterAppIpc = vi.fn()

  return {
    appHandlers,
    mockApp,
    mockIpcMain,
    mockDialog,
    mockGetAllWindows,
    mockCreateWindow,
    mockCreateTray,
    mockDestroyTray,
    mockSetTrayStatus,
    mockRegisterShortcuts,
    mockUnregisterShortcuts,
    mockInitSentry,
    mockRegisterWorkflowIpc,
    mockRegisterExecutionIpc,
    mockRegisterApiKeysIpc,
    mockRegisterAppIpc,
    mockWindowInstance,
  }
})

vi.mock('electron', () => ({
  app: mockApp,
  BrowserWindow: { getAllWindows: mockGetAllWindows },
  ipcMain: mockIpcMain,
  dialog: mockDialog,
}))

vi.mock('../window', () => ({ createWindow: mockCreateWindow }))
vi.mock('../tray', () => ({
  createTray: mockCreateTray,
  destroyTray: mockDestroyTray,
  setTrayStatus: mockSetTrayStatus,
}))
vi.mock('../shortcuts', () => ({
  registerShortcuts: mockRegisterShortcuts,
  unregisterShortcuts: mockUnregisterShortcuts,
}))
vi.mock('../sentry', () => ({ initSentry: mockInitSentry }))
vi.mock('../ipc/workflow', () => ({ registerWorkflowIpc: mockRegisterWorkflowIpc }))
vi.mock('../ipc/execution', () => ({ registerExecutionIpc: mockRegisterExecutionIpc }))
vi.mock('../ipc/api-keys', () => ({ registerApiKeysIpc: mockRegisterApiKeysIpc }))
vi.mock('../ipc/app', () => ({ registerAppIpc: mockRegisterAppIpc }))

async function loadModule() {
  return import('../index')
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  delete process.env.VITE_DEV_SERVER_URL
  mockApp.whenReady.mockResolvedValue(undefined)
  mockGetAllWindows.mockReturnValue([])
  mockCreateWindow.mockReturnValue(mockWindowInstance)
})

describe('module initialization', () => {
  it('registers all IPC handlers on module load', async () => {
    await loadModule()
    expect(mockRegisterWorkflowIpc).toHaveBeenCalledOnce()
    expect(mockRegisterExecutionIpc).toHaveBeenCalledOnce()
    expect(mockRegisterApiKeysIpc).toHaveBeenCalledOnce()
    expect(mockRegisterAppIpc).toHaveBeenCalledOnce()
  })

  it('registers app event listeners on module load', async () => {
    await loadModule()
    expect(mockApp.on).toHaveBeenCalledWith('before-quit', expect.any(Function))
    expect(mockApp.on).toHaveBeenCalledWith('will-quit', expect.any(Function))
    expect(mockApp.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function))
    expect(mockApp.on).toHaveBeenCalledWith('activate', expect.any(Function))
  })

  it('registers tray:action IPC handler', async () => {
    await loadModule()
    expect(mockIpcMain.on).toHaveBeenCalledWith('tray:action', expect.any(Function))
  })

  it('calls app.whenReady on module load', async () => {
    await loadModule()
    expect(mockApp.whenReady).toHaveBeenCalledOnce()
  })
})

describe('before-quit', () => {
  it('sets globalThis.__isQuitting to true', async () => {
    await loadModule()
    expect(globalThis.__isQuitting).toBeUndefined()
    appHandlers['before-quit']()
    expect(globalThis.__isQuitting).toBe(true)
  })
})

describe('will-quit', () => {
  it('unregisters shortcuts and destroys tray', async () => {
    await loadModule()
    appHandlers['will-quit']()
    expect(mockUnregisterShortcuts).toHaveBeenCalledOnce()
    expect(mockDestroyTray).toHaveBeenCalledOnce()
  })
})

describe('window-all-closed', () => {
  it('quits the app on non-macOS', async () => {
    const origPlatform = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true,
      writable: true,
    })
    await loadModule()
    appHandlers['window-all-closed']()
    expect(mockApp.quit).toHaveBeenCalledOnce()
    Object.defineProperty(process, 'platform', origPlatform)
  })

  it('does nothing on macOS', async () => {
    await loadModule()
    appHandlers['window-all-closed']()
    expect(mockApp.quit).not.toHaveBeenCalled()
  })
})

describe('activate', () => {
  it('creates window when no windows exist (macOS)', async () => {
    mockGetAllWindows.mockReturnValue([])
    await loadModule()
    const callsBefore = mockCreateWindow.mock.calls.length
    appHandlers['activate']()
    expect(mockCreateWindow).toHaveBeenCalledTimes(callsBefore + 1)
  })

  it('does nothing when windows already exist', async () => {
    await loadModule()
    mockGetAllWindows.mockReturnValue([{} as any])
    const callsBefore = mockCreateWindow.mock.calls.length
    appHandlers['activate']()
    expect(mockCreateWindow).toHaveBeenCalledTimes(callsBefore)
  })
})

describe('tray:action', () => {
  function getTrayActionHandler(): (...args: unknown[]) => void {
    return mockIpcMain.on.mock.calls.find(([channel]) => channel === 'tray:action')![1] as any
  }

  it('dispatches start action to setTrayStatus', async () => {
    await loadModule()
    getTrayActionHandler()({}, 'start')
    expect(mockSetTrayStatus).toHaveBeenCalledWith('running', 'Active Workflow')
  })

  it('dispatches pause action to setTrayStatus', async () => {
    await loadModule()
    getTrayActionHandler()({}, 'pause')
    expect(mockSetTrayStatus).toHaveBeenCalledWith('paused')
  })

  it('dispatches stop action to setTrayStatus', async () => {
    await loadModule()
    getTrayActionHandler()({}, 'stop')
    expect(mockSetTrayStatus).toHaveBeenCalledWith('idle')
  })

  it('silently ignores unknown actions', async () => {
    await loadModule()
    getTrayActionHandler()({}, 'unknown')
    expect(mockSetTrayStatus).not.toHaveBeenCalled()
  })
})

describe('app startup', () => {
  it('initializes Sentry, window, tray, and shortcuts on successful startup', async () => {
    await loadModule()
    expect(mockInitSentry).toHaveBeenCalledOnce()
    expect(mockCreateWindow).toHaveBeenCalledOnce()
    expect(mockCreateTray).toHaveBeenCalledOnce()
    expect(mockRegisterShortcuts).toHaveBeenCalledOnce()
  })

  it('shows error dialog when startup fails', async () => {
    mockApp.whenReady.mockRejectedValue(new Error('DB connection failed'))
    await loadModule()
    expect(mockDialog.showErrorBox).toHaveBeenCalledWith(
      'Startup Error',
      expect.stringContaining('DB connection failed'),
    )
  })
})

describe('VITE_DEV_SERVER_URL', () => {
  it('loads dev server URL when VITE_DEV_SERVER_URL is set', async () => {
    process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173'
    await loadModule()
    expect(mockWindowInstance.loadURL).toHaveBeenCalledWith('http://localhost:5173')
    expect(mockWindowInstance.loadFile).not.toHaveBeenCalled()
  })

  it('loads production file when VITE_DEV_SERVER_URL is not set', async () => {
    await loadModule()
    expect(mockWindowInstance.loadFile).toHaveBeenCalled()
    expect(mockWindowInstance.loadURL).not.toHaveBeenCalled()
  })
})

describe('setWindowOpenHandler', () => {
  function getWindowOpenHandler(): (arg: { url: string }) => {
    action: string
    overrideBrowserWindowOptions?: Record<string, unknown>
  } {
    return mockWindowInstance.webContents.setWindowOpenHandler.mock.calls[0][0]
  }

  const expectedOAuthOptions = {
    width: 500,
    height: 700,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  }

  it('allows accounts.google.com URLs with OAuth window options', async () => {
    await loadModule()
    const result = getWindowOpenHandler()({ url: 'https://accounts.google.com/o/oauth2/auth' })
    expect(result).toEqual({ action: 'allow', overrideBrowserWindowOptions: expectedOAuthOptions })
  })

  it('allows github.com URLs with OAuth window options', async () => {
    await loadModule()
    const result = getWindowOpenHandler()({ url: 'https://github.com/login/oauth/authorize' })
    expect(result).toEqual({ action: 'allow', overrideBrowserWindowOptions: expectedOAuthOptions })
  })

  it('allows firebase auth handler URLs with OAuth window options', async () => {
    await loadModule()
    const result = getWindowOpenHandler()({
      url: 'https://project.firebaseapp.com/__/auth/handler',
    })
    expect(result).toEqual({ action: 'allow', overrideBrowserWindowOptions: expectedOAuthOptions })
  })

  it('allows other URLs with default options', async () => {
    await loadModule()
    const result = getWindowOpenHandler()({ url: 'https://example.com/page' })
    expect(result).toEqual({ action: 'allow' })
  })
})
