# Refactoring Rules: `src/pages/WorkflowEditor.tsx`

## Purpose

Workflow editor page with prompt management (create, edit, reorder, delete), workflow settings, import/export, and auto-save.

## Current Issues

1. **Complex component** (380 lines) — needs decomposition into smaller hooks or sub-components
2. **`initialSyncDone` ref** pattern works but is fragile — if the workflow object changes reference but has the same data, the effect won't re-run
3. **`prevPromptsRef` pattern** for detecting prompts changes is a workaround for the fact that `promptsData` reference doesn't change after fetch
4. **`isDirtyRef`** flag is set on every change but only used for `beforeunload` — consider using useAutoSave's dirty state instead
5. **`handleImport`** creates a new workflow in the current workflow's editor (via `createWorkflow` mutation) then navigates away — confusing UX; should show confirmation
6. **`handlePromptChange`** updates `localPrompts` but never persists the changes — they're only saved via individual `updatePrompt.mutate` calls from other interactions
7. **`handleCreatePrompt`** depends on `localPrompts.length` for position — but position is also set in Firestore; race condition if prompts were added/removed by other sessions
8. **`reorderPrompts` mutation** doesn't wait for success before updating `localPrompts` — optimistic update may roll back
9. **No loading state** for delete workflow (deletes immediately)
10. **Double `const VITE_DEV_SERVER_URL`** in `index.ts` is not this file's issue but the import of `LoopMode` from electron shared types creates main/renderer coupling

## Refactoring Rules

1. **Extract `useWorkflowEditor` hook** to manage all editor state (name, loopMode, maxIterations, localPrompts, selections)
2. **Replace `initialSyncDone` ref** with a proper effect keyed on `workflow?.id`
3. **Use React Query's `isStale`** to detect when prompts data changes instead of ref comparison
4. **Remove `isDirtyRef`** — derive dirty state from auto-save's `isDirty`
5. **Add confirmation dialog** for import that shows preview of imported data
6. **Persist prompt changes** with debounced mutations (like auto-save for prompts)
7. **Add loading/skeleton state** for delete workflow action
8. **Import `LoopMode` from a shared barrel file** instead of direct `../../electron/shared/types`
9. **Wrap large handlers in `useCallback`** with proper deps — some are already wrapped but `handleSave` is not

## Dependencies

- `../hooks/useWorkflows`, `../hooks/usePrompts`, `../hooks/useAutoSave`
- `../components/ui/*`, `../components/shared/*`, `../components/workflow/*`
- `../../electron/shared/types`, `../lib/converters`
- `lucide-react`, `react-router-dom`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test create new workflow → add prompts → save → edit
- Test import/export
- Test auto-save triggers after 3s
- Test delete workflow
- Test drag-and-drop reorder
