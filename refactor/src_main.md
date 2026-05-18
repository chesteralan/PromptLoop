# Refactoring Rules: `src/main.tsx`

## Purpose

Application entry point that initializes React, React Query, Firebase Auth, Sentry, and Electron mock.

## Current Issues

1. **`injectElectronMock()`** runs before `ReactDOM.createRoot` — fine, but it's called unconditionally even in Electron (it checks `window.electronAPI` internally)
2. **`initRendererSentry()`** runs synchronously — Sentry's init may need to be awaited for proper error capture of early errors
3. **`QueryClient`** is created outside the component tree — if React strict mode double-renders, this is fine as the client is stable
4. **`React.StrictMode`** wraps the entire tree — causes double-effect invocation in dev, which is intentional but might confuse developers debugging Firebase auth
5. **No `onError` handler** on `QueryClient` for global error handling
6. **`AuthProvider` wraps `App`** — `AuthProvider` creates a Firebase auth listener on mount which triggers `onAuthStateChanged` immediately; this is correct but could be started earlier

## Refactoring Rules

1. **Add global `QueryClient` `onError` handler** for consistent error reporting via toast
2. **Add `refetchOnWindowFocus`** configuration for React Query (defaults to `true`)
3. **Import `globals.css` before other imports** to ensure styles load first
4. **Consider lazy-loading `App`** to reduce initial bundle size
5. **Move `injectElectronMock` inside a try-catch** for safety
6. **Add dev-only logging** for Firebase emulator connection

## Dependencies

- `react`, `react-dom`, `@tanstack/react-query`
- `./App`, `./components/auth/AuthProvider`
- `./lib/sentry`, `./lib/electron-mock`
- `./styles/globals.css`

## Verification

- `npm run lint`
- `npm run typecheck`
- App loads in both browser and Electron
- React Query works (queries fire correctly)
- Sentry initializes (if DSN configured)
