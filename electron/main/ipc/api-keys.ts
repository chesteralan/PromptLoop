import { ipcMain } from 'electron'
import { encryptApiKey, decryptApiKey, listApiKeys, deleteApiKey } from '../encryption'

export function registerApiKeysIpc(): void {
  ipcMain.handle(
    'api-key:encrypt',
    async (_event, { provider, key }: { provider: string; key: string }) => {
      const result = encryptApiKey(provider as 'openai' | 'anthropic' | 'google', key)
      if ('error' in result) {
        return { success: false, error: result.error }
      }
      return { success: true, id: result.id, keyPrefix: result.keyPrefix }
    },
  )

  ipcMain.handle('api-key:decrypt', async (_event, { keyId }: { keyId: string }) => {
    const result = decryptApiKey(keyId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }
    return { success: true, key: result.key }
  })

  ipcMain.handle('api-key:list', async () => {
    return { success: true, keys: listApiKeys() }
  })

  ipcMain.handle('api-key:delete', async (_event, { keyId }: { keyId: string }) => {
    const result = deleteApiKey(keyId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }
    return { success: true }
  })
}
