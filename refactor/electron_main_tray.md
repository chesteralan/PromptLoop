# Refactoring Rules: `electron/main/tray.ts`

## Purpose

Creates and manages the system tray icon with status indicator (color-coded circle) and context menu for workflow control.

## Current Issues

1. **`generateIcon()`** renders SVG as data URL every time — this is called on every status change. For a 16x16 icon this is fast but inefficient. Cache icon NativeImages per status
2. **`STATUS_ICONS`** is a `Record<string, () => Electron.NativeImage>` but `setTrayStatus` accepts any `string` — TypeScript allows unchecked status values
3. **`rebuildMenu`** is called on every status change, recreating the entire menu — menus are immutable once created, so this is necessary, but consider caching the template
4. **`destroyTray()`** sets `tray = null` but doesn't null-check before calling `tray?.destroy()` — the optional chaining handles this but the assignment to `null` after `destroy()` is redundant since the tray is destroyed
5. **No tray icon on Linux** — `Tray` may not work on all Linux DEs; consider a fallback

## Refactoring Rules

1. **Cache generated icons** by status — create once, reuse on subsequent `setTrayStatus` calls
2. **Type the status parameter** as a union of known statuses instead of `string`
3. **Remove redundant `tray?.destroy()` + `tray = null`** — just `tray?.destroy()` is sufficient
4. **Menu items "Start"/"Pause"/"Stop"** use `getMainWindow()?.webContents.send()` — add error handling if webContents is destroyed
5. **Add platform check** for tray support (macOS/Windows only)

## Dependencies

- External: `electron` (`Tray`, `Menu`, `nativeImage`, `app`)
- Internal: `./window`

## Verification

- `npm run typecheck` (electron)
- Tray icon appears with correct color per status
- Context menu items enable/disabled correctly
- Click behavior shows/hides window
- Cleanup on quit works
