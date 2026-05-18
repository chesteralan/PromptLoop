import { globalShortcut, BrowserWindow } from 'electron'

let registered = false

export function registerShortcuts(): void {
  if (registered) return

  const send = (action: string) => {
    const wins = BrowserWindow.getAllWindows()
    for (const win of wins) {
      if (!win.isDestroyed()) {
        win.webContents.send('tray:action', action)
      }
    }
  }

  const registeredSuccess = [
    globalShortcut.register('CommandOrControl+Return', () => send('start')),
    globalShortcut.register('CommandOrControl+Shift+Return', () => send('pause')),
    globalShortcut.register('CommandOrControl+.', () => send('stop')),
  ].every(Boolean)

  if (registeredSuccess) {
    registered = true
  }
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll()
  registered = false
}
