# Electron Main Process — Testing Rules

## 1. `electron/main/index.ts`

- **Test type:** Integration
- **Key scenarios:**
  - App boots successfully: `app.whenReady()` resolves, `initSentry`, `createWindow`, `createTray`, `registerShortcuts` all called
  - `window-all-closed` quits the app on non-macOS, does nothing on macOS
  - `activate` re-creates window if none exist (macOS)
  - `before-quit` sets `globalThis.__isQuitting = true`
  - `will-quit` calls `unregisterShortcuts()` and `destroyTray()`
  - IPC `tray:action` dispatches to `trayActions[start|pause|stop]`; unknown action silently ignored
  - `VITE_DEV_SERVER_URL` branch: loads dev URL vs loads file from `RENDERER_DIST`
  - `setWindowOpenHandler` allows OAuth URLs (`accounts.google.com`, `github.com`, `__/auth/handler`) with specific window options; other URLs allowed with defaults
  - App startup error shows error dialog
- **Mocking requirements:** `app`, `BrowserWindow`, `dialog`, `ipcMain` from electron; mock `createWindow`, `createTray`, `registerShortcuts`, `initSentry`
- **Coverage targets:** 100% of event handler branches (platform conditional, URL matching, dev vs production)
- **Suggested test file location:** `src/test/electron/main/index.test.ts`

## 2. `electron/main/window.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `loadState()` returns default state when no persisted file exists; parses valid JSON; catches parse errors returning defaults
  - `saveState()` persists correct `PersistedState`; handles maximized vs non-maximized bounds
  - `clampToDisplay()` returns original bounds if window is on a display; centers on primary display if not
  - `setMinimizeToTray` / `getMinimizeToTray` toggle correctly
  - `setWindowMode('compact')` sizes to COMPACT_SIZE×COMPACT_SIZE; `'full'` to FULL_SIZE×800; centers on matching display
  - `getMainWindow()` returns current window or null
  - `createWindow()` loads saved state, clamps, creates `BrowserWindow`, restores maximized state if applicable
  - `close` event: saves state; if `minimizeToTray && !__isQuitting` prevents default and hides
  - `resize` / `move` events debounce `saveState` with 500ms timeout
  - `maximize` / `unmaximize` events trigger immediate `saveState`
  - IPC `window:set-mode` handler updates mode; listener cleaned up on window closed
- **Mocking requirements:** `BrowserWindow`, `screen`, `app`, `ipcMain` from electron; mock `readFileSync`/`writeFileSync`/`existsSync` from `fs`
- **Coverage targets:** 100% of conditionals (maximized vs not, clamp match vs no match, debounce cancel, minimizeToTray flag)
- **Suggested test file location:** `src/test/electron/main/window.test.ts`

## 3. `electron/main/encryption.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `isEncryptionAvailable()` returns `safeStorage.isEncryptionAvailable()`
  - `encryptApiKey()`: returns error when encryption unavailable; returns error when duplicate key (same provider + prefix); creates entry with UUID, encrypts, schedules save
  - `decryptApiKey()`: returns error when encryption unavailable; returns "Key not found" for missing id; succeeds and updates `lastUsedAt` every 10th call; returns error on decrypt failure
  - `listApiKeys()` returns keys without encrypted data
  - `deleteApiKey()`: returns error for missing id; removes key and schedules save
  - `getFirstApiKeyForProvider()`: returns null when no keys; returns decrypted key; updates `lastUsedAt` every 10th call; returns null on decrypt failure
  - `loadStore()`: returns cached store if set; creates default on missing file; parses valid JSON; falls back to default on parse error
  - `scheduleSave()`: debounces writes within 500ms window
- **Mocking requirements:** `safeStorage` from electron; `readFileSync`/`writeFileSync`/`existsSync` from `fs`; `randomUUID` from `crypto`
- **Coverage targets:** All `Result<T>` branches (`ok: true` / `ok: false`), every 10th call counter modulo, edge-case prefix length < 8
- **Suggested test file location:** `src/test/electron/main/encryption.test.ts`

## 4. `electron/main/sentry.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `initSentry()` returns early when `SENTRY_DSN` is not set
  - `initSentry()` calls `init()` with correct DSN, env, tracesSampleRate (0.1 for production, 1.0 otherwise)
  - `beforeSend` filters out messages containing "ResizeObserver", "Non-Error exception captured", "Script error." — returns null
  - `beforeSend` passes through all other events
- **Mocking requirements:** `@sentry/electron/main` `init` function
- **Coverage targets:** 100% of conditionals (DSN check, env check, 3 filter patterns)
- **Suggested test file location:** `src/test/electron/main/sentry.test.ts`

## 5. `electron/main/tray.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `createTray()`: returns early if tray exists; warns on Linux unpackaged; creates `Tray` with idle icon; sets tooltip; registers click handler; builds initial idle menu
  - Click handler: shows hidden window, focuses unfocused visible, hides focused visible
  - `setTrayStatus()`: no-op when tray is null; updates image from `STATUS_ICONS` mapping; updates tooltip with/without workflow name; rebuilds menu
  - `destroyTray()`: calls `tray.destroy()`; safe when null
  - `rebuildMenu()` builds template with Open, Start/Pause/Stop (enabled based on status), Quit; uses cached icons
  - `generateIcon()` creates SVG icon with given color; `getCachedIcon()` caches by color
  - `sendTrayAction()` sends message to main window; no-op if window destroyed
- **Mocking requirements:** `Tray`, `Menu`, `nativeImage`, `app` from electron; `getMainWindow` from './window'
- **Coverage targets:** All 6 status values, all menu enabled/disabled states, click handler conditionals, Linux path
- **Suggested test file location:** `src/test/electron/main/tray.test.ts`

## 6. `electron/main/shortcuts.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `registerShortcuts()`: returns early if already registered; registers 3 global shortcuts (`CmdOrCtrl+Return`, `CmdOrCtrl+Shift+Return`, `CmdOrCtrl+.`); warns on individual registration failure; `registered` set to true iff all 3 succeed
  - `sendToFocusedWindow()`: sends action to focused window if not destroyed
  - `unregisterShortcuts()` calls `globalShortcut.unregisterAll()` and resets `registered`
  - `isRegistered()` returns current registered state
- **Mocking requirements:** `globalShortcut`, `BrowserWindow` from electron
- **Coverage targets:** Registration success/failure; focused window destroyed vs alive
- **Suggested test file location:** `src/test/electron/main/shortcuts.test.ts`

## 7. `electron/main/notifications.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `sendWorkflowCompleted()` creates notification with correct title/body; plural vs singular "iteration(s)"
  - `sendWorkflowFailed()` creates notification with truncated error (max 200 chars)
  - `showNotification()`: returns early if `Notification.isSupported()` is false; creates `Notification` with title/body; registers click handler that shows and focuses first window
  - `truncateWithEllipsis()`: returns text unchanged when under maxLen; truncates with ellipsis when over
- **Mocking requirements:** `Notification`, `BrowserWindow` from electron
- **Coverage targets:** Supported vs unsupported notification, pluralization, truncation
- **Suggested test file location:** `src/test/electron/main/notifications.test.ts`

## 8. `electron/main/updater.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `setupAutoUpdater()` logs the current app version
  - (Placeholder: confirm no side effects when called)
- **Mocking requirements:** `app` from electron
- **Coverage targets:** N/A (single code path)
- **Suggested test file location:** `src/test/electron/main/updater.test.ts`

---

## Global Rule

All test files must be placed under `src/test/`. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `src/test/components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/test/hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `src/test/electron/main/encryption.test.ts`

This keeps all tests colocated under a single `src/test/` root regardless of whether the source is in `src/` or `electron/`.
