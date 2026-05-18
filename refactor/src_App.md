# Refactoring Rules: `src/App.tsx`

## Purpose

Root React component that sets up theme, tooltips, routing, and toast notifications.

## Current Issues

1. **`useTheme()`** is called but the return value is unused — it only applies side effects via `useEffect`. Consider an explicit name or wrapping in a `ThemeProvider` pattern
2. **`RouterProvider`** wraps `TooltipProvider` — tooltip provider should wrap at a higher level if needed across routes
3. **`Toaster`** from `sonner` is configured with `richColors` — fine
4. **No error boundary** — unhandled React errors crash the entire app

## Refactoring Rules

1. **Add React Error Boundary** component to catch rendering errors
2. **Consider ThemeProvider pattern** (context-based) instead of raw hook call
3. **Move `Toaster` outside `RouterProvider`** — doesn't need to be inside router context
4. **Remove unused `useTheme` return value** or use it explicitly (e.g., set CSS variables)

## Dependencies

- `react-router-dom`
- `./components/ui/tooltip`
- `sonner`
- `./routes`
- `./hooks/useTheme`

## Verification

- `npm run lint`
- `npm run typecheck`
- App renders without errors
- Theme toggle works across pages
- Toast notifications appear
- Tooltips render correctly
