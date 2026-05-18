# Refactoring Rules: `src/lib/firestore-helpers.ts`

## Purpose

Provides convenience functions for Firestore CRUD operations (createWorkflow, createPrompt, reorderPrompts, etc.) with type-safe converters.

## Current Issues

1. **`userPath` function** is a local utility but duplicates the same path-building logic found in `useWorkflows.ts`, `usePrompts.ts` — violates DRY
2. **`createPrompt`** queries the latest position from Firestore every time — this is an extra read for every prompt creation; could use client-side position tracking
3. **No batching** across workflows — `createWorkflow` and `createPrompt` are separate operations
4. **`updateDoc` called with `updatedAt: new Date()`** — this stores a `Date` object but the converters expect a `Timestamp` — the converter wraps it, but only if using `withConverter`. Since `updateDoc` is called without the converter ref, the `Date` is stored as-is, which Firestore may convert to a `Timestamp` automatically (it does, but implicit conversion is risky)
5. **`reorderPrompts`** uses `writeBatch` with converter-less refs from `userPath` — but `userPath` returns converter-typed refs; `batch.update` on converter-typed refs works correctly
6. **`createExecution`** includes `workflowId` in the stored data — same redundancy issue as converters
7. **No `createExecution` validation** — accepts raw `ExecutionData` without checking required fields
8. **All functions** assume `userId` is valid — no authentication check

## Refactoring Rules

1. **Consolidate path-building** — move `userPath` to a shared utility or use existing hooks
2. **Remove `workflowId` from prompt/execution data** in Firestore writes (path already encodes it)
3. **Add client-side position tracking** for `createPrompt` to avoid extra read
4. **Use `serverTimestamp()`** for `updatedAt` instead of `new Date()`
5. **Add authentication guards** — throw if `userId` is empty
6. **Remove dead code** if hooks (`useWorkflows`, `usePrompts`) are used instead
7. **Add input validation** for required fields before writing

## Dependencies

- `firebase/firestore`, `../lib/firebase`, `../lib/converters`
- Used by: potentially unused if hooks provide all necessary CRUD operations

## Verification

- `npm run lint`
- `npm run typecheck`
- Test CRUD operations end-to-end
- Verify position auto-increment for new prompts
- Test batch reorder
