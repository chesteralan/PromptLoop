# Refactoring Rules: `electron/shared/types.ts`

## Purpose

Defines shared TypeScript interfaces and types used across both main and renderer processes for workflow execution, API keys, and window state.

## Current Issues

1. **`WindowState.mode`** uses `'full' | 'compact'` but `PersistedState` in `window.ts` has the same interface — duplicate definition
2. **`ExecutionResult` includes `tokensIn` and `tokensOut`** but the engine's `ExecutionEventMap['execution:completed']` does not — the values are never populated
3. **`ApiKeyEncryptPayload`** has `apiKey` field (camelCase) but the IPC handler in `api-keys.ts` receives `key` field — naming mismatch
4. **No `ApiKeyListResponse` type** — `listApiKeys` returns raw `StoredKey[]` fields but the preload expects `{ id, provider, keyPrefix, createdAt }[]`
5. **`AppUpdateEvent`** is defined but never used since `updater.ts` is a stub
6. **`WindowState`** uses `x: number | undefined` and `y: number | undefined` — should use optional properties (`x?: number`)

## Refactoring Rules

1. **Remove `WindowState`** if it duplicates `PersistedState` in `window.ts` — consolidate into shared types
2. **Add `tokensIn`/`tokensOut` to execution events** or remove from `ExecutionResult`
3. **Fix `ApiKeyEncryptPayload.apiKey`** → `key` to match IPC handler
4. **Add `ApiKeyListResponse`** type matching what preload exposes
5. **Remove or implement `AppUpdateEvent`** if updater is planned
6. **Use optional properties** for `WindowState.x` and `WindowState.y`
7. **Add `ExecutionLog` type** to share between store and IPC events
8. **Add `WorkflowConfig` and `PromptConfig` types** currently defined in `electron/main/engine/types.ts` — promote to shared if used across boundary

## Dependencies

- Used by: `electron/preload/index.ts`, `electron/main/engine/types.ts`, `electron/main/encryption.ts`, `src/lib/ipc.ts`, `src/store/workflowStore.ts`
- No internal dependencies

## Verification

- `npm run typecheck` (both electron and src)
- Ensure all files that import from here compile correctly
