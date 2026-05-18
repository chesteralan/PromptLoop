# Refactoring Rules: `src/hooks/useWorkflowSnapshot.ts`

## Purpose

Sets up a real-time Firestore snapshot listener for a single workflow document and syncs updates to the Zustand workflow store.

## Current Issues

1. **`console.warn`** used for error logging — should use a proper logger or toast notification
2. **`setActiveWorkflow(null)`** called on cleanup — correct for unmount
3. **Snapshot data cast** `snapshot.data() as DocumentData` then spread `{ id: workflowId, ...data }` — the `updateWorkflow` expects `Partial<Workflow>` which includes fields like `name`, `status`, etc. — this is correct but `DocumentData` loses type safety
4. **`useEffect` dependency** includes `updateWorkflow` and `setActiveWorkflow` from Zustand — these are stable references, so this won't cause extra re-renders
5. **No loading state** — component using this doesn't know if snapshot is still initializing

## Refactoring Rules

1. **Use the `workflowConverter`** for typed snapshot data
2. **Replace `console.warn`** with more robust error handling
3. **Add `isLoading` return value** for the caller to show loading state
4. **Memoize the snapshot path** to avoid unnecessary listener re-creation
5. **Add `onError` callback** parameter for custom error handling

## Dependencies

- `firebase/firestore`, `react`
- `../lib/firebase`, `./useAuth`, `../store/workflowStore`
- Used by: pages that need real-time workflow updates

## Verification

- `npm run lint`
- `npm run typecheck`
- Verify snapshot updates store on Firestore changes
- Verify cleanup removes listener on unmount
