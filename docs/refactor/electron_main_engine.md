# Refactoring Rules: `electron/main/engine/`

## Purpose

Provides the workflow execution engine (runner, queue, retry, scheduler, events, types) responsible for running prompts through AI providers.

## Current Issues

### types.ts

- Clean; well-typed with `ExecutionEventMap` discriminated by channel name
- `PromptConfig.maxTokens` and `PromptConfig.temperature` are optional but runner always provides defaults — types should reflect default values

### queue.ts

- `QueueManager` duplicates built-in Array methods (`enqueue` = `push`, `dequeue` = `shift`, `peek` = `[0]`, `getAll` = `[...items]`) — consider using Array directly or a more sophisticated queue
- `isProcessing` flag is redundant with runner state; can be removed
- `length` getter and `processing` getter are fine but `setProcessing` exposes internal state

### retry.ts

- `ErrorClassification` interface marks `recoverable` and `retryable` as separate booleans but they're always correlated (`rate_limit`: recoverable=true, retryable=true; `auth`: recoverable=true, retryable=false; `unknown`: recoverable=false, retryable=true) — confusing semantics
- `getRetryAfter()` accesses `(error as Record<string, unknown>)['retryAfter']` with unsafe index access — should use a proper error type or branded error classes
- `executeWithRetry` uses `options` object but also accepts `maxRetries` as a separate parameter — redundant; use options object only
- `backoffMs` adds `Math.random() * 1000` jitter but this is added _after_ the exponential backoff, not as proper jitter (should be percentage-based per best practices)
- Error message matching (`message.includes('openai')`, etc.) is fragile — should use error code or status-based classification
- `Throw new Error('All retries exhausted')` should include original error information for debugging

### runner.ts

- `WorkflowRunner` class is stateful and manages its own `AbortController` — good pattern
- `runLoop()` method is complex (nested loops, state checks, event emissions) — extract sub-methods
- `evaluateLoop` calls `sendWorkflowCompleted` inside `runLoop` but `sendWorkflowCompleted` triggers desktop notifications — this couples execution logic with UI
- `executePrompt` uses `executeWithRetry` with hardcoded `2` retries — make configurable
- `delay()` method creates a new `AbortSignal` listener each call but never removes it (uses `{ once: true }` which auto-removes — correct)
- `abortController.signal.aborted` checked multiple times in `runLoop` — could consolidate into a guard method
- `this.state` is checked with loose inequality (`!== 'running'`) after each await point — correct pattern but verbose

### scheduler.ts

- Stub implementation with empty `start()`/`stop()` — either implement or add/TODO with planned behavior

### events.ts

- `emit()` sends to all `BrowserWindow` instances — correct
- No async error handling (synchronous, fine)
- Consider adding a `win.webContents.isDestroyed()` check before `send()` (already done)

## Refactoring Rules

1. **Simplify `ErrorClassification`** — replace `recoverable`/`retryable` with a single `action: 'retry' | 'stop' | 'skip'` field
2. **Fix jitter calculation** in `retry.ts` to use percentage-based jitter (`base * 2^attempt * (1 + random * 0.5)`)
3. **Extract `sendWorkflowCompleted`/`sendWorkflowFailed`** out of runner into a separate notification service that listens to events
4. **Replace `QueueManager`** with a simpler `Array<PromptConfig>` wrapper or use `fastq` library
5. **Consolidate `retry` function signature** — use options object `{ maxRetries, baseDelayMs, maxDelayMs }` only
6. **Add `error` cause to retry exhaustion** — `throw new Error('All retries exhausted', { cause: originalError })`
7. **Add proper error classes** — create `ProviderError`, `RateLimitError`, `AuthError` for type-safe error handling
8. **Implement or remove scheduler** stub; document planned behavior if keeping
9. **Add configurable retry count** to `WorkflowRunner` instead of hardcoded `2`
10. **Extract loop guard check** `if (this.state !== 'running' || this.abortController.signal.aborted)` into a method

## Dependencies

- `types.ts`: related to `../../shared/types` (`LoopMode`)
- `queue.ts`: `./types`
- `retry.ts`: standalone
- `runner.ts`: `../providers/factory`, `./queue`, `./events`, `./retry`, `../notifications`
- `events.ts`: `electron`, `./types`
- `scheduler.ts`: standalone (stub)
- Used by: `../ipc/workflow.ts`

## Verification

- `npm run typecheck` (electron)
- Unit tests for `retry.ts` (`classifyError`, `executeWithRetry`)
- Unit tests for `QueueManager`
- Integration test: runner executes prompts through mocked providers
- Verify `emit()` sends events to all windows
