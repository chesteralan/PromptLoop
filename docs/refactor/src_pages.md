# Pages & Routing Refactor Rules

Files: `src/pages/Dashboard.tsx`, `src/pages/WorkflowEditor.tsx`, `src/pages/ExecutionViewer.tsx`, `src/pages/Login.tsx`, `src/pages/Onboarding.tsx`, `src/pages/Settings.tsx`, `src/pages/ApiKeys.tsx`, `src/routes.tsx`, `src/App.tsx`, `src/main.tsx`

## Standards Violated

### 3 — React Component Standards (component size)

- **Specific issues:**
  - `WorkflowEditor.tsx` — **378 lines** — the largest component in the project. Handles workflow CRUD, prompt CRUD, auto-save, dirty tracking, import/export, and UI rendering
  - `Dashboard.tsx` — 163 lines — moderate but could be reduced
  - `ExecutionViewer.tsx` — 219 lines — manages execution state, prompt statuses, progress, and queue display
- **Fix:** Split `WorkflowEditor` into focused sub-components: `WorkflowEditorHeader`, `WorkflowEditorForm`, `PromptManager`. Extract workflow control logic from `ExecutionViewer` into a custom hook.
- **Priority:** **High**

### 4 — State Management (excessive useEffect)

- **Specific issues:**
  - `WorkflowEditor.tsx` — **5 useEffects**: initial sync, prompts sync, dirty tracking, beforeunload, plus auto-save internally
  - `WorkflowEditor.tsx:64-92` — Multiple effects competing for state synchronization between server data and local state
  - `ExecutionViewer.tsx:42` — `useExecutionListener()` effect hooks into IPC events
- **Fix:** Consolidate sync logic; use derived state where possible; consider a single effect for initialization
- **Priority:** High

### 11 — Error Handling

- **Specific issues:**
  - `WorkflowEditor.tsx:27` — `.catch(...)` in `getDoc` for onboarding check uses `console.warn`
  - `ExecutionViewer.tsx:143` — `window.electronAPI.stopWorkflow(wf.id).catch(() => {})` silent in Dashboard
- **Fix:** Surface errors to users; don't silently swallow IPC failures
- **Priority:** Medium

### 17 — Code Smells to Eliminate

- **Specific issues:**
  - `WorkflowEditor.tsx:35` — `EMPTY_PROMPTS` const outside component (good), but `promptsData = EMPTY_PROMPTS` default masks undefined state
  - `WorkflowEditor.tsx:62` — `isDirtyRef` ref alongside local state creates manual synchronization complexity
  - `WorkflowEditor.tsx:153-166` — `handleCreatePrompt` uses `localPrompts.length` which may be stale in closure
  - `Dashboard.tsx:15-19` — `statColor` function defined inside file but outside component
  - `ExecutionViewer.tsx:39` — `resetExecution` destructured but only used in callbacks
  - `ExecutionViewer.tsx:81` — Direct `useExecutionStore.getState().setExecutionStatus(...)` calls in callbacks
- **Fix:** Eliminate `isDirtyRef` in favor of derived dirty state; use functional updates for `handleCreatePrompt`; avoid direct store `.getState()` calls in callbacks
- **Priority:** Medium

### 9 — Import Rules

- **Specific issues:**
  - `WorkflowEditor.tsx:32` — Relative import `../../electron/shared/types` should be an alias
- **Fix:** Use configured import alias
- **Priority:** Low

### 14 — Accessibility

- **Specific issues:**
  - `Onboarding.tsx:76,85` — `<label>` elements without `htmlFor` attribute; not explicitly associated with inputs
- **Fix:** Add `htmlFor` matching input `id` attributes
- **Priority:** Low
