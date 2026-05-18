# Refactoring Rules: `electron/main/window.ts`

## Purpose

Manages the Electron BrowserWindow lifecycle including state persistence, minimize-to-tray behavior, and window mode (full/compact).

## Current Issues

1. **`__dirname` re-declared here** (also in `index.ts`) — redundant since Electron v28+ supports `import.meta.dirname`
2. **`globalThis.__isQuitting`** re-declared (same declaration exists in `index.ts`) — should be centralized
3. **`saveState()`** reads `mainWindow!.isMaximized()` with non-null assertion but checks `!mainWindow` at the top — the non-null assertion in `getBounds()` is redundant after guard
4. **`clampToDisplay()`** mutates the input `bounds` object (side effect) — should return a new object
5. **`resize` and `move` event handlers** both use the same `resizeTimer` — fine, but name is misleading for move events
6. **Hardcoded window sizes**: `400x400` for compact, `1200x800` for full — should be configurable
7. **`setWindowMode`** reads `mainWindow.getBounds()` after setting new size, but `setSize()` may not update bounds synchronously on all platforms
8. **IPC handler `window:set-mode`** registered in `createWindow()` but never unregistered — if `BrowserWindow` is recreated (possible in some flows), handlers accumulate

## Refactoring Rules

1. **Remove duplicate `declare global`** — import from shared type
2. **Use `import.meta.dirname`** instead of `fileURLToPath` (Electron 28+)
3. **Make `clampToDisplay()` pure** — return new object instead of mutating input
4. **Rename `resizeTimer`** to `debounceTimer` since it handles both resize and move
5. **Extract window size constants** — `COMPACT_SIZE` and `FULL_SIZE`
6. **Add `ipcMain.removeHandler`** on window close for registered IPC handlers
7. **Remove redundant non-null assertions** after early return guard
8. **Add window state migration** for future schema changes

## Dependencies

- External: `electron`
- Internal: none (exported functions used by `index.ts`)

## Verification

- `npm run typecheck` (electron)
- Test window state persistence across restart
- Test compact/full mode switching
- Test minimize-to-tray behavior
