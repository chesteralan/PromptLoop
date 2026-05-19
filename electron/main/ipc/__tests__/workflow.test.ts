import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockHandle, mockRunner } = vi.hoisted(() => {
  const pendingStart = new Promise<void>(() => {})
  return {
    mockHandle: vi.fn(),
    mockRunner: {
      start: vi.fn().mockReturnValue(pendingStart),
      pause: vi.fn(),
      stop: vi.fn(),
      getStatus: vi.fn(),
    },
  }
})

type IpcHandler = (...args: unknown[]) => unknown

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => mockHandle(...args),
  },
}))

vi.mock('../../engine/runner', () => ({
  WorkflowRunner: function () {
    return mockRunner
  } as unknown as new (...args: unknown[]) => object,
}))

const registeredHandlers = new Map<string, IpcHandler>()

beforeEach(() => {
  vi.clearAllMocks()
  registeredHandlers.clear()

  mockHandle.mockImplementation((channel: string, handler: IpcHandler) => {
    registeredHandlers.set(channel, handler)
  })
})

async function invoke(channel: string, ...args: unknown[]) {
  const handler = registeredHandlers.get(channel)
  if (!handler) throw new Error(`No handler registered for channel: ${channel}`)
  return handler({} as Electron.IpcMainInvokeEvent, ...args)
}

describe('registerWorkflowIpc', () => {
  it('registers 5 IPC handlers', async () => {
    const { registerWorkflowIpc } = await import('../workflow')
    registerWorkflowIpc()

    expect(registeredHandlers.has('workflow:start')).toBe(true)
    expect(registeredHandlers.has('workflow:pause')).toBe(true)
    expect(registeredHandlers.has('workflow:stop')).toBe(true)
    expect(registeredHandlers.has('workflow:retry')).toBe(true)
    expect(registeredHandlers.has('workflow:status')).toBe(true)
  })

  describe('workflow:start', () => {
    it('returns success and creates runner', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      const result = await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: { openai: 'sk-abc' },
      })

      expect(result).toEqual({ success: true, workflowId: 'wf-1' })
    })

    it('returns error if workflow already running', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: { openai: 'sk-abc' },
      })

      const result = await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: { openai: 'sk-abc' },
      })

      expect(result).toEqual({ success: false, error: 'Workflow is already running' })
    })
  })

  describe('workflow:pause', () => {
    it('pauses an active runner', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: {},
      })

      const result = await invoke('workflow:pause', { workflowId: 'wf-1' })

      expect(result).toEqual({ success: true, workflowId: 'wf-1' })
      expect(mockRunner.pause).toHaveBeenCalled()
    })

    it('returns error if runner not found', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      const result = await invoke('workflow:pause', { workflowId: 'nonexistent' })

      expect(result).toEqual({ success: false, error: 'Workflow not found' })
    })
  })

  describe('workflow:stop', () => {
    it('stops the runner and returns success', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: {},
      })

      const result = await invoke('workflow:stop', { workflowId: 'wf-1' })

      expect(result).toEqual({ success: true, workflowId: 'wf-1' })
    })

    it('is safe for missing runner', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      const result = await invoke('workflow:stop', { workflowId: 'nonexistent' })

      expect(result).toEqual({ success: true, workflowId: 'nonexistent' })
    })
  })

  describe('workflow:retry', () => {
    it('stops runner and returns success', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: {},
      })

      const result = await invoke('workflow:retry', { workflowId: 'wf-1' })

      expect(result).toEqual({ success: true, workflowId: 'wf-1' })
      expect(mockRunner.stop).toHaveBeenCalled()
    })

    it('returns error if runner not found', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      const result = await invoke('workflow:retry', { workflowId: 'nonexistent' })

      expect(result).toEqual({ success: false, error: 'Workflow not found' })
    })
  })

  describe('workflow:status', () => {
    it('returns runner status', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      mockRunner.getStatus.mockReturnValue({ state: 'running', currentIndex: 1, loopIteration: 0 })

      await invoke('workflow:start', {
        workflowId: 'wf-1',
        config: { id: 'wf-1', name: 'test', loopMode: 'single', prompts: [] },
        apiKeys: {},
      })

      const result = await invoke('workflow:status', { workflowId: 'wf-1' })

      expect(result).toEqual({
        success: true,
        status: { state: 'running', currentIndex: 1, loopIteration: 0 },
      })
    })

    it('returns error if runner not found', async () => {
      const { registerWorkflowIpc } = await import('../workflow')
      registerWorkflowIpc()

      const result = await invoke('workflow:status', { workflowId: 'nonexistent' })

      expect(result).toEqual({ success: false, error: 'Workflow not found' })
    })
  })
})
