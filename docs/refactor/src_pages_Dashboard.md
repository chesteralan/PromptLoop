# Refactoring Rules: `src/pages/Dashboard.tsx`

## Purpose

Main dashboard page showing workflow statistics, workflow list, and quick actions.

## Current Issues

1. **`ExecItem` type** defined as `Record<string, unknown>` at line 21 — defeats TypeScript safety. Use the actual `ExecutionData` type from converters
2. **`executions as ExecItem[]`** casts the query results — should type `useExecutions` properly instead of casting
3. **`stats` array** computes derived values inline — extract to `useMemo` for performance
4. **`successRate`** color logic is duplicated in `color` and `bg` — extract to a helper function
5. **`handleDelete`** calls `deleteWorkflow.mutateAsync` then sets `deletingId = null` — but `deletingId` is already set in the `finally` block; could simplify
6. **Empty state SVG** uses hardcoded `size-12 text-muted-foreground/50` — extract to shared empty state component
7. **`workflows?.filter(w => w.status === 'running')`** — `w.status` is `WorkflowStatus` but comparison to `'running'` is fine
8. **`executions` filter** checks `e.status === 'failed'` and `typeof e.createdAt === 'string'` — with proper typing this cast is unnecessary

## Refactoring Rules

1. **Remove `ExecItem` type and cast** — type `useExecutions` properly with converter
2. **Wrap stats computation** in `useMemo`
3. **Extract color/bg logic** to a helper function for success rate visualization
4. **Simplify `handleDelete`** — remove redundant `finally` block (single `setDeletingId(null)` after try/catch)
5. **Use `EmptyState` component** for the "no workflows" empty state instead of inline JSX
6. **Fix `useExecutions`** to accept `workflowId` filter properly (currently ignores it)

## Dependencies

- `../hooks/useWorkflows`, `../hooks/useExecutions`
- `../components/ui/*`, `../components/shared/*`, `../components/workflow/WorkflowCard`
- `lucide-react`, `sonner`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test dashboard loads with workflows
- Test empty state renders when no workflows
- Test stat calculations
