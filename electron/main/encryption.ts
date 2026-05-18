import { safeStorage, app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

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

function getStorePath(): string {
  return path.join(app.getPath('userData'), 'keys.json')
}

function loadStore(): KeyStore {
  const storePath = getStorePath()
  if (!existsSync(storePath)) return { version: 1, keys: [] }
  try {
    return JSON.parse(readFileSync(storePath, 'utf-8'))
  } catch {
    return { version: 1, keys: [] }
  }
}

function saveStore(store: KeyStore): void {
  writeFileSync(getStorePath(), JSON.stringify(store, null, 2), 'utf-8')
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
): { id: string; keyPrefix: string } | { error: string } {
  if (!safeStorage.isEncryptionAvailable()) {
    return { error: 'Encryption is not available on this system' }
  }

  const store = loadStore()
  const id = randomUUID()
  const encrypted = safeStorage.encryptString(apiKey)

  store.keys.push({
    id,
    provider,
    keyPrefix: getPrefix(apiKey),
    encrypted: encrypted.toString('base64'),
    createdAt: new Date().toISOString(),
  })

  saveStore(store)
  return { id, keyPrefix: getPrefix(apiKey) }
}

export function decryptApiKey(keyId: string): { key: string } | { error: string } {
  if (!safeStorage.isEncryptionAvailable()) {
    return { error: 'Encryption is not available on this system' }
  }

  const store = loadStore()
  const entry = store.keys.find((k) => k.id === keyId)
  if (!entry) return { error: 'Key not found' }

  try {
    const buffer = Buffer.from(entry.encrypted, 'base64')
    const key = safeStorage.decryptString(buffer)
    entry.lastUsedAt = new Date().toISOString()
    saveStore(store)
    return { key }
  } catch {
    return { error: 'Failed to decrypt key' }
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

export function deleteApiKey(keyId: string): { success: boolean } | { error: string } {
  const store = loadStore()
  const index = store.keys.findIndex((k) => k.id === keyId)
  if (index === -1) return { error: 'Key not found' }

  store.keys.splice(index, 1)
  saveStore(store)
  return { success: true }
}

export function getApiKeyForProvider(provider: string): string | null {
  const store = loadStore()
  const entry = store.keys.find((k) => k.provider === provider)
  if (!entry) return null

  try {
    const buffer = Buffer.from(entry.encrypted, 'base64')
    const key = safeStorage.decryptString(buffer)
    entry.lastUsedAt = new Date().toISOString()
    saveStore(store)
    return key
  } catch {
    return null
  }
}
