import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRegister = vi.fn()
const mockUnregisterAll = vi.fn()
const mockGetFocusedWindow = vi.fn()
const mockSend = vi.fn()
const mockIsDestroyed = vi.fn()

vi.mock('electron', () => ({
  globalShortcut: {
    register: mockRegister,
    unregisterAll: mockUnregisterAll,
  },
  BrowserWindow: {
    getFocusedWindow: mockGetFocusedWindow,
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockRegister.mockReset()
  mockRegister.mockReturnValue(true)
  mockIsDestroyed.mockReturnValue(false)
  mockGetFocusedWindow.mockReset()
})

describe('registerShortcuts', () => {
  it('registers all three shortcuts', async () => {
    const { registerShortcuts, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()
    expect(mockRegister).toHaveBeenCalledTimes(3)
    expect(mockRegister).toHaveBeenCalledWith('CommandOrControl+Return', expect.any(Function))
    expect(mockRegister).toHaveBeenCalledWith('CommandOrControl+Shift+Return', expect.any(Function))
    expect(mockRegister).toHaveBeenCalledWith('CommandOrControl+.', expect.any(Function))
    unregisterShortcuts()
  })

  it('does not register twice', async () => {
    const { registerShortcuts, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()
    registerShortcuts()
    expect(mockRegister).toHaveBeenCalledTimes(3)
    unregisterShortcuts()
  })

  it('warns on individual registration failure', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockRegister.mockReturnValueOnce(false)
    const { registerShortcuts, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()
    expect(warn).toHaveBeenCalledWith('Failed to register global shortcut: CommandOrControl+Return')
    unregisterShortcuts()
    warn.mockRestore()
  })
})

describe('shortcut actions', () => {
  it('sends tray:action to focused window on shortcut press', async () => {
    mockGetFocusedWindow.mockReturnValue({
      webContents: { send: mockSend },
      isDestroyed: mockIsDestroyed,
    })
    const { registerShortcuts, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()

    const startHandler = mockRegister.mock.calls.find(
      (c: unknown[]) => c[0] === 'CommandOrControl+Return',
    )![1]
    startHandler()
    expect(mockSend).toHaveBeenCalledWith('tray:action', 'start')

    const pauseHandler = mockRegister.mock.calls.find(
      (c: unknown[]) => c[0] === 'CommandOrControl+Shift+Return',
    )![1]
    pauseHandler()
    expect(mockSend).toHaveBeenCalledWith('tray:action', 'pause')

    const stopHandler = mockRegister.mock.calls.find(
      (c: unknown[]) => c[0] === 'CommandOrControl+.',
    )![1]
    stopHandler()
    expect(mockSend).toHaveBeenCalledWith('tray:action', 'stop')

    unregisterShortcuts()
  })

  it('does not send when window is destroyed', async () => {
    mockGetFocusedWindow.mockReturnValue({
      webContents: { send: mockSend },
      isDestroyed: () => true,
    })
    const { registerShortcuts, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()

    const handler = mockRegister.mock.calls[0][1]
    handler()
    expect(mockSend).not.toHaveBeenCalled()
    unregisterShortcuts()
  })

  it('does not send when no focused window', async () => {
    mockGetFocusedWindow.mockReturnValue(null)
    const { registerShortcuts, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()

    const handler = mockRegister.mock.calls[0][1]
    handler()
    expect(mockSend).not.toHaveBeenCalled()
    unregisterShortcuts()
  })
})

describe('isRegistered', () => {
  it('returns false before registration', async () => {
    const { isRegistered } = await import('../shortcuts')
    expect(isRegistered()).toBe(false)
  })

  it('returns true after registration', async () => {
    const { registerShortcuts, isRegistered, unregisterShortcuts } = await import('../shortcuts')
    registerShortcuts()
    expect(isRegistered()).toBe(true)
    unregisterShortcuts()
  })
})

describe('unregisterShortcuts', () => {
  it('calls unregisterAll and resets registered flag', async () => {
    const { registerShortcuts, unregisterShortcuts, isRegistered } = await import('../shortcuts')
    registerShortcuts()
    unregisterShortcuts()
    expect(mockUnregisterAll).toHaveBeenCalled()
    expect(isRegistered()).toBe(false)
  })
})
