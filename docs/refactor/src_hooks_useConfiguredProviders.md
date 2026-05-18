# Refactoring Rules: `src/hooks/useConfiguredProviders.ts`

## Purpose

Fetches configured API key providers from Electron's encrypted key store and returns the list of provider names.

## Current Issues

1. **`cancelled` flag** pattern is used to prevent state update after unmount — correct for preventing React warning
2. **No timeout** — if `listApiKeys` hangs, the hook stays in `loading` state forever
3. **`useEffect` has no dependencies array** — `[]` is correct since it runs once on mount
4. **Only fetches on mount** — if user adds a new key on another page, this hook won't reflect the change until remount
5. **`Set` deduplication** `[...new Set(keys.map(k => k.provider))]` — correct but could be a one-liner
6. **Error handling** silently sets `loading = false` with no feedback — callers won't know if fetch failed

## Refactoring Rules

1. **Add timeout** (e.g., 10s) for the `listApiKeys` call
2. **Add refetch capability** — expose a `refetch` function or use React Query
3. **Add `error` state** to distinguish "no keys" from "failed to fetch"
4. **Use `useSyncExternalStore`** or Zustand store to share providers state across components
5. **Add `isLoading` initial `true`** — already done

## Dependencies

- `react` only
- `window.electronAPI` (global)
- Used by: `../components/workflow/ModelSelector`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test with configured and unconfigured providers
- Test timeout handling
