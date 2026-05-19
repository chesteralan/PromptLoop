import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  mockSetImage: vi.fn(),
  mockSetToolTip: vi.fn(),
  mockSetContextMenu: vi.fn(),
  mockOn: vi.fn(),
  mockDestroy: vi.fn(),
  mockBuildTemplate: vi.fn(),
  mockGetMainWin: vi.fn(),
}))

vi.mock('electron', () => {
  const inst = {
    setImage: mocks.mockSetImage,
    setToolTip: mocks.mockSetToolTip,
    setContextMenu: mocks.mockSetContextMenu,
    on: mocks.mockOn,
    destroy: mocks.mockDestroy,
  }
  return {
    default: {},
    Tray: function () {
      return inst
    },
    Menu: { buildFromTemplate: mocks.mockBuildTemplate },
    nativeImage: { createFromDataURL: () => ({ resize: () => ({}) }) },
    app: { getVersion: () => '', quit: vi.fn() },
  }
})

vi.mock('../window', () => ({ getMainWindow: mocks.mockGetMainWin }))

beforeEach(async () => {
  vi.clearAllMocks()
  mocks.mockBuildTemplate.mockReturnValue({})
  const m = await import('../tray')
  m.resetTray()
})

async function fresh() {
  return await import('../tray')
}

describe('createTray', () => {
  it('creates tray and sets tooltip', async () => {
    const m = await fresh()
    m.createTray()
    expect(mocks.mockSetToolTip).toHaveBeenCalledWith('PromptLoop: Idle')
    expect(mocks.mockOn).toHaveBeenCalledWith('click', expect.any(Function))
  })
})

describe('setTrayStatus', () => {
  it('updates status on existing tray', async () => {
    const m = await fresh()
    m.createTray()
    m.setTrayStatus('running', 'Test')
    expect(mocks.mockSetImage).toHaveBeenCalled()
    expect(mocks.mockSetToolTip).toHaveBeenCalledWith('PromptLoop: Running - Test')
  })

  it('no-op when tray is null', async () => {
    const m = await fresh()
    m.setTrayStatus('running')
    expect(mocks.mockSetImage).not.toHaveBeenCalled()
  })
})

describe('destroyTray', () => {
  it('destroys tray', async () => {
    const m = await fresh()
    m.createTray()
    m.destroyTray()
    expect(mocks.mockDestroy).toHaveBeenCalled()
  })

  it('safe when null', async () => {
    const m = await fresh()
    expect(() => m.destroyTray()).not.toThrow()
  })
})
