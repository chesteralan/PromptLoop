import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  getPath: vi.fn(),
  getAllDisplays: vi.fn(),
  getPrimaryDisplay: vi.fn(),
  getDisplayMatching: vi.fn(),
  on: vi.fn(),
  isMaximized: vi.fn(),
  getBounds: vi.fn(),
  setSize: vi.fn(),
  setPosition: vi.fn(),
  maximize: vi.fn(),
  show: vi.fn(),
  hide: vi.fn(),
  destroy: vi.fn(),
  ipcOn: vi.fn(),
  removeListener: vi.fn(),
}))

vi.mock('electron', () => {
  function BrowserWindowMock() {
    return {
      on: mocks.on,
      isMaximized: mocks.isMaximized,
      getBounds: mocks.getBounds,
      setSize: mocks.setSize,
      setPosition: mocks.setPosition,
      maximize: mocks.maximize,
      show: mocks.show,
      hide: mocks.hide,
      destroy: mocks.destroy,
    }
  }
  return {
    default: {},
    BrowserWindow: BrowserWindowMock,
    screen: {
      getAllDisplays: mocks.getAllDisplays,
      getPrimaryDisplay: mocks.getPrimaryDisplay,
      getDisplayMatching: mocks.getDisplayMatching,
    },
    ipcMain: {
      on: mocks.ipcOn,
      removeListener: mocks.removeListener,
    },
    app: { getPath: mocks.getPath },
  }
})

vi.mock('node:fs', () => {
  const mod = {
    existsSync: (...args: unknown[]) => mocks.existsSync(...args),
    readFileSync: (...args: unknown[]) => mocks.readFileSync(...args),
    writeFileSync: (...args: unknown[]) => mocks.writeFileSync(...args),
  }
  return { ...mod, default: mod }
})

beforeEach(async () => {
  vi.clearAllMocks()
  mocks.getPath.mockReturnValue('/mock/userData')
  mocks.existsSync.mockReturnValue(false)
  mocks.getAllDisplays.mockReturnValue([{ bounds: { x: 0, y: 0, width: 1920, height: 1080 } }])
  mocks.getPrimaryDisplay.mockReturnValue({ bounds: { x: 0, y: 0, width: 1920, height: 1080 } })
  mocks.getBounds.mockReturnValue({ x: 0, y: 0, width: 1200, height: 800 })
  const mod = await import('../window')
  mod.resetWindow?.()
})

describe('setMinimizeToTray', () => {
  it('defaults to true', async () => {
    const mod = await import('../window')
    expect(mod.getMinimizeToTray()).toBe(true)
  })

  it('can be toggled', async () => {
    const mod = await import('../window')
    mod.setMinimizeToTray(false)
    expect(mod.getMinimizeToTray()).toBe(false)
  })
})

describe('createWindow', () => {
  it('creates BrowserWindow with defaults', async () => {
    const mod = await import('../window')
    mod.createWindow()
    expect(mocks.isMaximized).not.toHaveBeenCalled()
    expect(mocks.on).toHaveBeenCalledWith('ready-to-show', expect.any(Function))
    expect(mocks.on).toHaveBeenCalledWith('close', expect.any(Function))
    expect(mocks.on).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(mocks.on).toHaveBeenCalledWith('move', expect.any(Function))
    expect(mocks.on).toHaveBeenCalledWith('maximize', expect.any(Function))
    expect(mocks.on).toHaveBeenCalledWith('unmaximize', expect.any(Function))
    expect(mocks.on).toHaveBeenCalledWith('closed', expect.any(Function))
  })

  it('restores maximized state', async () => {
    mocks.existsSync.mockReturnValue(true)
    mocks.readFileSync.mockReturnValue(
      JSON.stringify({
        width: 1200,
        height: 800,
        isMaximized: true,
        mode: 'full',
      }),
    )
    const mod = await import('../window')
    mod.resetWindow()
    mod.createWindow()
    expect(mocks.maximize).toHaveBeenCalled()
  })
})

describe('getMainWindow', () => {
  it('returns null before createWindow', async () => {
    const mod = await import('../window')
    expect(mod.getMainWindow()).toBeNull()
  })

  it('returns window after createWindow', async () => {
    const mod = await import('../window')
    mod.createWindow()
    expect(mod.getMainWindow()).toBeTruthy()
  })
})
