import { describe, it, expect, vi, beforeEach } from 'vitest'
import { emit } from '../events'

vi.mock('electron', () => ({
  BrowserWindow: {
    getAllWindows: vi.fn(),
  },
}))

import { BrowserWindow } from 'electron'

interface MockWindow {
  isDestroyed: () => boolean
  webContents: { send: ReturnType<typeof vi.fn> }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('emit', () => {
  it('sends event to first window', () => {
    const win: MockWindow = { isDestroyed: () => false, webContents: { send: vi.fn() } }
    vi.mocked(BrowserWindow.getAllWindows).mockReturnValue([win as any])

    emit('execution:chunk', { workflowId: 'wf-1', promptId: 'p-1', chunk: 'hello' })

    expect(win.webContents.send).toHaveBeenCalledWith('execution:chunk', {
      workflowId: 'wf-1',
      promptId: 'p-1',
      chunk: 'hello',
    })
  })

  it('sends to all non-destroyed windows', () => {
    const win1: MockWindow = { isDestroyed: () => false, webContents: { send: vi.fn() } }
    const win2: MockWindow = { isDestroyed: () => false, webContents: { send: vi.fn() } }
    vi.mocked(BrowserWindow.getAllWindows).mockReturnValue([win1 as any, win2 as any])

    emit('execution:chunk', { workflowId: 'wf-1', promptId: 'p-1', chunk: 'hello' })

    expect(win1.webContents.send).toHaveBeenCalledTimes(1)
    expect(win2.webContents.send).toHaveBeenCalledTimes(1)
  })

  it('skips destroyed windows', () => {
    const alive: MockWindow = { isDestroyed: () => false, webContents: { send: vi.fn() } }
    const destroyed: MockWindow = { isDestroyed: () => true, webContents: { send: vi.fn() } }
    vi.mocked(BrowserWindow.getAllWindows).mockReturnValue([alive as any, destroyed as any])

    emit('execution:status', {
      workflowId: 'wf-1',
      currentIndex: 0,
      totalPrompts: 1,
      loopIteration: 0,
      phase: 'executing',
    })

    expect(alive.webContents.send).toHaveBeenCalledTimes(1)
    expect(destroyed.webContents.send).not.toHaveBeenCalled()
  })

  it('handles no windows at all', () => {
    vi.mocked(BrowserWindow.getAllWindows).mockReturnValue([])

    expect(() => {
      emit('execution:started', {
        workflowId: 'wf-1',
        promptId: 'p-1',
        model: 'gpt-4o',
        timestamp: 1000,
      })
    }).not.toThrow()
  })

  it('handles all windows destroyed', () => {
    const destroyed: MockWindow = { isDestroyed: () => true, webContents: { send: vi.fn() } }
    vi.mocked(BrowserWindow.getAllWindows).mockReturnValue([destroyed as any])

    expect(() => {
      emit('workflow:completed', { workflowId: 'wf-1', iterations: 5 })
    }).not.toThrow()
    expect(destroyed.webContents.send).not.toHaveBeenCalled()
  })
})
