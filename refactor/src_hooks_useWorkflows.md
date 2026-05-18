# Refactoring Rules: `src/hooks/useWorkflows.ts`

## Purpose

Provides React Query hooks for CRUD operations on Firestore workflow documents.

## Current Issues

1. **`workflowConverter`** is used correctly with `withConverter` — good
2. **Query key structure** `['workflows', user?.uid, id]` — when `id` is undefined, the key becomes `['workflows', user?.uid, undefined]` which works but `undefined` in query keys can cause issues; use a filter type
3. **`useCreateWorkflow`** sets `createdAt` and `updatedAt` in the mutationFn but they're typed as `Date` — fine
4. **`useUpdateWorkflow`** spreads `...data` which could include `id` field if the caller passes it — no filtering
5. **`enabled: !!user`** guards against unauthenticated queries — correct
6. **No error handling** in queryFn — React Query catches errors, but no user-facing error feedback
7. **`workflowsRef` and `workflowRef`** defined as module-level functions — good for DRY
8. **`useWorkflow` returns `null`** when doc doesn't exist — distinguishes from loading state

## Refactoring Rules

1. **Add `enabled` guard `!!user && !!id`** for `useWorkflow` (already done)
2. **Strip `id` from update data** in `useUpdateWorkflow` to prevent accidentally overwriting document ID
3. **Add `useWorkflowMutations` convenience hook** that returns all mutations grouped
4. **Add optimistic updates** for create/update/delete for instant UI feedback
5. **Add error toasts** via `queryClient.getMutationDefaults` or mutation `onError`
6. **Separate query keys** into a `queryKeys` factory for type safety
7. **Use `undefined` filter** instead of `undefined` in query keys

## Dependencies

- `@tanstack/react-query`, `firebase/firestore`
- `../lib/firebase`, `./useAuth`, `../lib/converters`
- Used by: `../pages/Dashboard`, `../pages/WorkflowEditor`, `../pages/ExecutionViewer`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test query/mutation cycle end-to-end with Firestore
- Test error handling (offline, missing permissions)
