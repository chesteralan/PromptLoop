import { Tray, Menu, nativeImage, app } from 'electron'
import { getMainWindow } from './window'

export type TrayStatus = 'idle' | 'running' | 'paused' | 'error' | 'completed' | 'stopped'

let tray: Tray | null = null

function generateIcon(color: string): Electron.NativeImage {
  const size = 16
  const canvas = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="8" cy="8" r="6" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>
      <text x="8" y="11" text-anchor="middle" font-size="7" font-weight="bold" fill="white">PL</text>
    </svg>
  `
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`
  return nativeImage.createFromDataURL(dataUrl).resize({ width: 16, height: 16 })
}

const iconCache = new Map<string, Electron.NativeImage>()

function getCachedIcon(color: string): Electron.NativeImage {
  if (!iconCache.has(color)) {
    iconCache.set(color, generateIcon(color))
  }
  return iconCache.get(color)!
}

const STATUS_ICONS: Record<TrayStatus, Electron.NativeImage> = {
  idle: getCachedIcon('#888888'),
  running: getCachedIcon('#22c55e'),
  paused: getCachedIcon('#eab308'),
  error: getCachedIcon('#ef4444'),
  completed: getCachedIcon('#3b82f6'),
  stopped: getCachedIcon('#888888'),
}

function getStatusLabel(status: TrayStatus): string {
  const labels: Record<TrayStatus, string> = {
    idle: 'Idle',
    running: 'Running',
    paused: 'Paused',
    error: 'Error',
    completed: 'Completed',
    stopped: 'Stopped',
  }
  return labels[status]
}

export function setTrayStatus(status: TrayStatus, workflowName?: string): void {
  if (!tray) return

  tray.setImage(STATUS_ICONS[status] ?? STATUS_ICONS.idle)

  const tooltip = workflowName
    ? `PromptLoop: ${getStatusLabel(status)} - ${workflowName}`
    : `PromptLoop: ${getStatusLabel(status)}`
  tray.setToolTip(tooltip)

  rebuildMenu(status)
}

function sendTrayAction(action: string): void {
  const win = getMainWindow()
  if (!win || win.webContents.isDestroyed()) return
  win.webContents.send('tray:action', action)
}

function rebuildMenu(status: TrayStatus): void {
  if (!tray) return

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open PromptLoop',
      click: () => {
        const win = getMainWindow()
        if (win) {
          win.show()
          win.focus()
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Start',
      enabled: status === 'idle',
      click: () => sendTrayAction('start'),
    },
    {
      label: 'Pause',
      enabled: status === 'running',
      click: () => sendTrayAction('pause'),
    },
    {
      label: 'Stop',
      enabled: status === 'running' || status === 'paused',
      click: () => sendTrayAction('stop'),
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        const win = getMainWindow()
        if (win) win.destroy()
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
}

export function createTray(): void {
  if (tray) return
  if (process.platform === 'linux' && !app.isPackaged) {
    console.warn('Tray may not be supported on this Linux desktop environment')
  }

  tray = new Tray(STATUS_ICONS.idle)
  tray.setToolTip('PromptLoop: Idle')

  tray.on('click', () => {
    const win = getMainWindow()
    if (win) {
      if (win.isVisible()) {
        if (win.isFocused()) {
          win.hide()
        } else {
          win.focus()
        }
      } else {
        win.show()
        win.focus()
      }
    }
  })

  rebuildMenu('idle')
}

export function destroyTray(): void {
  tray?.destroy()
}

export function resetTray(): void {
  tray = null
}
