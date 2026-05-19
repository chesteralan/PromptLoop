import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockHandle,
  mockOn,
  mockGetVersion,
  mockGetFocusedWindow,
  mockShowSaveDialog,
  mockShowOpenDialog,
  mockReadFile,
  mockWriteFile,
} = vi.hoisted(() => ({
  mockHandle: vi.fn(),
  mockOn: vi.fn(),
  mockGetVersion: vi.fn(),
  mockGetFocusedWindow: vi.fn(),
  mockShowSaveDialog: vi.fn(),
  mockShowOpenDialog: vi.fn(),
  mockReadFile: vi.fn(),
  mockWriteFile: vi.fn(),
}))

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => mockHandle(...args),
    on: (...args: unknown[]) => mockOn(...args),
  },
  app: {
    getVersion: (...args: unknown[]) => mockGetVersion(...args),
  },
  BrowserWindow: {
    getFocusedWindow: (...args: unknown[]) => mockGetFocusedWindow(...args),
  },
  dialog: {
    showSaveDialog: (...args: unknown[]) => mockShowSaveDialog(...args),
    showOpenDialog: (...args: unknown[]) => mockShowOpenDialog(...args),
  },
}))

vi.mock('node:fs/promises', () => {
  const mod = {
    readFile: (...args: unknown[]) => mockReadFile(...args),
    writeFile: (...args: unknown[]) => mockWriteFile(...args),
  }
  return { ...mod, default: mod }
})

type IpcHandler = (...args: unknown[]) => unknown
type IpcListener = (...args: unknown[]) => void

const registeredHandlers = new Map<string, IpcHandler>()
const registeredOn = new Map<string, IpcListener>()

beforeEach(() => {
  vi.clearAllMocks()
  registeredHandlers.clear()
  registeredOn.clear()

  mockHandle.mockImplementation((channel: string, handler: IpcHandler) => {
    registeredHandlers.set(channel, handler)
  })
  mockOn.mockImplementation((channel: string, listener: IpcListener) => {
    registeredOn.set(channel, listener)
  })
})

async function invoke(channel: string, ...args: unknown[]) {
  const handler = registeredHandlers.get(channel)
  if (!handler) throw new Error(`No handler registered for channel: ${channel}`)
  return handler({} as Electron.IpcMainInvokeEvent, ...args)
}

function emit(channel: string, ...args: unknown[]) {
  const listener = registeredOn.get(channel)
  if (!listener) throw new Error(`No listener registered for channel: ${channel}`)
  listener(...args)
}

describe('registerAppIpc', () => {
  it('registers 5 handlers/events', async () => {
    const { registerAppIpc } = await import('../app')
    registerAppIpc()

    expect(registeredHandlers.has('app:get-version')).toBe(true)
    expect(registeredOn.has('app:minimize-to-tray')).toBe(true)
    expect(registeredHandlers.has('dialog:show-save-dialog')).toBe(true)
    expect(registeredHandlers.has('dialog:show-open-dialog')).toBe(true)
    expect(registeredHandlers.has('file:write')).toBe(true)
    expect(registeredHandlers.has('file:read')).toBe(true)
  })

  describe('app:get-version', () => {
    it('returns app version', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockGetVersion.mockReturnValue('1.2.3')

      const result = await invoke('app:get-version')

      expect(result).toBe('1.2.3')
    })
  })

  describe('app:minimize-to-tray', () => {
    it('hides the focused window', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      const hide = vi.fn()
      mockGetFocusedWindow.mockReturnValue({ hide })

      emit('app:minimize-to-tray')

      expect(hide).toHaveBeenCalled()
    })

    it('is safe when no window is focused', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockGetFocusedWindow.mockReturnValue(null)

      expect(() => emit('app:minimize-to-tray')).not.toThrow()
    })
  })

  describe('dialog:show-save-dialog', () => {
    it('returns canceled result when no focused window', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockGetFocusedWindow.mockReturnValue(null)

      const result = await invoke('dialog:show-save-dialog', { title: 'Save' })

      expect(result).toEqual({ canceled: true, filePath: null })
    })

    it('returns dialog result when window is focused', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockGetFocusedWindow.mockReturnValue({})
      mockShowSaveDialog.mockResolvedValue({ canceled: false, filePath: '/tmp/file.txt' })

      const result = await invoke('dialog:show-save-dialog', { title: 'Save' })

      expect(result).toEqual({ canceled: false, filePath: '/tmp/file.txt' })
    })
  })

  describe('dialog:show-open-dialog', () => {
    it('returns canceled result when no focused window', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockGetFocusedWindow.mockReturnValue(null)

      const result = await invoke('dialog:show-open-dialog', { title: 'Open' })

      expect(result).toEqual({ canceled: true, filePaths: [] })
    })

    it('returns dialog result when window is focused', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockGetFocusedWindow.mockReturnValue({})
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/tmp/file.txt'] })

      const result = await invoke('dialog:show-open-dialog', { title: 'Open' })

      expect(result).toEqual({ canceled: false, filePaths: ['/tmp/file.txt'] })
    })
  })

  describe('file:write', () => {
    it('writes file and returns success', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockWriteFile.mockResolvedValue(undefined)

      const result = await invoke('file:write', '/tmp/test.txt', 'hello world')

      expect(result).toEqual({ success: true })
      expect(mockWriteFile).toHaveBeenCalledWith('/tmp/test.txt', 'hello world', 'utf-8')
    })

    it('returns error on write failure', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockWriteFile.mockRejectedValue(new Error('Permission denied'))

      const result = await invoke('file:write', '/tmp/test.txt', 'content')

      expect(result).toEqual({ success: false, error: 'Error: Permission denied' })
    })
  })

  describe('file:read', () => {
    it('reads file and returns content', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockReadFile.mockResolvedValue('file content')

      const result = await invoke('file:read', '/tmp/test.txt')

      expect(result).toEqual({ success: true, content: 'file content' })
      expect(mockReadFile).toHaveBeenCalledWith('/tmp/test.txt', 'utf-8')
    })

    it('returns error on read failure', async () => {
      const { registerAppIpc } = await import('../app')
      registerAppIpc()

      mockReadFile.mockRejectedValue(new Error('File not found'))

      const result = await invoke('file:read', '/tmp/missing.txt')

      expect(result).toEqual({ success: false, error: 'Error: File not found' })
    })
  })
})
