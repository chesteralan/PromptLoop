import { globalShortcut, BrowserWindow } from 'electron'

let registered = false

function getFocusedWindow(): BrowserWindow | null {
  return BrowserWindow.getFocusedWindow()
}

function sendToFocusedWindow(action: string): void {
  const win = getFocusedWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('tray:action', action)
  }
}

export function registerShortcuts(): void {
  if (registered) return

  const results = [
    { shortcut: 'CommandOrControl+Return', action: 'start' },
    { shortcut: 'CommandOrControl+Shift+Return', action: 'pause' },
    { shortcut: 'CommandOrControl+.', action: 'stop' },
  ].map(({ shortcut, action }) => {
    const ok = globalShortcut.register(shortcut, () => sendToFocusedWindow(action))
    if (!ok) {
      console.warn(`Failed to register global shortcut: ${shortcut}`)
    }
    return ok
  })

  registered = results.every(Boolean)
}

export function isRegistered(): boolean {
  return registered
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll()
  registered = false
}
