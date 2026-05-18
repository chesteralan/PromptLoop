import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import { readFileSync, writeFileSync } from 'node:fs'

export function registerAppIpc(): void {
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })

  ipcMain.on('app:minimize-to-tray', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.hide()
    }
  })

  ipcMain.handle('dialog:show-save-dialog', async (_event, options: Electron.SaveDialogOptions) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return { canceled: true, filePath: null }
    return dialog.showSaveDialog(win, options)
  })

  ipcMain.handle('dialog:show-open-dialog', async (_event, options: Electron.OpenDialogOptions) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return { canceled: true, filePaths: [] }
    return dialog.showOpenDialog(win, options)
  })

  ipcMain.handle('file:write', async (_event, filePath: string, content: string) => {
    try {
      writeFileSync(filePath, content, 'utf-8')
      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('file:read', async (_event, filePath: string) => {
    try {
      const content = readFileSync(filePath, 'utf-8')
      return { success: true, content }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })
}
