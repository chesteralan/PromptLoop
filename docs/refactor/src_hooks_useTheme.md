# Refactoring Rules: `src/hooks/useTheme.ts`

## Purpose

Applies the current theme (light/dark/system) to the document root element and exposes `theme`/`setTheme`.

## Current Issues

1. **`matchMedia` listener** is added/removed correctly — good
2. **No SSR guard** — `window.matchMedia` fails in SSR environments; not an issue since this is Electron/browser
3. **`useSettingsStore` imported directly** — tight coupling to store implementation
4. **`theme` class toggling** on `<html>` works but conflicts if other code also manages CSS classes on `<html>`
5. **No transition/animation** when switching themes — could flash white momentarily

## Refactoring Rules

1. **Add CSS transition timing** to prevent flash when switching to dark mode
2. **Use CSS custom properties** instead of class toggle for more granular theme control
3. **Consider a `<ThemeProvider>` context** instead of raw hook for consistency
4. **Add persist guard** — if system preference changes while app is running in 'system' mode, apply immediately (already done via `change` listener)
5. **Memoize returned value** with `useMemo`

## Dependencies

- `../store/settingsStore`
- Used by: `../App.tsx`
- No direct UI dependencies

## Verification

- `npm run lint`
- `npm run typecheck`
- Test theme toggle between light/dark/system
- Verify system preference change updates theme
- Test persistence across page reload
