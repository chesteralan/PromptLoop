# Refactoring Rules: `src/pages/Settings.tsx`

## Purpose

Settings page placeholder — currently shows only a heading, no actual settings UI.

## Current Issues

1. **Stub implementation** — only renders `<h1>Settings</h1>`. Either implement or add TODO
2. **No route data** — doesn't use settings store or display any settings UI

## Refactoring Rules

1. **Implement settings page** with at least basic settings from `useSettingsStore`:
   - Theme selector (light/dark/system)
   - Window mode (full/compact) with Electron-only check
   - Minimize-to-tray toggle (Electron-only)
   - Start-on-boot toggle (Electron-only)
2. **Add settings sections** using `Card` components for visual grouping
3. **Connect to `useSettingsStore`** for reading/writing settings
4. **Add Electron-only guard** — hide Electron-specific settings in browser

## Dependencies

- `../store/settingsStore`
- `../components/ui/*`, `../components/shared/PageHeader`
- `lucide-react`

## Verification

- `npm run lint`
- `npm run typecheck`
- Settings page renders with UI controls
- Settings persist across page navigation
