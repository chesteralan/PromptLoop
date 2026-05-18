import { BrowserWindow, app, screen, ipcMain } from 'electron'
import path from 'node:path'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

interface PersistedState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  mode: 'full' | 'compact'
}

const COMPACT_SIZE = 400
const FULL_SIZE = 1200

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

function clampToDisplay(bounds: { x?: number; y?: number; width: number; height: number }): {
  x?: number
  y?: number
  width: number
  height: number
} {
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
      return bounds
    }
  }
  const primary = screen.getPrimaryDisplay()
  return {
    ...bounds,
    x: primary.bounds.x + Math.max(0, (primary.bounds.width - bounds.width) / 2),
    y: primary.bounds.y + Math.max(0, (primary.bounds.height - bounds.height) / 2),
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

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
    mainWindow.setSize(COMPACT_SIZE, COMPACT_SIZE)
  } else {
    mainWindow.setSize(FULL_SIZE, 800)
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
  const clamped = clampToDisplay(saved)

  mainWindow = new BrowserWindow({
    title: 'PromptLoop',
    x: clamped.x,
    y: clamped.y,
    width: clamped.width,
    height: clamped.height,
    show: false,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.mjs'),
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

  mainWindow.on('resize', () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(saveState, 500)
  })

  mainWindow.on('move', () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(saveState, 500)
  })

  mainWindow.on('maximize', saveState)
  mainWindow.on('unmaximize', saveState)

  const setModeHandler = (_event: Electron.IpcMainEvent, mode: 'full' | 'compact') => {
    setWindowMode(mode)
  }
  ipcMain.on('window:set-mode', setModeHandler)

  mainWindow.on('closed', () => {
    ipcMain.removeListener('window:set-mode', setModeHandler)
    mainWindow = null
  })

  return mainWindow
}
