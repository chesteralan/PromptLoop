# Refactoring Rules: `electron/main/index.ts`

## Purpose

Entry point for the Electron main process that initializes services, registers IPC handlers, creates the main window, and handles app lifecycle.

## Current Issues

1. **Import ordering**: `import { fileURLToPath }` and `import path` are placed after `declare global` block instead of at the top with other imports
2. **Duplicate `VITE_DEV_SERVER_URL`**: The constant is exported at line 25 and re-declared as local const at line 71 — use the exported one
3. **`globalThis.__isQuitting`** declared globally but also re-declared in `window.ts` — should be declared once in a shared types file
4. **No error handling** on `createWindow()` — if window creation fails, app starts but is invisible
5. **`tray:action` IPC handler** uses string-based action dispatch with `if/else if` chain — use a map or enum
6. **`app.whenReady()`** promise chain doesn't handle rejection

## Refactoring Rules

1. **Move `declare global`** to a shared type declaration file (e.g., `electron/electron-env.d.ts`)
2. **Move imports before `declare global`** block to follow standard conventions
3. **Deduplicate `VITE_DEV_SERVER_URL`** — use the exported const directly in `app.whenReady()`
4. **Add error handling** for `createWindow()` with fallback or error dialog
5. **Replace `if/else if` chain** in `tray:action` with a `Map<string, () => void>`
6. **Handle promise rejection** in `app.whenReady()` with `.catch()`
7. **Initialize Sentry after `app.whenReady()`** (Sentry Electron init may need `app` to be ready)

## Dependencies

- `./window`, `./ipc/workflow`, `./ipc/execution`, `./ipc/api-keys`, `./ipc/app`
- `./tray`, `./shortcuts`, `./sentry`
- External: `electron`

## Verification

- `npm run typecheck` (electron)
- Manual: app starts, window appears, tray icon shows, shortcuts work
- Test before-quit / will-quit cleanup
