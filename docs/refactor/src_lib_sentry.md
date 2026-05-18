# Refactoring Rules: `src/lib/sentry.ts`

## Purpose

Initializes Sentry error reporting for the Electron renderer process.

## Current Issues

1. **`initRendererSentry()`** is synchronous but `@sentry/electron/renderer` `init()` returns a `Promise` — not awaited
2. **`integrations: []`** explicitly clears all default integrations — this may disable breadcrumbs, session tracking, etc. Should use default integrations or selectively disable
3. **No `beforeSend` hook** — could filter out known non-actionable errors (e.g., ResizeObserver loop errors)
4. **No `release` or `tracesSampleRate`** configuration
5. **`VITE_SENTRY_DSN`** env var naming is inconsistent with main process's `SENTRY_DSN` (no `VITE_` prefix in main process)
6. **DSN check `!dsn`** returns early, so no Sentry initialization in dev mode unless DSN is set — correct

## Refactoring Rules

1. **Allow function to be async** and handle initialization properly
2. **Restore default integrations** — remove `integrations: []` unless removals are intentional
3. **Add `beforeSend`** to filter common browser extension errors
4. **Add `tracesSampleRate`** based on environment (0.1 in production, 1.0 in dev)
5. **Add `release`** from `import.meta.env.VITE_APP_VERSION` or similar
6. **Sync DSN env var naming** with main process

## Dependencies

- `@sentry/electron/renderer`
- Used by: `../main.tsx`

## Verification

- `npm run lint`
- `npm run typecheck`
- Verify Sentry initializes when DSN is set
- Verify Sentry is skipped when DSN is not set
