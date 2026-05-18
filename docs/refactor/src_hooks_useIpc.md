# Refactoring Rules: `src/hooks/useIpc.ts`

## Purpose

Provides React hooks for listening to Electron IPC execution events (`useExecutionListener`) and sending workflow control commands (`useWorkflowControl`).

## Current Issues

1. **`useExecutionListener`** creates 4 IPC listeners but only updates the execution store — it doesn't expose any loading or connection state
2. **`tokensIn` and `tokensOut`** are hardcoded to `0` in the `addLog` calls — the store accepts them but they're never populated from IPC events
3. **`onExecutionCompleted`** triggers `addLog` but doesn't update `currentPromptIndex` or `promptStatuses` in the store
4. **`useWorkflowControl`** returns plain functions that directly call `window.electronAPI` — no error handling or loading state
5. **`useEffect` dependency array** has `setExecutionStatus`, `appendResponseChunk`, `clearResponse`, `addLog` — all stable Zustand selectors, fine
6. **No memoization of cleanup functions** — returned cleanup is fine as React runs cleanup before re-run

## Refactoring Rules

1. **Add `currentPromptIndex` update** to `useExecutionListener` when chunks arrive
2. **Add `tokensIn`/`tokensOut` tracking** to execution events (requires engine to emit them)
3. **Add return value** `{ isConnected: boolean }` or similar status
4. **Wrap `useWorkflowControl` return values** in `useCallback`
5. **Add `useWorkflowControl` loading state** — track pending operations
6. **Rename hook files** — `useIpc.ts` contains `useExecutionListener` and `useWorkflowControl`; name should reflect that

## Dependencies

- `../store/executionStore`
- `window.electronAPI` (global)
- Used by: `../pages/ExecutionViewer`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test execution listener receives events
- Test workflow control methods invoke correct IPC
