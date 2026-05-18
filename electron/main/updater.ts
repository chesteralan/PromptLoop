import { app } from 'electron'

export function setupAutoUpdater(): void {
  // Auto-updater placeholder — enable with electron-updater when code signing is configured
  const currentVersion = app.getVersion()
  console.log(`App version: ${currentVersion}`)
}
