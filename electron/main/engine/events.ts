import { BrowserWindow } from 'electron'
import type { ExecutionEventMap } from './types'

export function emit<T extends keyof ExecutionEventMap>(
  channel: T,
  data: ExecutionEventMap[T],
): void {
  const wins = BrowserWindow.getAllWindows()
  for (const win of wins) {
    if (!win.isDestroyed()) {
      win.webContents.send(channel, data)
    }
  }
}
