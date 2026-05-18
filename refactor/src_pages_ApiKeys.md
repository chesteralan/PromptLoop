# Refactoring Rules: `src/pages/ApiKeys.tsx`

## Purpose

API key management page that lists, adds, and deletes AI provider API keys via Electron IPC encryption.

## Current Issues

1. **`loadKeys` wrapped in `useCallback`** but only used once in `useEffect` — correct but unnecessary optimization for a page-level component
2. **`handleSave`** calls `window.electronAPI.encryptApiKey(provider, apiKey)` then `loadKeys()` — but `encryptApiKey` returns `{ id, keyPrefix }`; the new key could be added to local state directly instead of refetching
3. **`handleDelete`** calls API then optimistically removes from local state — good UX, but if the API call fails, the key is removed locally without recovery
4. **`keys` state type `ApiKeyInfo[]`** is defined locally but duplicates `electronAPI.listApiKeys()` return type — share via `ElectronAPI` type
5. **No loading state** for save operation (dialog handles its own saving state, but parent doesn't know)
6. **No error recovery** — if `handleDelete` throws, the key stays deleted locally but may still exist in encrypted store

## Refactoring Rules

1. **Use `useMutation`** from `@tanstack/react-query` for save/delete operations with proper caching
2. **Add optimistic updates** with rollback on error
3. **Remove local `ApiKeyInfo` type** — use the return type from `ElectronAPI['listApiKeys']`
4. **Add skeleton loading** while keys are loading
5. **Add confirmation toast** with undo option for delete
6. **Memoize sorted keys** with `useMemo`

## Dependencies

- `../components/ui/*`, `../components/shared/*`, `../components/settings/*`
- `lucide-react`, `sonner`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test add/delete API keys
- Test error handling when encryption fails
- Test empty state vs key list
