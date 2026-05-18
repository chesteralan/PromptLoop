# Hooks Refactor Rules

Files: `src/hooks/useAuth.ts`, `src/hooks/useWorkflows.ts`, `src/hooks/usePrompts.ts`, `src/hooks/useExecutions.ts`, `src/hooks/useIpc.ts`, `src/hooks/useAutoSave.ts`, `src/hooks/useConfiguredProviders.ts`, `src/hooks/useTheme.ts`, `src/hooks/useWorkflowSnapshot.ts`, `src/hooks/useKeyboardShortcuts.ts`

## Standards Violated

### 5 — Hooks (single responsibility)

- **Specific issues:**
  - `useAutoSave.ts` — Has **two responsibilities**: (1) debounced auto-save on data change, (2) keyboard shortcut listener (Cmd+S)
  - `useWorkflowSnapshot.ts` — Mixes Firestore real-time listener setup with workflow store updates
- **Fix:** Extract keyboard shortcut handling from `useAutoSave` into `useKeyboardShortcuts` (which already handles Cmd+N, Cmd+,, Escape); Extract Firestore listener logic from store update logic
- **Priority:** Medium

### 17 — Code Smells to Eliminate (duplicate CRUD pattern)

- **Specific issues:**
  - `useWorkflows.ts` and `usePrompts.ts` — Nearly identical CRUD hook patterns: both have `useQuery` + `useMutation` for create/update/delete, both invalidate query caches on success, both have `onError` toast handlers
  - Pattern differences: `useWorkflows` has no `onError` toasts, `usePrompts` does — inconsistency
  - `useWorkflows.ts:89-90` — `safeData` with `delete safeData.id` is a mutation of the input parameter
- **Fix:** Create a shared `useFirestoreCollection` or `useCrud` factory hook for Firestore subcollection CRUD; avoid mutating function parameters
- **Priority:** High

### 5 — Hooks (excessive side effects)

- **Specific issues:**
  - `useIpc.ts:10-51` — `useEffect` registers 4 IPC listeners with individual cleanup functions — correct but verbose
  - `useConfiguredProviders.ts:8-30` — Manual AbortController + timeout logic instead of using react-query for the fetch
- **Fix:** Use react-query for `useConfiguredProviders` (consistent with the rest of the codebase); extract IPC listener setup to a utility
- **Priority:** Medium

### 11 — Error Handling

- **Specific issues:**
  - `useWorkflowSnapshot.ts:34` — `console.warn('Workflow snapshot error:', error.message)` — silent to user
  - `useConfiguredProviders.ts:25` — Silent catch sets error state but no user-facing surface
- **Fix:** Surface Firestore snapshot errors to user via toast or error boundary
- **Priority:** Low

### Clean Files

- `useAuth.ts` — Clean, minimal
- `useExecutions.ts` — Clean
- `useTheme.ts` — Clean
- `useKeyboardShortcuts.ts` — Clean
