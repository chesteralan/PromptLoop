import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockInvoke, mockOn, mockSend, mockExposeInMainWorld, mockRemoveListener } = vi.hoisted(
  () => ({
    mockInvoke: vi.fn(),
    mockOn: vi.fn(),
    mockSend: vi.fn(),
    mockExposeInMainWorld: vi.fn(),
    mockRemoveListener: vi.fn(),
  }),
)

vi.mock('electron', () => ({
  ipcRenderer: {
    invoke: (...args: unknown[]) => mockInvoke(...args),
    on: (...args: unknown[]) => mockOn(...args),
    send: (...args: unknown[]) => mockSend(...args),
    removeListener: (...args: unknown[]) => mockRemoveListener(...args),
  },
  contextBridge: {
    exposeInMainWorld: (...args: unknown[]) => mockExposeInMainWorld(...args),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

async function importApi() {
  const mod = await import('../index')
  return mod.api
}

describe('module initialization', () => {
  it('exposes api via contextBridge on first import', async () => {
    await import('../index')
    expect(mockExposeInMainWorld).toHaveBeenCalledWith('electronAPI', expect.any(Object))
  })
})

describe('assertSuccess (tested through encryptApiKey)', () => {
  it('throws on failure response', async () => {
    mockInvoke.mockResolvedValue({ success: false, error: 'Something went wrong' })
    const api = await importApi()

    await expect(api.encryptApiKey('openai', 'sk-abc')).rejects.toThrow('Something went wrong')
  })

  it('throws with default message when no error in response', async () => {
    mockInvoke.mockResolvedValue({ success: false })
    const api = await importApi()

    await expect(api.encryptApiKey('openai', 'sk-abc')).rejects.toThrow('Operation failed')
  })
})

describe('workflow control', () => {
  it('startWorkflow invokes correct channel', async () => {
    mockInvoke.mockResolvedValue({ success: true })
    const api = await importApi()

    await api.startWorkflow('wf-1', { loopMode: 'single', prompts: [] }, { openai: 'sk-abc' })

    expect(mockInvoke).toHaveBeenCalledWith('workflow:start', {
      workflowId: 'wf-1',
      config: { loopMode: 'single', prompts: [] },
      apiKeys: { openai: 'sk-abc' },
    })
  })

  it('pauseWorkflow invokes correct channel', async () => {
    const api = await importApi()
    await api.pauseWorkflow('wf-1')
    expect(mockInvoke).toHaveBeenCalledWith('workflow:pause', { workflowId: 'wf-1' })
  })

  it('stopWorkflow invokes correct channel', async () => {
    const api = await importApi()
    await api.stopWorkflow('wf-1')
    expect(mockInvoke).toHaveBeenCalledWith('workflow:stop', { workflowId: 'wf-1' })
  })

  it('retryWorkflow invokes correct channel', async () => {
    const api = await importApi()
    await api.retryWorkflow('wf-1')
    expect(mockInvoke).toHaveBeenCalledWith('workflow:retry', { workflowId: 'wf-1' })
  })
})

describe('execution listeners', () => {
  it.each([
    ['onExecutionChunk', 'execution:chunk'],
    ['onExecutionCompleted', 'execution:completed'],
    ['onExecutionFailed', 'execution:failed'],
    ['onWorkflowCompleted', 'workflow:completed'],
  ])('%s registers listener and returns cleanup function', async (method, channel) => {
    const api = await importApi()
    const callback = vi.fn()
    const cleanup = (api as any)[method](callback)

    expect(mockOn).toHaveBeenCalledWith(channel, expect.any(Function))

    const handler = mockOn.mock.calls.find((c: [string]) => c[0] === channel)?.[1]
    handler({}, { data: 'test' })
    expect(callback).toHaveBeenCalledWith({ data: 'test' })

    cleanup()
    expect(mockRemoveListener).toHaveBeenCalledWith(channel, handler)
  })
})

describe('api key operations', () => {
  it('encryptApiKey invokes and validates response', async () => {
    mockInvoke.mockResolvedValue({ success: true, id: 'uuid-1', keyPrefix: 'sk-abc...' })
    const api = await importApi()

    const result = await api.encryptApiKey('openai', 'sk-abc123')

    expect(mockInvoke).toHaveBeenCalledWith('api-key:encrypt', {
      provider: 'openai',
      key: 'sk-abc123',
    })
    expect(result).toEqual({ id: 'uuid-1', keyPrefix: 'sk-abc...' })
  })

  it('encryptApiKey throws on missing fields in response', async () => {
    mockInvoke.mockResolvedValue({ success: true })
    const api = await importApi()

    await expect(api.encryptApiKey('openai', 'sk-abc')).rejects.toThrow(
      'Encryption response missing fields',
    )
  })

  it('decryptApiKey invokes and validates response', async () => {
    mockInvoke.mockResolvedValue({ success: true, key: 'sk-decrypted' })
    const api = await importApi()

    const result = await api.decryptApiKey('uuid-1')

    expect(mockInvoke).toHaveBeenCalledWith('api-key:decrypt', { keyId: 'uuid-1' })
    expect(result).toEqual({ key: 'sk-decrypted' })
  })

  it('decryptApiKey throws on missing key in response', async () => {
    mockInvoke.mockResolvedValue({ success: true })
    const api = await importApi()

    await expect(api.decryptApiKey('uuid-1')).rejects.toThrow('Decryption response missing key')
  })

  it('deleteApiKey invokes correct channel', async () => {
    const api = await importApi()
    await api.deleteApiKey('uuid-1')
    expect(mockInvoke).toHaveBeenCalledWith('api-key:delete', { keyId: 'uuid-1' })
  })

  it('listApiKeys invokes and returns keys array', async () => {
    const keys = [{ id: '1', provider: 'openai', keyPrefix: 'sk-abc', createdAt: '2024-01-01' }]
    mockInvoke.mockResolvedValue({ success: true, keys })
    const api = await importApi()

    const result = await api.listApiKeys()

    expect(mockInvoke).toHaveBeenCalledWith('api-key:list')
    expect(result).toEqual(keys)
  })

  it('listApiKeys returns empty array when keys missing', async () => {
    mockInvoke.mockResolvedValue({ success: true })
    const api = await importApi()

    const result = await api.listApiKeys()

    expect(result).toEqual([])
  })
})

describe('app operations', () => {
  it('minimizeToTray sends event', async () => {
    const api = await importApi()
    api.minimizeToTray()
    expect(mockSend).toHaveBeenCalledWith('app:minimize-to-tray')
  })

  it('getAppVersion invokes correct channel', async () => {
    mockInvoke.mockResolvedValue('1.2.3')
    const api = await importApi()

    const result = await api.getAppVersion()

    expect(mockInvoke).toHaveBeenCalledWith('app:get-version')
    expect(result).toBe('1.2.3')
  })
})

describe('dialog operations', () => {
  it('showSaveDialog invokes correct channel', async () => {
    const api = await importApi()
    await api.showSaveDialog({ title: 'Save' })
    expect(mockInvoke).toHaveBeenCalledWith('dialog:show-save-dialog', { title: 'Save' })
  })

  it('showOpenDialog invokes correct channel', async () => {
    const api = await importApi()
    await api.showOpenDialog({ title: 'Open' })
    expect(mockInvoke).toHaveBeenCalledWith('dialog:show-open-dialog', { title: 'Open' })
  })
})

describe('file operations', () => {
  it('writeFile invokes correct channel', async () => {
    const api = await importApi()
    await api.writeFile('/tmp/test.txt', 'hello')
    expect(mockInvoke).toHaveBeenCalledWith('file:write', '/tmp/test.txt', 'hello')
  })

  it('readFile invokes correct channel', async () => {
    const api = await importApi()
    await api.readFile('/tmp/test.txt')
    expect(mockInvoke).toHaveBeenCalledWith('file:read', '/tmp/test.txt')
  })
})
