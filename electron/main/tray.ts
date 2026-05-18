import { Tray, Menu, nativeImage, app } from 'electron'
import { getMainWindow } from './window'

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

const STATUS_ICONS: Record<string, () => Electron.NativeImage> = {
  idle: () => generateIcon('#888888'),
  running: () => generateIcon('#22c55e'),
  paused: () => generateIcon('#eab308'),
  error: () => generateIcon('#ef4444'),
  completed: () => generateIcon('#3b82f6'),
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    idle: 'Idle',
    running: 'Running',
    paused: 'Paused',
    error: 'Error',
    completed: 'Completed',
    stopped: 'Stopped',
  }
  return labels[status] ?? status
}

export function setTrayStatus(status: string, workflowName?: string): void {
  if (!tray) return

  const icon = STATUS_ICONS[status]?.() ?? STATUS_ICONS.idle!()
  tray.setImage(icon)

  const tooltip = workflowName
    ? `PromptLoop: ${getStatusLabel(status)} - ${workflowName}`
    : `PromptLoop: ${getStatusLabel(status)}`
  tray.setToolTip(tooltip)

  rebuildMenu(status)
}

function rebuildMenu(status: string): void {
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
      click: () => {
        getMainWindow()?.webContents.send('tray:action', 'start')
      },
    },
    {
      label: 'Pause',
      enabled: status === 'running',
      click: () => {
        getMainWindow()?.webContents.send('tray:action', 'pause')
      },
    },
    {
      label: 'Stop',
      enabled: status === 'running' || status === 'paused',
      click: () => {
        getMainWindow()?.webContents.send('tray:action', 'stop')
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        const win = getMainWindow()
        if (win) win.destroy()
        tray?.destroy()
        tray = null
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
}

export function createTray(): void {
  if (tray) return

  const icon = STATUS_ICONS.idle()
  tray = new Tray(icon)
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
  tray = null
}
