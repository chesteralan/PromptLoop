import { safeStorage, app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

type Result<T> = { ok: true; value: T } | { ok: false; error: string }

interface StoredKey {
  id: string
  provider: 'openai' | 'anthropic' | 'google'
  keyPrefix: string
  encrypted: string
  createdAt: string
  lastUsedAt?: string
}

interface KeyStore {
  version: number
  keys: StoredKey[]
}

let cachedStore: KeyStore | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null
let lastUsedAtCounter = 0

function getStorePath(): string {
  return path.join(app.getPath('userData'), 'keys.json')
}

function loadStore(): KeyStore {
  if (cachedStore) return cachedStore
  const storePath = getStorePath()
  if (!existsSync(storePath)) {
    cachedStore = { version: 1, keys: [] }
    return cachedStore
  }
  try {
    cachedStore = JSON.parse(readFileSync(storePath, 'utf-8')) as KeyStore
    if (typeof cachedStore.version !== 'number') cachedStore.version = 1
    return cachedStore
  } catch {
    cachedStore = { version: 1, keys: [] }
    return cachedStore
  }
}

function scheduleSave(): void {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    const store = cachedStore
    if (store) {
      writeFileSync(getStorePath(), JSON.stringify(store, null, 2), 'utf-8')
    }
    saveTimer = null
  }, 500)
}

function getPrefix(key: string): string {
  return key.length > 8 ? key.slice(0, 8) : key
}

export function isEncryptionAvailable(): boolean {
  return safeStorage.isEncryptionAvailable()
}

export function encryptApiKey(
  provider: 'openai' | 'anthropic' | 'google',
  apiKey: string,
): Result<{ id: string; keyPrefix: string }> {
  if (!safeStorage.isEncryptionAvailable()) {
    return { ok: false, error: 'Encryption is not available on this system' }
  }

  const prefix = getPrefix(apiKey)
  const store = loadStore()

  if (store.keys.some((k) => k.provider === provider && k.keyPrefix === prefix)) {
    return { ok: false, error: `A ${provider} key with prefix "${prefix}" already exists` }
  }

  const id = randomUUID()
  const encrypted = safeStorage.encryptString(apiKey)

  store.keys.push({
    id,
    provider,
    keyPrefix: prefix,
    encrypted: encrypted.toString('base64'),
    createdAt: new Date().toISOString(),
  })

  scheduleSave()
  return { ok: true, value: { id, keyPrefix: prefix } }
}

export function decryptApiKey(keyId: string): Result<{ key: string }> {
  if (!safeStorage.isEncryptionAvailable()) {
    return { ok: false, error: 'Encryption is not available on this system' }
  }

  const store = loadStore()
  const entry = store.keys.find((k) => k.id === keyId)
  if (!entry) return { ok: false, error: 'Key not found' }

  try {
    const buffer = Buffer.from(entry.encrypted, 'base64')
    const key = safeStorage.decryptString(buffer)
    lastUsedAtCounter++
    if (lastUsedAtCounter % 10 === 0) {
      entry.lastUsedAt = new Date().toISOString()
      scheduleSave()
    }
    return { ok: true, value: { key } }
  } catch {
    return { ok: false, error: 'Failed to decrypt key' }
  }
}

export function listApiKeys(): {
  id: string
  provider: string
  keyPrefix: string
  createdAt: string
  lastUsedAt?: string
}[] {
  const store = loadStore()
  return store.keys.map(({ id, provider, keyPrefix, createdAt, lastUsedAt }) => ({
    id,
    provider,
    keyPrefix,
    createdAt,
    lastUsedAt,
  }))
}

export function deleteApiKey(keyId: string): Result<{ success: boolean }> {
  const store = loadStore()
  const index = store.keys.findIndex((k) => k.id === keyId)
  if (index === -1) return { ok: false, error: 'Key not found' }

  store.keys.splice(index, 1)
  scheduleSave()
  return { ok: true, value: { success: true } }
}

export function resetStore(): void {
  cachedStore = null
}

export function getFirstApiKeyForProvider(provider: string): string | null {
  const store = loadStore()
  const entry = store.keys.find((k) => k.provider === provider)
  if (!entry) return null

  try {
    const buffer = Buffer.from(entry.encrypted, 'base64')
    const key = safeStorage.decryptString(buffer)
    lastUsedAtCounter++
    if (lastUsedAtCounter % 10 === 0) {
      entry.lastUsedAt = new Date().toISOString()
      scheduleSave()
    }
    return key
  } catch {
    return null
  }
}
