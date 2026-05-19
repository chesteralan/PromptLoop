import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockHandle, mockEncrypt, mockDecrypt, mockList, mockDelete } = vi.hoisted(() => ({
  mockHandle: vi.fn(),
  mockEncrypt: vi.fn(),
  mockDecrypt: vi.fn(),
  mockList: vi.fn(),
  mockDelete: vi.fn(),
}))

type IpcHandler = (...args: unknown[]) => unknown

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => mockHandle(...args),
  },
}))

vi.mock('../../encryption', () => ({
  encryptApiKey: (...args: unknown[]) => mockEncrypt(...args),
  decryptApiKey: (...args: unknown[]) => mockDecrypt(...args),
  listApiKeys: (...args: unknown[]) => mockList(...args),
  deleteApiKey: (...args: unknown[]) => mockDelete(...args),
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

describe('registerApiKeysIpc', () => {
  it('registers 4 IPC handlers', async () => {
    const { registerApiKeysIpc } = await import('../api-keys')
    registerApiKeysIpc()

    expect(registeredHandlers.has('api-key:encrypt')).toBe(true)
    expect(registeredHandlers.has('api-key:decrypt')).toBe(true)
    expect(registeredHandlers.has('api-key:list')).toBe(true)
    expect(registeredHandlers.has('api-key:delete')).toBe(true)
  })

  describe('api-key:encrypt', () => {
    it('encrypts a valid provider key', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockEncrypt.mockReturnValue({
        ok: true,
        value: { id: 'uuid-1', keyPrefix: 'sk-abc...' },
      })

      const result = await invoke('api-key:encrypt', { provider: 'openai', key: 'sk-abc123' })

      expect(result).toEqual({ success: true, id: 'uuid-1', keyPrefix: 'sk-abc...' })
      expect(mockEncrypt).toHaveBeenCalledWith('openai', 'sk-abc123')
    })

    it('returns error for invalid provider', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      const result = await invoke('api-key:encrypt', {
        provider: 'invalid',
        key: 'sk-abc123',
      })

      expect(result).toEqual({ success: false, error: 'Invalid provider: invalid' })
    })

    it('returns error on encrypt failure', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockEncrypt.mockReturnValue({ ok: false, error: 'Encryption failed' })

      const result = await invoke('api-key:encrypt', { provider: 'openai', key: 'sk-abc123' })

      expect(result).toEqual({ success: false, error: 'Encryption failed' })
    })
  })

  describe('api-key:decrypt', () => {
    it('decrypts a key by id', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockDecrypt.mockReturnValue({ ok: true, value: { key: 'sk-decrypted' } })

      const result = await invoke('api-key:decrypt', { keyId: 'uuid-1' })

      expect(result).toEqual({ success: true, key: 'sk-decrypted' })
      expect(mockDecrypt).toHaveBeenCalledWith('uuid-1')
    })

    it('returns error on decrypt failure', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockDecrypt.mockReturnValue({ ok: false, error: 'Key not found' })

      const result = await invoke('api-key:decrypt', { keyId: 'missing' })

      expect(result).toEqual({ success: false, error: 'Key not found' })
    })
  })

  describe('api-key:list', () => {
    it('returns list of keys', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockList.mockReturnValue([
        { id: '1', provider: 'openai', keyPrefix: 'sk-abc', createdAt: '2024-01-01' },
      ])

      const result = await invoke('api-key:list')

      expect(result).toEqual({
        success: true,
        keys: [{ id: '1', provider: 'openai', keyPrefix: 'sk-abc', createdAt: '2024-01-01' }],
      })
    })
  })

  describe('api-key:delete', () => {
    it('deletes a key by id', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockDelete.mockReturnValue({ ok: true, value: { success: true } })

      const result = await invoke('api-key:delete', { keyId: 'uuid-1' })

      expect(result).toEqual({ success: true })
      expect(mockDelete).toHaveBeenCalledWith('uuid-1')
    })

    it('returns error on delete failure', async () => {
      const { registerApiKeysIpc } = await import('../api-keys')
      registerApiKeysIpc()

      mockDelete.mockReturnValue({ ok: false, error: 'Key not found' })

      const result = await invoke('api-key:delete', { keyId: 'missing' })

      expect(result).toEqual({ success: false, error: 'Key not found' })
    })
  })
})
