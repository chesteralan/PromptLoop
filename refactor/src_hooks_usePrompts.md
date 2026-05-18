# Refactoring Rules: `src/hooks/usePrompts.ts`

## Purpose

Provides React Query hooks for CRUD operations on Firestore prompt subcollections within a workflow.

## Current Issues

1. **`workflowId: string | undefined`** pattern used throughout — when `undefined`, mutations throw "Not authenticated or missing workflow" — could use `enabled` option instead
2. **`writeBatch`** import used correctly in `useReorderPrompts` — good
3. **All mutations invalidate** `['prompts', user?.uid, workflowId]` query key — correct cache invalidation
4. **No optimistic updates** — UI waits for Firestore response before reflecting changes
5. **`useCreatePrompt`** receives `Omit<PromptData, 'createdAt' | 'updatedAt'>` which includes `workflowId` — caller must pass it, but it's also implied by the hook's `workflowId` parameter
6. **`useUpdatePrompt`** doesn't check if prompt exists before updating
7. **`useReorderPrompts`** updates `position` field name for each prompt — assumes all IDs exist in collection

## Refactoring Rules

1. **Add optimistic updates** for create/update/delete/reorder for instant UI feedback
2. **Remove `workflowId` from mutation data** type in `useCreatePrompt` — derive from hook parameter
3. **Add batch validation** in `useReorderPrompts` — handle case where an ID doesn't exist
4. **Extract query keys** into shared factory
5. **Add `enabled` option** to mutations to prevent execution when `workflowId` is undefined
6. **Add `onError` callbacks** for user-facing error messages

## Dependencies

- `@tanstack/react-query`, `firebase/firestore`
- `../lib/firebase`, `./useAuth`, `../lib/converters`
- Used by: `../pages/WorkflowEditor`, `../pages/ExecutionViewer`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test CRUD operations on prompts
- Test reorder with batch write
- Test error when workflowId is undefined
