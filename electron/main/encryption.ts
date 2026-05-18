import { safeStorage } from 'electron'

export interface KeyStore {
  id: string
  provider: 'openai' | 'anthropic' | 'google'
  keyPrefix: string
  encryptedKey: Buffer
  createdAt: string
}

export function encryptKey(key: string): Buffer | null {
  if (!safeStorage.isEncryptionAvailable()) return null
  return safeStorage.encryptString(key)
}

export function decryptKey(encrypted: Buffer): string | null {
  if (!safeStorage.isEncryptionAvailable()) return null
  return safeStorage.decryptString(encrypted)
}
