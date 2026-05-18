import { BrowserWindow, app, screen, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

declare global {
  // eslint-disable-next-line no-var
  var __isQuitting: boolean | undefined
}

interface PersistedState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  mode: 'full' | 'compact'
}

let mainWindow: BrowserWindow | null = null
let minimizeToTray = true
let windowMode: 'full' | 'compact' = 'full'

function getStatePath(): string {
  return path.join(app.getPath('userData'), 'window-state.json')
}

function loadState(): PersistedState {
  const statePath = getStatePath()
  if (!existsSync(statePath)) {
    return { width: 1200, height: 800, isMaximized: false, mode: 'full' }
  }
  try {
    return JSON.parse(readFileSync(statePath, 'utf-8'))
  } catch {
    return { width: 1200, height: 800, isMaximized: false, mode: 'full' }
  }
}

function saveState(): void {
  if (!mainWindow) return
  const isMaximized = mainWindow.isMaximized()
  if (!isMaximized) {
    const bounds = mainWindow.getBounds()
    const state: PersistedState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: false,
      mode: windowMode,
    }
    writeFileSync(getStatePath(), JSON.stringify(state, null, 2))
  } else {
    const state: PersistedState = {
      width: 1200,
      height: 800,
      isMaximized: true,
      mode: windowMode,
    }
    writeFileSync(getStatePath(), JSON.stringify(state, null, 2))
  }
}

function clampToDisplay(bounds: { x?: number; y?: number; width: number; height: number }): void {
  const displays = screen.getAllDisplays()
  for (const d of displays) {
    const { x, y, width, height } = d.bounds
    if (
      bounds.x != null &&
      bounds.x >= x &&
      bounds.x < x + width &&
      bounds.y != null &&
      bounds.y >= y &&
      bounds.y < y + height
    ) {
      return
    }
  }
  const primary = screen.getPrimaryDisplay()
  bounds.x = primary.bounds.x + Math.max(0, (primary.bounds.width - bounds.width) / 2)
  bounds.y = primary.bounds.y + Math.max(0, (primary.bounds.height - bounds.height) / 2)
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null

export function setMinimizeToTray(enabled: boolean): void {
  minimizeToTray = enabled
}

export function getMinimizeToTray(): boolean {
  return minimizeToTray
}

export function getWindowMode(): 'full' | 'compact' {
  return windowMode
}

export function setWindowMode(mode: 'full' | 'compact'): void {
  windowMode = mode
  if (!mainWindow) return

  if (mode === 'compact') {
    mainWindow.setSize(400, 400)
  } else {
    mainWindow.setSize(1200, 800)
  }

  const bounds = mainWindow.getBounds()
  const display = screen.getDisplayMatching(bounds)
  const cx = display.bounds.x + display.bounds.width / 2
  const cy = display.bounds.y + display.bounds.height / 2
  mainWindow.setPosition(Math.round(cx - bounds.width / 2), Math.round(cy - bounds.height / 2))

  saveState()
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function createWindow(): BrowserWindow {
  const saved = loadState()
  windowMode = saved.mode
  clampToDisplay(saved)

  mainWindow = new BrowserWindow({
    title: 'PromptLoop',
    x: saved.x,
    y: saved.y,
    width: saved.width,
    height: saved.height,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (saved.isMaximized) {
    mainWindow.maximize()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (event) => {
    saveState()
    if (minimizeToTray && !globalThis.__isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(saveState, 500)
  })

  mainWindow.on('move', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(saveState, 500)
  })

  mainWindow.on('maximize', saveState)
  mainWindow.on('unmaximize', saveState)

  ipcMain.on('window:set-mode', (_event, mode: 'full' | 'compact') => {
    setWindowMode(mode)
  })

  return mainWindow
}
