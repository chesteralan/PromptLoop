# Abstraction Rules: Hooks

**Files:** `src/hooks/useAuth.ts`, `useWorkflows.ts`, `usePrompts.ts`, `useExecutions.ts`, `useConfiguredProviders.ts`, `useAutoSave.ts`, `useKeyboardShortcuts.ts`, `useIpc.ts`, `useTheme.ts`, `useWorkflowSnapshot.ts`

---

## `src/hooks/useAuth.ts`

### Current Layer Mix

- Thin context consumer — correctly separated.

### Extraction Opportunities

- None — this is a well-factored hook.

### Interface Suggestions

- None — returns the `AuthContextValue` interface defined in `AuthProvider`.

### Dependency Direction

- ✅ Depends only on `AuthContext` from `AuthProvider`.

### Duplication

- N/A.

### Constants/Magic Values

- None.

---

## `src/hooks/useWorkflows.ts`

### Current Layer Mix

- **Firestore data access mixed with React Query integration.** All CRUD operations inline with Firestore SDK calls.

### Extraction Opportunities

- Extract Firestore collection/document ref builders into `src/lib/firestore-refs.ts`.
- Extract query key factory into a shared `src/lib/query-keys.ts`.
- Extract mutation success handlers (query invalidation) into shared patterns.

### Interface Suggestions

- `WorkflowRepository` interface: `getAll(userId): Promise<WorkflowData[]>`, `getById(userId, id): Promise<WorkflowData>`, `create(userId, data): Promise<string>`, `update(userId, id, data): Promise<void>`, `delete(userId, id): Promise<void>`.

### Dependency Direction

- ✅ Depends on `firebase/firestore`, `src/lib/firebase`, `useAuth`, `converters` — correct data access direction.
- ⚠️ `useWorkflow` and `useWorkflows` both built with `useQuery` — they share patterns.

### Duplication

- `workflowsRef(userId)` / `workflowRef(userId, workflowId)` ref builders — could be centralized.
- `onSuccess: () => queryClient.invalidateQueries(...)` pattern repeated in every mutation.
- `if (!user) throw new Error('Not authenticated')` repeated in 4+ mutations — extract `requireAuth(user): asserts user`.
- `createdAt: now` / `updatedAt: now` timestamp logic duplicated.

### Constants/Magic Values

- `['workflows', user?.uid]` / `['workflows', user?.uid, id]` (query keys), `'createdAt'` (sort field), `'desc'` (sort direction).

---

## `src/hooks/usePrompts.ts`

### Current Layer Mix

- Same pattern as `useWorkflows.ts` — Firestore CRUD mixed with React Query. Higher complexity with batch operations.

### Extraction Opportunities

- Extract `promptsRef`/`promptRef` builders into `src/lib/firestore-refs.ts`.
- Extract `writeBatch` reorder logic into `src/lib/prompt-reorder.ts`.
- Extract `toast.error` wrapping in `onError` into a shared `withErrorToast` helper.

### Interface Suggestions

- `PromptRepository` interface: `getAll(userId, workflowId): Promise<PromptData[]>`, `create(userId, workflowId, data): Promise<string>`, `update(userId, workflowId, promptId, data): Promise<void>`, `delete(userId, workflowId, promptId): Promise<void>`, `reorder(userId, workflowId, orderedIds): Promise<void>`.

### Dependency Direction

- ✅ Same as `useWorkflows.ts` — correct.

### Duplication

- **High duplication with `useWorkflows.ts`:** both files have identical patterns for `useQuery`, `useMutation`, ref builders, query keys, `useAuth` dependency, error handling, and timestamp management.
- `promptsKey` factory duplicates `workflowsKey` pattern.
- `CreatePromptInput` / `UpdatePromptInput` types duplicate the pattern from workflows.
- `onError: (err) => toast.error(...)` repeated in 4+ mutations.

### Constants/Magic Values

- `['prompts', userId, workflowId]`, `'position'` (sort field), `'asc'` (direction).

---

## `src/hooks/useExecutions.ts`

### Current Layer Mix

- Single `useQuery` with conditional Firestore query building — clean.

### Extraction Opportunities

- Extract execution query builder into `src/lib/firestore-queries.ts`.

### Interface Suggestions

- `ExecutionRepository` interface: `getAll(userId, workflowId?, limit?): Promise<ExecutionData[]>`.

### Dependency Direction

- ✅ Correct.

### Duplication

- Query pattern duplicates `useWorkflows.ts`/`usePrompts.ts`.
- `as (ExecutionData & { id: string })[]` cast pattern repeated.

### Constants/Magic Values

- `['executions', user?.uid, workflowId, resultLimit]`, `100` (default limit), `'workflowId'` (filter field), `'createdAt'` (sort), `'desc'`.

---

## `src/hooks/useConfiguredProviders.ts`

### Current Layer Mix

- **Component state (`useState`) mixed with IPC calls and manual abort/timeout logic.** Not using React Query despite being a data-fetching hook.

### Extraction Opportunities

- Convert to `useQuery` with `window.electronAPI.listApiKeys` as the query function.
- Extract timeout logic into a shared `useTimeout` hook.
- The `AbortController` + `clearTimeout` cleanup pattern is manually implemented — React Query handles this.

### Interface Suggestions

- Return type is fine: `{ configuredProviders, loading, error, refetch }`.

### Dependency Direction

- ✅ Depends on `window.electronAPI` — but should use `src/lib/ipc.ts` typing.

### Duplication

- Manual `loading`/`error` state management duplicates what React Query provides.
- `setLoading(true)` / `setError(null)` / `try` / `catch` / `finally` pattern.

### Constants/Magic Values

- `10_000` (timeout), `'Request timed out'`, `'Failed to fetch configured providers'`.

---

## `src/hooks/useAutoSave.ts`

### Current Layer Mix

- Debounce logic, dirty tracking, keyboard shortcut (`Cmd+S`), and save timing all in one generic hook — well-factored.

### Extraction Opportunities

- Extract the debounce mechanism into a shared `useDebounce(value, delay)` hook.
- Extract `Cmd+S` listener into a shared `useKeyboardSave(onSave)` hook.

### Interface Suggestions

- `UseAutoSaveOptions<T>` and return type are clean.

### Dependency Direction

- ✅ Self-contained, no project dependencies.

### Duplication

- `JSON.stringify(data)` / `JSON.parse` comparison pattern for dirty tracking.
- `timerRef` debounce pattern reusable.

### Constants/Magic Values

- `2000` (default delay), `'s'` (keyboard shortcut).

---

## `src/hooks/useKeyboardShortcuts.ts`

### Current Layer Mix

- Keyboard event handling mixed with navigation and DOM querying for close buttons.

### Extraction Opportunities

- Extract `isInputFocused()` into a shared utility.
- Extract close button query (`[data-slot="sheet-close"], [data-slot="dialog-close"]`) — fragile, depends on Radix internals.

### Interface Suggestions

- `UseKeyboardShortcutsOptions` is clean.

### Dependency Direction

- ✅ Uses `useNavigate` — acceptable for a navigation shortcut hook.

### Duplication

- `isCmd = e.metaKey || e.ctrlKey` pattern duplicated from `useAutoSave.ts`.

### Constants/Magic Values

- `'input, textarea, select, [contenteditable]'` (selector), `'n'`, `','`, `' '`, `'s'`, `'Escape'`, `'/workflows/new'`, `'/settings'`.

---

## `src/hooks/useIpc.ts`

### Current Layer Mix

- **IPC listener registration and workflow control methods — thin wrappers around `window.electronAPI`.** Well-separated but tightly coupled to Electron's IPC.

### Extraction Opportunities

- Extract `useExecutionListener` into `useExecutionStream(workflowId)` that also manages prompt status tracking (currently in `ExecutionViewerPage`).
- Extract workflow control callbacks into a `useWorkflowControl(workflowId)` that manages loading state automatically.

### Interface Suggestions

- `ElectronAPI` interface from `src/lib/ipc.ts` — ensure alignment with the actual preload API shape.
- `IpcListener` interface: `on(channel, handler): () => void`.

### Dependency Direction

- ✅ Depends on `useExecutionStore` and `window.electronAPI` — correct.
- ⚠️ Direct access to `window.electronAPI` — should use typed import from `src/lib/ipc.ts`.

### Duplication

- `addLog` call with `0` tokens/`0` durationMs repeated for both completed and failed.
- `new Date().toISOString()` timestamp creation repeated.
- Listener cleanup pattern repeated for all 4 channels.

### Constants/Magic Values

- `'execution:chunk'`, `'execution:completed'`, `'execution:failed'`, `'workflow:completed'`, `0` (fallback tokens/duration).

---

## `src/hooks/useTheme.ts`

### Current Layer Mix

- Theme application to DOM (side effect) and system preference listener — well-separated.

### Extraction Opportunities

- Extract system theme detection into `useSystemTheme()` hook.
- Extract dark mode class toggling into `applyThemeToDOM(theme): void`.

### Interface Suggestions

- Return type `{ theme, setTheme }` is clean.

### Dependency Direction

- ✅ Depends on `useSettingsStore` — correct.

### Duplication

- `mq.addEventListener('change', apply)` / `mq.removeEventListener('change', apply)` pattern.
- `root.classList.toggle('dark', ...)` called in both branches.

### Constants/Magic Values

- `'(prefers-color-scheme: dark)'` (media query).

---

## `src/hooks/useWorkflowSnapshot.ts`

### Current Layer Mix

- Firestore `onSnapshot` listener (real-time data access) mixed with Zustand store updates.

### Extraction Opportunities

- Extract Firestore snapshot listener creation into `src/lib/firestore-listeners.ts`.
- The `data.createdAt instanceof Date` / `.toISOString()` conversion pattern is fragile — move to `converters.ts`.

### Interface Suggestions

- `WorkflowSnapshotService` interface: `subscribe(workflowId, onUpdate, onError): () => void`.

### Dependency Direction

- ✅ Depends on `useWorkflowStore`, `useAuth`, `firebase/firestore` — correct.

### Duplication

- `createdAt`/`updatedAt` timestamp conversion duplicated from what `converters.ts` already handles (but in the other direction).
- `doc(db, 'users', user.uid, 'workflows', workflowId)` path builder duplicated from `useWorkflows.ts`.

### Constants/Magic Values

- `'users'`/`'workflows'` (collection path), `console.warn` error message.
