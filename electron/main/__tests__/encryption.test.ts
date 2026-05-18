import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockEncryptString = vi.fn()
const mockDecryptString = vi.fn()
const mockIsEncryptionAvailable = vi.fn()

vi.mock('electron', () => {
  const mod = {
    safeStorage: {
      encryptString: mockEncryptString,
      decryptString: mockDecryptString,
      isEncryptionAvailable: mockIsEncryptionAvailable,
    },
    app: { getPath: () => '/mock/userData' },
  }
  return { ...mod, default: mod }
})

vi.mock('node:fs', () => {
  const fs = { existsSync: () => false, readFileSync: () => '', writeFileSync: () => {} }
  return { ...fs, default: fs }
})

vi.mock('node:crypto', () => {
  const mod = { randomUUID: () => 'mock-uuid' }
  return { ...mod, default: mod }
})

beforeEach(() => {
  vi.clearAllMocks()
  mockIsEncryptionAvailable.mockReturnValue(true)
  mockEncryptString.mockImplementation((s: string) => Buffer.from('enc:' + s))
  mockDecryptString.mockImplementation((b: Buffer) => b.toString().replace('enc:', ''))
})

async function fresh() {
  const m = await import('../encryption')
  m.resetStore()
  return m
}

describe('isEncryptionAvailable', () => {
  it('returns true when available', async () => {
    const mod = await fresh()
    expect(mod.isEncryptionAvailable()).toBe(true)
  })

  it('returns false when unavailable', async () => {
    mockIsEncryptionAvailable.mockReturnValue(false)
    const mod = await fresh()
    expect(mod.isEncryptionAvailable()).toBe(false)
  })
})

describe('encryptApiKey', () => {
  it('returns error when encryption unavailable', async () => {
    mockIsEncryptionAvailable.mockReturnValue(false)
    const mod = await fresh()
    expect(mod.encryptApiKey('openai', 'sk-test')).toEqual({
      ok: false,
      error: 'Encryption is not available on this system',
    })
  })

  it('encrypts and stores a key', async () => {
    const mod = await fresh()
    const r = mod.encryptApiKey('openai', 'sk-test12345678')
    expect(r).toEqual({ ok: true, value: { id: 'mock-uuid', keyPrefix: 'sk-test1' } })
  })

  it('rejects duplicate keys', async () => {
    const mod = await fresh()
    mod.encryptApiKey('openai', 'sk-test1aaaaaa')
    const r = mod.encryptApiKey('openai', 'sk-test1bbbbbb')
    expect(r).toEqual({ ok: false, error: 'A openai key with prefix "sk-test1" already exists' })
  })
})

describe('decryptApiKey', () => {
  it('returns error for missing key', async () => {
    const mod = await fresh()
    expect(mod.decryptApiKey('nonexistent')).toEqual({ ok: false, error: 'Key not found' })
  })

  it('decrypts an existing key', async () => {
    const mod = await fresh()
    mod.encryptApiKey('openai', 'sk-test12345678')
    const r = mod.decryptApiKey('mock-uuid')
    expect(r).toEqual({ ok: true, value: { key: 'sk-test12345678' } })
  })
})

describe('listApiKeys', () => {
  it('returns keys without encrypted data', async () => {
    const mod = await fresh()
    mod.encryptApiKey('openai', 'sk-test12345678')
    const keys = mod.listApiKeys()
    expect(keys).toHaveLength(1)
    expect(keys[0]).not.toHaveProperty('encrypted')
    expect(keys[0].keyPrefix).toBe('sk-test1')
  })
})

describe('deleteApiKey', () => {
  it('returns error for missing key', async () => {
    const mod = await fresh()
    expect(mod.deleteApiKey('x')).toEqual({ ok: false, error: 'Key not found' })
  })

  it('removes existing key', async () => {
    const mod = await fresh()
    mod.encryptApiKey('openai', 'sk-test12345678')
    const r = mod.deleteApiKey('mock-uuid')
    expect(r).toEqual({ ok: true, value: { success: true } })
    expect(mod.listApiKeys()).toHaveLength(0)
  })
})

describe('getFirstApiKeyForProvider', () => {
  it('returns null when none exist', async () => {
    const mod = await fresh()
    expect(mod.getFirstApiKeyForProvider('openai')).toBeNull()
  })

  it('returns decrypted key for matching provider', async () => {
    const mod = await fresh()
    mod.encryptApiKey('openai', 'sk-mytopsecretkey')
    expect(mod.getFirstApiKeyForProvider('openai')).toBe('sk-mytopsecretkey')
  })
})
