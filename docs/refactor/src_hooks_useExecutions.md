# Refactoring Rules: `src/hooks/useExecutions.ts`

## Purpose

Provides React Query hook for fetching execution history from Firestore.

## Current Issues

1. **Same query** constructed regardless of `workflowId` parameter — the ternary in `queryFn` creates identical queries (same orderBy, same limit). The `workflowId` filter is never applied to the Firestore query
2. **No converter** used — returns raw `DocumentData` instead of typed `ExecutionData`
3. **No `where` clause** — the `workflowId` parameter is accepted but not used in the query
4. **`limit(100)`** hardcoded — should be configurable
5. **No pagination** — only fetches latest 100 executions

## Refactoring Rules

1. **Add Firestore `where` filter** when `workflowId` is provided
2. **Use `executionConverter`** from converters for typed results
3. **Add `limit` option** parameter with default of 100
4. **Add pagination** with cursor-based loading
5. **Add `enabled: !!user`** guard (already present)

## Dependencies

- `@tanstack/react-query`, `firebase/firestore`
- `../lib/firebase`, `./useAuth`, `../lib/converters`
- Used by: `../pages/Dashboard`

## Verification

- `npm run lint`
- `npm run typecheck`
- Verify executions query returns typed data
- Test filtering by workflowId
