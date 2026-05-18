# Refactoring Rules: `electron/preload/index.ts`

## Purpose

Preload script that exposes a typed `electronAPI` via `contextBridge` for renderer-process IPC communication.

## Current Issues

1. **`encryptApiKey` and `decryptApiKey` return types** assert non-null with `r.id!` / `r.key!` — these assertions hide runtime errors; if the response shape changes, they'll return `undefined`
2. **`listApiKeys` returns `r.keys ?? []`** — the response type has `success: boolean` but doesn't require it; a failure response would return `undefined` which becomes `[]` silently
3. **`startWorkflow` passes `config?: unknown`** — no validation of the config object before IPC invoke
4. **`api` object** is not typed as `ElectronAPI` from `lib/ipc.ts` — there's no compile-time check that `api` conforms to the interface
5. **`showSaveDialog` and `showOpenDialog`** accept `options: unknown` — no validation or typing
6. **All IPC calls** use `.then()` with implicit `any` — could benefit from typed IPC helpers

## Refactoring Rules

1. **Add type annotation** `const api: ElectronAPI = { ... }` to ensure compile-time compliance
2. **Replace non-null assertions** with runtime checks and explicit error throws
3. **Add IPC response type guards** — validate response shape before accessing properties
4. **Remove unnecessary `.then()` wrappers** — some invoke responses pass through without transformation
5. **Add `import type { ElectronAPI }`** from `src/lib/ipc.ts` (or duplicate the type to avoid cross-boundary dependency)

## Dependencies

- External: `electron` (`ipcRenderer`, `contextBridge`)
- Internal: `../shared/types`
- Exposed to renderer as `window.electronAPI`

## Verification

- `npm run typecheck` (electron)
- Verify `contextBridge.exposeInMainWorld` exposes all methods
- Test each API method from renderer
