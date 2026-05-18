import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { createWindow } from './window'
import { registerWorkflowIpc } from './ipc/workflow'
import { registerExecutionIpc } from './ipc/execution'
import { registerApiKeysIpc } from './ipc/api-keys'
import { registerAppIpc } from './ipc/app'

import { createTray, destroyTray, setTrayStatus } from './tray'
import { registerShortcuts, unregisterShortcuts } from './shortcuts'
import { initSentry } from './sentry'

declare global {
  // eslint-disable-next-line no-var
  var __isQuitting: boolean | undefined
}

process.env.APP_ROOT = path.join(import.meta.dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

registerWorkflowIpc()
registerExecutionIpc()
registerApiKeysIpc()
registerAppIpc()

const trayActions: Record<string, () => void> = {
  start: () => setTrayStatus('running', 'Active Workflow'),
  pause: () => setTrayStatus('paused'),
  stop: () => setTrayStatus('idle'),
}

app.on('before-quit', () => {
  globalThis.__isQuitting = true
})

app.on('will-quit', () => {
  unregisterShortcuts()
  destroyTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('tray:action', (_event, action: string) => {
  trayActions[action]?.()
})

app
  .whenReady()
  .then(() => {
    initSentry()

    const win = createWindow()

    win.webContents.setWindowOpenHandler(({ url }) => {
      if (
        url.includes('__/auth/handler') ||
        url.includes('accounts.google.com') ||
        url.includes('github.com')
      ) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 500,
            height: 700,
            resizable: false,
            webPreferences: {
              contextIsolation: true,
              nodeIntegration: false,
            },
          },
        }
      }
      return { action: 'allow' }
    })

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL)
    } else {
      win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    createTray()
    registerShortcuts()
  })
  .catch((err) => {
    console.error('Failed to initialize app:', err)
    dialog.showErrorBox('Startup Error', `The application failed to start:\n${err.message}`)
  })
