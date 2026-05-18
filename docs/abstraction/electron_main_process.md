# Abstraction Rules: Electron Main Process

**Files:** `electron/main/index.ts`, `window.ts`, `encryption.ts`, `sentry.ts`, `tray.ts`, `shortcuts.ts`, `notifications.ts`, `updater.ts`

---

## `electron/main/index.ts`

### Current Layer Mix

- App lifecycle (Electron `app.whenReady`, `before-quit`) mixed with IPC registration, window creation, tray/shortcut setup, and auth URL handling.
- `trayActions` record and `ipcMain.on('tray:action')` is inline business logic.

### Extraction Opportunities

- Move auth URL pattern logic (`__/auth/handler`, `accounts.google.com`, `github.com`) into a dedicated auth helper.
- Extract `trayActions` map and its handler into `tray.ts` or a separate `tray-ipc.ts`.
- Move path constants (`VITE_DEV_SERVER_URL`, `MAIN_DIST`, `RENDERER_DIST`, `VITE_PUBLIC`) into a `paths.ts` config module.
- Extract the startup orchestration into a `startup.ts` that returns a `Promise` or observable lifecycle.

### Interface Suggestions

- Define `TrayActionHandler = Record<string, () => void>` and pass it from `tray.ts`.
- Create `AppLifecycle` interface with `onReady`, `onBeforeQuit`, `onWillQuit`, `onActivate` methods.

### Dependency Direction

- ✅ `index.ts` correctly depends on submodules (`window`, `tray`, `shortcuts`, `sentry`, IPC).
- ⚠️ `index.ts` directly couples IPC registration and tray actions — IPC handlers should be self-contained.

### Duplication

- Auth URL checking pattern repeated inline — centralize into `isAuthUrl(url: string): boolean`.

### Constants/Magic Values

- `500`, `700` (auth window dimensions), `__isQuitting`, tray action strings.

---

## `electron/main/window.ts`

### Current Layer Mix

- `PersistedState` interface, file I/O (`readFileSync`/`writeFileSync`), display geometry math, IPC listener setup, and `BrowserWindow` creation all in one file.
- Window state persistence (data access) mixed with window management (UI/platform logic).

### Extraction Opportunities

- Extract `window-state.ts` for `loadState`/`saveState`/`PersistedState` — separates persistence from window management.
- Extract `display-utils.ts` for `clampToDisplay` — pure geometry math.
- Extract debounce logic into a shared `debounce` utility.

### Interface Suggestions

- `WindowStateManager` interface: `getMainWindow(): BrowserWindow | null`, `setWindowMode(mode)`, `setMinimizeToTray(enabled)`.
- `PersistedState` is defined locally — share with `electron/shared/types.ts` (which has `WindowState` already).

### Dependency Direction

- ⚠️ `window.ts` imports from no other project modules — good isolation, but the `ipcMain.on('window:set-mode')` couples it to IPC layer.
- ✅ Exports clean public API (`createWindow`, `getMainWindow`, `setWindowMode`, etc.).

### Duplication

- Error handling in `loadState` and `saveState` repeated.

### Constants/Magic Values

- `COMPACT_SIZE = 400`, `FULL_SIZE = 1200`, `1200`, `800` defaults, `500` debounce, `'window-state.json'`.

---

## `electron/main/encryption.ts`

### Current Layer Mix

- File I/O (`readFileSync`/`writeFileSync`), Electron `safeStorage`, key management CRUD, and a `Result<T>` type all in one file.
- `getFirstApiKeyForProvider` mixes decryption with query logic.

### Extraction Opportunities

- Extract `KeyStore` persistence into `keystore.ts` with read/write/schedule.
- Extract `Result<T>` into `electron/shared/types.ts` as a generic utility type.
- Separate decryption logic from `getFirstApiKeyForProvider` into a `decrypt(encrypted: string): string` utility.

### Interface Suggestions

- `KeyStoreRepository` interface: `load(): KeyStore`, `save(store: KeyStore): void`, `scheduleSave(): void`.
- `EncryptionService` interface: `encrypt(provider, key): Result`, `decrypt(keyId): Result`, `list(): StoredKey[]`, `delete(keyId): Result`.

### Dependency Direction

- ✅ No dependency on other electron modules — good low-level utility.
- ✅ Pure data operations with no UI coupling.

### Duplication

- `lastUsedAtCounter` increment + conditional save repeated in `decryptApiKey` and `getFirstApiKeyForProvider`.
- `Buffer.from(entry.encrypted, 'base64')` / `safeStorage.decryptString` repeated.

### Constants/Magic Values

- `500` (debounce), `10` (lastUsedAt interval), `'keys.json'`, `version: 1`.

---

## `electron/main/sentry.ts`

### Current Layer Mix

- Initialization config mixed with filter logic for ignored errors.

### Extraction Opportunities

- Extract `sentryFilter` into a separate pure function: `shouldIgnoreEvent(event): boolean`.
- Move `tracesSampleRate` logic into a config constant.

### Interface Suggestions

- None needed — single well-contained function.

### Dependency Direction

- ✅ Self-contained, no internal dependencies.

### Duplication

- None.

### Constants/Magic Values

- `'ResizeObserver'`, `'Non-Error exception captured'`, `'Script error.'`, `0.1`, `1.0`.

---

## `electron/main/tray.ts`

### Current Layer Mix

- SVG icon generation (presentation), icon caching, menu building, status management, and Electron `Tray` lifecycle all mixed.

### Extraction Opportunities

- Extract `icon-generator.ts` for `generateIcon`/`getCachedIcon` — pure SVG-to-NativeImage.
- Extract `tray-menu.ts` for `rebuildMenu` — separates menu template from tray lifecycle.
- Extract `TrayStatus` type into `electron/shared/types.ts`.

### Interface Suggestions

- `TrayController` interface: `createTray(): void`, `setStatus(status, workflowName?): void`, `destroyTray(): void`.
- `TrayMenuBuilder` interface: `buildMenu(status, sendAction): Menu`.

### Dependency Direction

- ✅ Depends only on `getMainWindow` from `window.ts` — clean.
- ⚠️ SVG strings embedded — consider referencing external assets.

### Duplication

- `getStatusLabel` and `STATUS_ICONS` both map status to display values — could derive one from the other.

### Constants/Magic Values

- `16` (icon size), `'#888888'`/`'#22c55e'`/`'#eab308'`/`'#ef4444'`/`'#3b82f6'` (colors), icon SVG template.

---

## `electron/main/shortcuts.ts`

### Current Layer Mix

- Shortcut registration mixed with `sendToFocusedWindow` IPC logic.

### Extraction Opportunities

- Extract shortcut definitions into a config array: `ShortcutDef = { shortcut: string; action: string }[]`.
- Extract `sendToFocusedWindow` into IPC utilities.

### Interface Suggestions

- None needed — small, well-contained file.

### Dependency Direction

- ✅ Self-contained, minimal dependencies.

### Duplication

- None.

### Constants/Magic Values

- `'CommandOrControl+Return'`, `'CommandOrControl+Shift+Return'`, `'CommandOrControl+.'`, `'start'`, `'pause'`, `'stop'`.

---

## `electron/main/notifications.ts`

### Current Layer Mix

- Notification creation mixed with `truncateWithEllipsis` utility and `focusMainWindow` helper.

### Extraction Opportunities

- Extract `truncateWithEllipsis` into `electron/shared/strings.ts`.
- Extract `showNotification` into a clean `NotificationService` class.

### Interface Suggestions

- `NotificationService` interface: `show(title, body): void`, `sendWorkflowCompleted(name, iterations): void`, `sendWorkflowFailed(name, error): void`.

### Dependency Direction

- ✅ Self-contained, only depends on Electron `Notification`/`BrowserWindow`.

### Duplication

- None.

### Constants/Magic Values

- `200` (max truncation length), `'Workflow Complete'`, `'Workflow Failed'`.

---

## `electron/main/updater.ts`

### Current Layer Mix

- Placeholder with `console.log` — minimal.

### Extraction Opportunities

- When implementing, extract into `updater/check.ts`, `updater/download.ts`, `updater/install.ts`.

### Interface Suggestions

- `AutoUpdater` interface: `checkForUpdates(): Promise<UpdateInfo>`, `downloadUpdate(): Promise<boolean>`, `installAndRestart(): void`.

### Dependency Direction

- ✅ No current dependencies.

### Duplication

- None.

### Constants/Magic Values

- `'App version:'` log string.
