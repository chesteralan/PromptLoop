import { ipcMain } from 'electron'
import { encryptApiKey, decryptApiKey, listApiKeys, deleteApiKey } from '../encryption'

const VALID_PROVIDERS = ['openai', 'anthropic', 'google'] as const

function isValidProvider(p: string): p is 'openai' | 'anthropic' | 'google' {
  return VALID_PROVIDERS.includes(p as (typeof VALID_PROVIDERS)[number])
}

export function registerApiKeysIpc(): void {
  ipcMain.handle(
    'api-key:encrypt',
    async (_event, { provider, key }: { provider: string; key: string }) => {
      if (!isValidProvider(provider)) {
        return { success: false, error: `Invalid provider: ${provider}` }
      }
      const result = encryptApiKey(provider, key)
      if (!result.ok) return { success: false, error: result.error }
      return { success: true, id: result.value.id, keyPrefix: result.value.keyPrefix }
    },
  )

  ipcMain.handle('api-key:decrypt', async (_event, { keyId }: { keyId: string }) => {
    const result = decryptApiKey(keyId)
    if (!result.ok) return { success: false, error: result.error }
    return { success: true, key: result.value.key }
  })

  ipcMain.handle('api-key:list', async () => {
    return { success: true, keys: listApiKeys() }
  })

  ipcMain.handle('api-key:delete', async (_event, { keyId }: { keyId: string }) => {
    const result = deleteApiKey(keyId)
    if (!result.ok) return { success: false, error: result.error }
    return { success: true }
  })
}
