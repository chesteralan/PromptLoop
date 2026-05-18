import { ipcMain, app, BrowserWindow } from 'electron'

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
}
