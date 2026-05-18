# Refactoring Rules: `src/pages/ExecutionViewer.tsx`

## Purpose

Execution viewer page showing real-time workflow execution progress, streaming output, queue status, and execution history.

## Current Issues

1. **`promptStatuses` state** is managed locally but never updated by IPC events — the progress bar always shows "pending" for all prompts
2. **`handleStart`** constructs `PromptConfig[]` from prompt data but `PromptConfig` has optional fields that need defaults — most defaults provided but `temperature` and `maxTokens` could be undefined
3. **Hardcoded IPC workflow invocation** passes `prompts` array but `workflow:start` handler expects `config` with `WorkflowConfig` shape — the `startWorkflow` call passes flat params alongside config object
4. **`useExecutionListener`** (`useIpc.ts`) sets up listeners but never updates local state like `promptStatuses` or `currentPromptIndex`
5. **`handleRetry`** calls `control.retryWorkflow` which (in `workflow.ts` IPC handler) only calls `runner.stop()` and deletes the runner — it doesn't restart
6. **`loading` state** is managed manually instead of deriving from execution store
7. **Recent logs show truncated `promptId`** (`promptId.slice(0, 8)`) — this is unhelpful; should show prompt title
8. **No connection status indicator** — if renderer loses IPC connection, user won't know
9. **`Clear` button** in logs section calls `setExecutionStatus('idle')` which doesn't clear logs — it resets execution status

## Refactoring Rules

1. **Connect `promptStatuses` to IPC events** — update on `execution:started`, `execution:completed`, `execution:failed`
2. **Fix `handleStart`** — match the IPC handler's expected payload shape (`{ workflowId, config, apiKeys }`)
3. **Add prompt title to log entries** instead of truncated hash
4. **Derive `loading` from execution store** rather than local state
5. **Fix `Clear` button** to actually clear logs via store action
6. **Add connection status indicator** (heartbeat or periodic check)
7. **Show `loopIteration`** in progress UI
8. **Memoize computed values** (`enabledPrompts`, `progressItems`, `runningPromptId`)

## Dependencies

- `../hooks/useWorkflows`, `../hooks/usePrompts`, `../store/executionStore`, `../hooks/useIpc`
- `../components/shared/*`, `../components/execution/*`, `../components/workflow/*`
- `../../electron/main/engine/types` (creates renderer/main coupling — fix by redefining type in shared)
- `lucide-react`, `react-router-dom`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test execution start → streaming text appears → completion
- Test pause/resume
- Test error handling
- Test log display and clearing
