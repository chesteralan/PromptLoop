# Refactoring Rules: `src/store/`

## Purpose

Provides Zustand state stores for execution state, workflow list, and user settings.

## Current Issues

### executionStore.ts

- `ExecutionLog.id` is typed as `string` but in `useIpc.ts` it's set to `data.promptId` which means duplicate prompt IDs overwrite in logs — logs should have unique IDs
- `executionStatus` type is `'idle' | 'running' | 'paused' | 'stopped' | 'error'` but the shared `WorkflowStatus` type in `electron/shared/types.ts` includes `'completed'` — inconsistency
- `currentPromptIndex` and `loopIteration` are stored but never updated by the execution listener hooks
- No action to reset full store state (e.g., for new workflow execution)

### workflowStore.ts

- `Workflow` interface `status` typed as `WorkflowStatus` from shared types — good
- `createdAt` and `updatedAt` are `string` but Firestore stores them as `Timestamp` — the converter in `converters.ts` converts to `Date` — inconsistency between store and converter types
- `isLoading` state exists but is never used by the store actions themselves (only set initially)

### settingsStore.ts

- `persist` middleware stores user preferences to localStorage — good
- `user` field is persisted via `partialize` (excluded from persist) — correct
- `user` field is `User | null` but `User` is a Firebase type — leaks Firebase dependency into store; consider storing only `uid` / `email`
- `isAuthenticated` is derived from `user !== null` — redundant state that can get out of sync

### index.ts

- Clean; simple barrel export

## Refactoring Rules

1. **Generate unique log IDs** in `executionStore` (use `crypto.randomUUID()` or incrementing counter)
2. **Add `resetExecution` action** to `executionStore` to clear all state
3. **Align `executionStatus` type** with `WorkflowStatus` from shared types (add `'completed'`)
4. **Remove `isLoading` from `workflowStore`** — use React Query's `isLoading` instead
5. **Remove `isAuthenticated` from `settingsStore`** — derive from `user !== null`
6. **Replace `User` type** in `settingsStore` with a minimal `{ uid: string; email: string | null }` shape
7. **Update `currentPromptIndex` and `loopIteration`** from execution IPC events
8. **Fix `createdAt`/`updatedAt` types** — use `Date` consistently or `string` consistently

## Dependencies

- All: `zustand`
- `settingsStore.ts`: `zustand/middleware`, `firebase/auth`
- `workflowStore.ts`: `../../electron/shared/types`

## Verification

- `npm run lint`
- `npm run typecheck`
- Run store unit tests in `src/test/stores.test.ts`
- Verify persist middleware loads/saves settings correctly
