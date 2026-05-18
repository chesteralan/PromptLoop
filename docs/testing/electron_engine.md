# Electron Engine — Testing Rules

## 1. `electron/main/engine/types.ts`

- **Test type:** Unit (type-only)
- **Key scenarios:**
  - `PromptConfig` validates all optional fields (systemPrompt, temperature, maxTokens, delayMs)
  - `RunnerState` is one of `'idle' | 'running' | 'paused' | 'stopped' | 'completed' | 'error'`
  - `ExecutionEventMap` keys match the channels used in `events.ts`
- **Mocking requirements:** None (type definitions)
- **Coverage targets:** N/A
- **Suggested test file location:** `src/test/electron/main/engine/types.test.ts`

## 2. `electron/main/engine/events.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `emit()` sends event to all non-destroyed windows via `win.webContents.send(channel, data)`
  - Destroyed windows are skipped
  - Works with all `ExecutionEventMap` channels
- **Mocking requirements:** `BrowserWindow` from electron
- **Coverage targets:** All windows destroyed vs mixed; no windows at all
- **Suggested test file location:** `src/test/electron/main/engine/events.test.ts`

## 3. `electron/main/engine/queue.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `enqueue()` adds items in order
  - `dequeue()` removes and returns first item; returns `undefined` on empty queue
  - `clear()` empties all items
  - `peek()` returns first item without removal; returns `undefined` on empty
  - `length` reflects current item count
  - `getAll()` returns a shallow copy (mutating returned array doesn't affect internal state)
- **Mocking requirements:** None
- **Coverage targets:** Empty state, single item, multiple items
- **Suggested test file location:** `src/test/electron/main/engine/queue.test.ts`

## 4. `electron/main/engine/retry.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `classifyError()` correctly categorizes by status code (429, 401, 403, 500+) and message keywords ("rate limit", "api key", "timeout", "network", "econnrefused", "enotfound", "fetch failed")
  - `classifyError()` detects provider from message ("openai"/"OpenAI", "anthropic"/"Anthropic", "google"/"Google")
  - `classifyError()` returns `action: 'stop'` for auth errors; `action: 'retry'` for all others
  - Unknown errors return category `'unknown'` with action `'retry'`
  - `getErrorStatus()` extracts numeric status from error object's `statusCode` or `status` property
  - `getRetryAfter()` extracts `retryAfter` as number (seconds → ms) or string
  - `executeWithRetry()`: succeeds on first try; retries on failure; throws after max retries exhausted; throws immediately if classification action is `'stop'`; uses exponential backoff with jitter; respects `retryAfterMs` from classification; calls `onRetry` callback each retry
  - Default options: `maxRetries=3, baseDelayMs=1000, maxDelayMs=60000`
  - Backoff clamped to `maxDelayMs`
- **Mocking requirements:** None (pure functions/classes)
- **Coverage targets:** All error categories (7), stop vs retry action, jitter multiplication, backoff clamping, all retry exhaustion paths
- **Suggested test file location:** `src/test/electron/main/engine/retry.test.ts`

## 5. `electron/main/engine/scheduler.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `ScheduleWorker.start()` logs "not yet implemented" warning
  - `ScheduleWorker.stop()` logs "not yet implemented" warning
- **Mocking requirements:** None
- **Coverage targets:** N/A (placeholder)
- **Suggested test file location:** `src/test/electron/main/engine/scheduler.test.ts`

## 6. `electron/main/engine/runner.ts`

- **Test type:** Integration
- **Key scenarios:**
  - `constructor` sets config, apiKeys, maxRetries (default 3)
  - `get workflowId()` returns config.id
  - `getStatus()` returns current state, index, loop iteration
  - `start()`: no-op if not idle; clears queue; enqueues enabled prompts sorted by position; sets state to 'running'; calls `runLoop()`
  - `pause()`: no-op if not running; sets state to 'paused'
  - `resume()`: no-op if not paused; sets state to 'running'
  - `stop()`: sets state to 'stopped'; aborts controller; clears queue
  - `runLoop()`: processes queue in order; emits `execution:status` before each prompt; respects delay between prompts; evaluates loop condition after full pass
  - `executePrompt()`: gets provider adapter; validates API key exists; emits `execution:started`; runs streaming with `executeWithRetry`; accumulates chunks emitting `execution:chunk`; emits `execution:completed` on success; emits `execution:failed` on error
  - `evaluateLoop()`: returns false for `'single'`, `'scheduled'`, `'default'`; returns `loopIteration + 1 < maxIterations` for `'fixed'`; returns true for `'infinite'`
  - AbortController integration: streaming stops on abort; `delay()` resolves early on abort
  - Workflow completion: sets state to 'completed'; emits `workflow:completed`; sends system notification
  - Edge: empty enabled prompts causes immediate completion
  - Edge: all prompts disabled (none enqueued) — loop body never executes
- **Mocking requirements:** `getProviderAdapter`, `getProviderName` from factory; `QueueManager`; `emit` from events; `executeWithRetry` from retry; `sendWorkflowCompleted`, `sendWorkflowFailed` from notifications; `BrowserWindow` from electron
- **Coverage targets:** All state transitions (idle→running→paused→running→completed, idle→running→stopped); all loop modes (4); enabled/disabled prompt filtering; abort signal; delay with abort
- **Suggested test file location:** `src/test/electron/main/engine/runner.test.ts`
