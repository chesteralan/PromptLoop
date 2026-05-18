import { ipcMain } from 'electron'

export function registerApiKeysIpc(): void {
  ipcMain.handle('api-key:encrypt', async (_event, { key }: { provider: string; key: string }) => {
    return { id: '', keyPrefix: key.slice(0, 8) }
  })

  ipcMain.handle('api-key:decrypt', async () => {
    return { key: '' }
  })

  ipcMain.handle('api-key:delete', async () => {
    return { success: true }
  })

  ipcMain.handle('api-key:list', async () => {
    return []
  })
}
