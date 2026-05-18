# Refactoring Rules: `electron/main/shortcuts.ts`

## Purpose

Registers global keyboard shortcuts (Cmd/Ctrl+Enter for start, Cmd/Ctrl+Shift+Enter for pause, Cmd/Ctrl+. for stop) for workflow control.

## Current Issues

1. **`registered`** flag is a local variable but `unregisterAll()` is called on `will-quit` — if `registerShortcuts()` was never called, `unregisterAll()` still runs (harmless but unnecessary)
2. **All shortcuts send `tray:action`** events with action names that mirror the old string-based dispatch in `index.ts` — coupling between modules
3. **No shortcut configuration** — shortcuts are hardcoded; consider making them configurable via settings
4. **`globalShortcut.register`** may fail silently if the shortcut is already registered by another app — `registeredSuccess` captures this but only logs to `registered` boolean without notifying the user
5. **`send()` function** iterates all windows but `tray:action` is only listened on one window — broadcasts unnecessarily

## Refactoring Rules

1. **Add `console.warn`** if `registeredSuccess` is false for individual shortcuts (some may succeed, some may not)
2. **Replace hardcoded shortcut keys** with configurable options (read from store or settings file)
3. **Send `tray:action` only to the focused window** instead of all windows
4. **Add `isRegistered()`** getter for debugging
5. **Move action name constants** to shared file to avoid string duplication with `index.ts`

## Dependencies

- External: `electron` (`globalShortcut`, `BrowserWindow`)
- Internal: none
- Used by: `./index.ts`

## Verification

- `npm run typecheck` (electron)
- Test all three shortcuts work when app is in background
- Test that shortcuts are unregistered on quit
