# Refactoring Rules: `src/lib/electron-mock.ts`

## Purpose

Injects a mock `window.electronAPI` for development in a regular browser (outside Electron).

## Current Issues

1. **`asyncNoop`** is typed as `(...args: unknown[]) => Promise<unknown>` but then cast to specific function types — the casts are unsafe but acceptable for mock
2. **All mock methods** return `Promise.resolve(undefined)` for `asyncNoop` — the actual methods return specific shapes like `{ success: boolean, workflowId: string }`. Mock return values don't match real types, which could cause runtime errors in browser dev
3. **`onExecutionChunk` etc.** return `noop` as cleanup — correct, but the mock never fires any events, so testing IPC-dependent features in browser is impossible
4. **`injectElectronMock`** checks `typeof window === 'undefined'` but this is always `false` in a browser context (redundant check)
5. **No ability to simulate IPC events** — can't test execution flow in browser without adding manual event triggers

## Refactoring Rules

1. **Replace `asyncNoop`** with proper mock return values matching real API shapes
2. **Add event simulation capabilities** — expose `mockElectronAPI.trigger(channel, data)` for testing
3. **Remove redundant `typeof window` check** (only runs in browser anyway)
4. **Add default chunk/event simulation** for demo mode
5. **Add `__MOCK_EVENTS__`** export to allow tests to trigger fake execution events
6. **Type the mock properly** — use `ElectronAPI` type with `Partial<>` for overridable methods

## Dependencies

- `./ipc` (types)
- Used by: `../main.tsx`

## Verification

- `npm run lint`
- `npm run typecheck`
- Verify mock is injected in browser dev mode (non-Electron)
- Verify real `electronAPI` is not overwritten in Electron
