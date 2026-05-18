# Refactoring Rules: `electron/main/sentry.ts`

## Purpose

Initializes Sentry error reporting for the Electron main process.

## Current Issues

1. **`initSentry()`** is synchronous but `@sentry/electron/main` `init()` returns a promise — call without `await` is fine but the function signature should reflect it may be async
2. **No `beforeSend` callback** to filter out expected errors (e.g., network errors when offline)
3. **No release/trace metadata** — `release` and `tracesSampleRate` not configured
4. **Environment fallback** `process.env.NODE_ENV || 'development'` — in production builds, `NODE_ENV` may not be set; consider explicit env var

## Refactoring Rules

1. **Add `beforeSend` hook** to filter known non-actionable errors
2. **Configure `release`** from `app.getVersion()`
3. **Add `tracesSampleRate`** with environment-specific sampling
4. **Use explicit `SENTRY_ENVIRONMENT`** env var instead of `NODE_ENV` fallback
5. **Add error boundary context** (process type, platform, app version)

## Dependencies

- External: `@sentry/electron/main`
- Internal: none
- Used by: `./index.ts`

## Verification

- `npm run typecheck` (electron)
- Verify DSN is loaded from env
- Test with `SENTRY_DSN` set to dev DSN
