# Hooks — Testing Rules

## 1. `src/hooks/useAuth.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Returns context value from `AuthContext`
  - Throws `"useAuth must be used within an AuthProvider"` when used outside provider
- **Mocking requirements:** `AuthContext` from `../components/auth/AuthProvider`
- **Coverage targets:** Within provider (success) vs outside (error)
- **Suggested test file location:** `src/test/hooks/useAuth.test.ts`

## 2. `src/hooks/useAutoSave.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Returns `{ isDirty, isSaving, saveNow }`
  - `isNew === true`: never saves on data change, never sets isDirty, keyboard shortcut does nothing
  - `isNew === false`: marks dirty when data changes; debounces save after `delay` ms; cancels save timer on unmount
  - `saveNow()`: calls `save` function with current data; sets `isSaving` during save; resets dirty on success
  - `Cmd/Ctrl+S` keyboard shortcut triggers `saveNow()`
  - Save timer cleared on unmount
  - Ref updates for `save` function (avoids stale closure)
- **Mocking requirements:** None (pure hook)
- **Coverage targets:** isNew vs existing; data unchanged (same JSON); dirty/debounce lifecycle; keyboard shortcut; unmount cleanup
- **Suggested test file location:** `src/test/hooks/useAutoSave.test.ts`

## 3. `src/hooks/useConfiguredProviders.ts`

- **Test type:** Unit
- **Key scenarios:**
  - On mount: fetches API keys via `window.electronAPI.listApiKeys()`; deduplicates by provider
  - Sets `loading: true` while fetching, `false` after
  - Sets `error` on timeout (10s) or fetch failure
  - Respects `AbortSignal` to avoid state updates after unmount
  - Returns `{ configuredProviders, loading, error, refetch }`
  - `refetch` re-fetches providers fresh
- **Mocking requirements:** `window.electronAPI.listApiKeys`; AbortController
- **Coverage targets:** Success (deduplicates); timeout; fetch error; abort after unmount
- **Suggested test file location:** `src/test/hooks/useConfiguredProviders.test.ts`

## 4. `src/hooks/useExecutions.ts`

- **Test type:** Integration
- **Key scenarios:**
  - Returns empty array when no user
  - Queries Firestore `users/{uid}/executions` subcollection ordered by `createdAt` desc
  - With `workflowId`: adds `where('workflowId', '==', workflowId)` filter
  - Limits to `resultLimit` (default 100)
  - Query only enabled when user exists
  - Uses `executionConverter` for Firestore serialization
- **Mocking requirements:** `@tanstack/react-query` useQuery; `firebase/firestore` collection, getDocs, query, orderBy, limit, where; `../../lib/firebase` (db); `./useAuth`
- **Coverage targets:** No user; with/without workflowId; enabled/disabled query
- **Suggested test file location:** `src/test/hooks/useExecutions.test.ts`

## 5. `src/hooks/useIpc.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `useExecutionListener()`: subscribes to 4 channels (`onExecutionChunk`, `onExecutionCompleted`, `onExecutionFailed`, `onWorkflowCompleted`); cleanup unsubscribes all on unmount
  - On chunk: calls `appendResponseChunk(data.chunk)`
  - On completed: adds log with status 'completed', durationMs, tokensIn=0, tokensOut=0
  - On failed: adds log with status 'failed', error message
  - On workflow completed: sets execution status to 'idle' and clears response
  - `useWorkflowControl()`: returns 4 memoized callbacks wrapping `window.electronAPI` methods
- **Mocking requirements:** `window.electronAPI.onExecutionChunk`, `onExecutionCompleted`, `onExecutionFailed`, `onWorkflowCompleted`; `../../store/executionStore`
- **Coverage targets:** All 4 event handlers; listener cleanup; `appendResponseChunk` called with `data.chunk`
- **Suggested test file location:** `src/test/hooks/useIpc.test.ts`

## 6. `src/hooks/useKeyboardShortcuts.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `Cmd/Ctrl+N`: navigates to `/workflows/new` unless input is focused
  - `Cmd/Ctrl+,`: navigates to `/settings` unless input focused
  - `Cmd/Ctrl+S`: calls `options.onSave` (no input focus guard)
  - `Escape`: clicks first element matching `[data-slot="sheet-close"], [data-slot="dialog-close"]`
  - `Space`: calls `options.onPlayPause` unless input focused
  - `isInputFocused()` returns true when `input`, `textarea`, `select`, or `[contenteditable]` is focused
  - Options ref avoids stale closures
  - Cleanup removes event listener on unmount
- **Mocking requirements:** `react-router-dom` useNavigate
- **Coverage targets:** All shortcut keys; input focused vs not; Escape click target present vs absent; Cmd vs Ctrl (metaKey vs ctrlKey)
- **Suggested test file location:** `src/test/hooks/useKeyboardShortcuts.test.ts`

## 7. `src/hooks/usePrompts.ts`

- **Test type:** Integration
- **Key scenarios:**
  - `usePrompts(workflowId)`: returns empty if no user or no workflowId; queries prompts ordered by position
  - `useCreatePrompt(workflowId)`: adds doc with timestamps and workflowId; invalidates query on success; shows error toast on failure
  - `useUpdatePrompt(workflowId)`: updates doc with partial data + updatedAt; invalidates on success
  - `useDeletePrompt(workflowId)`: deletes doc; invalidates on success
  - `useReorderPrompts(workflowId)`: uses Firestore batch write to update all positions; invalidates on success
  - All mutations throw if no user or missing workflowId
  - Firestore collection references use `promptConverter`
- **Mocking requirements:** `@tanstack/react-query` (useQuery, useMutation, useQueryClient); `firebase/firestore` (collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch); `../../lib/firebase` (db); `./useAuth`; `../../lib/converters`; `sonner` toast
- **Coverage targets:** Success/error for all 5 operations; no user guard; no workflowId guard
- **Suggested test file location:** `src/test/hooks/usePrompts.test.ts`

## 8. `src/hooks/useTheme.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `theme === 'system'`: applies `prefers-color-scheme: dark` media query; adds/removes `dark` class on root; listens for changes; cleans up listener on unmount
  - `theme === 'dark'`: adds `dark` class to `document.documentElement`
  - `theme === 'light'`: removes `dark` class from root
  - Returns `{ theme, setTheme }` from settings store
- **Mocking requirements:** `window.matchMedia`; `../../store/settingsStore`
- **Coverage targets:** All 3 theme values; system media query change event; cleanup on unmount
- **Suggested test file location:** `src/test/hooks/useTheme.test.ts`

## 9. `src/hooks/useWorkflows.ts`

- **Test type:** Integration
- **Key scenarios:**
  - `useWorkflows()`: returns empty if no user; queries workflows ordered by createdAt desc
  - `useWorkflow(id)`: returns null if no user/id; returns null if doc doesn't exist; returns doc data with id
  - `useCreateWorkflow()`: adds doc with createdAt/updatedAt; invalidates list on success
  - `useUpdateWorkflow()`: strips `id` from data before update; adds updatedAt; invalidates list and individual query
  - `useDeleteWorkflow()`: deletes doc; invalidates list
  - All mutations throw if no user
  - Firestore references use `workflowConverter`
- **Mocking requirements:** `@tanstack/react-query` (useQuery, useMutation, useQueryClient); `firebase/firestore` (collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy); `../../lib/firebase` (db); `./useAuth`; `../../lib/converters`
- **Coverage targets:** All 5 operations; no user guard; null document guard
- **Suggested test file location:** `src/test/hooks/useWorkflows.test.ts`

## 10. `src/hooks/useWorkflowSnapshot.ts`

- **Test type:** Integration
- **Key scenarios:**
  - Returns early (no effect) when no user or no workflowId
  - Sets active workflow via `setActiveWorkflow(workflowId)`
  - Subscribes to Firestore `onSnapshot` on workflow doc
  - On snapshot: calls `updateWorkflow` with id + data; converts Date instances to ISO strings
  - On error: logs warning, does not crash
  - On unmount: unsubscribes; sets active workflow to null
  - Uses `workflowConverter`
- **Mocking requirements:** `firebase/firestore` (doc, onSnapshot); `../../lib/firebase` (db); `./useAuth`; `../../store/workflowStore`
- **Coverage targets:** Snapshot exists vs not; snapshot data with Date vs string timestamps; error callback; cleanup
- **Suggested test file location:** `src/test/hooks/useWorkflowSnapshot.test.ts`
