# Abstraction Rules: Stores

**Files:** `src/store/workflowStore.ts`, `executionStore.ts`, `settingsStore.ts`, `index.ts`

---

## `src/store/workflowStore.ts`

### Current Layer Mix

- Zustand store with CRUD operations on a local `Workflow[]` array — well-separated.

### Extraction Opportunities

- Extract `Workflow` interface to `src/lib/models/workflow.ts`.
- Consider whether Firestore snapshots (via `useWorkflowSnapshot`) should update this store, or if it should be replaced by React Query caching.

### Interface Suggestions

- `WorkflowStore` interface is clean. Consider adding selectors:
  - `selectWorkflowById(id): Workflow | undefined`
  - `selectActiveWorkflow(): Workflow | undefined`

### Dependency Direction

- ✅ Self-contained — depends only on zustand and shared types.

### Duplication

- `Workflow` interface overlaps with `WorkflowData` in `converters.ts` and `WorkflowConfig` in `electron/main/engine/types.ts`. The `createdAt`/`updatedAt` type differs (string vs Date).

### Constants/Magic Values

- None.

---

## `src/store/executionStore.ts`

### Current Layer Mix

- Execution state management (status, response buffer, logs, current prompt) — well-separated.

### Extraction Opportunities

- Extract `ExecutionLog` interface to `src/lib/models/execution.ts`.
- Extract `initialState` — already done. ✅
- Consider adding log deduplication (currently pushes without checking for duplicates).

### Interface Suggestions

- `ExecutionStore` interface is clean.
- `resetExecution` uses `initialState` — good pattern. Consider `Partial<typeof initialState>` to allow selective reset.

### Dependency Direction

- ✅ Self-contained — depends only on zustand.

### Duplication

- `ExecStatus` type duplicates `RunnerState` in `electron/main/engine/types.ts` and `ExecStatus` in `ExecutionControls.tsx`.
- `ExecutionLog` interface overlaps with `ExecutionLog` in `electron/shared/types.ts`.

### Constants/Magic Values

- `100` (max logs cap), `crypto.randomUUID()` (log ID generation).

---

## `src/store/settingsStore.ts`

### Current Layer Mix

- Zustand store with `persist` middleware for local storage — well-separated.

### Extraction Opportunities

- Extract `Theme` type to `src/lib/models/settings.ts`.
- Extract `StoredUser` to shared auth types.
- The `partialize` function manually selects fields — could use a helper `pick(state, keys)`.

### Interface Suggestions

- `SettingsStore` interface is clean.
- Consider adding `resetSettings()` action.

### Dependency Direction

- ✅ Self-contained — depends only on zustand and zustand/middleware.

### Duplication

- `Theme = 'light' | 'dark' | 'system'` type duplicated in `Sidebar.tsx`, `useTheme.ts`, and `SettingsPage`.

### Constants/Magic Values

- `'promptloop-settings'` (localStorage key).

---

## `src/store/index.ts`

### Current Layer Mix

- Barrel re-export — well-factored.

### Extraction Opportunities

- None.

### Interface Suggestions

- None.

### Dependency Direction

- ✅ Correctly re-exports all stores.

### Duplication

- N/A.

### Constants/Magic Values

- None.
