# Abstraction Rules: Electron Engine

**Files:** `electron/main/engine/runner.ts`, `queue.ts`, `retry.ts`, `scheduler.ts`, `events.ts`, `types.ts`

---

## `electron/main/engine/runner.ts`

### Current Layer Mix

- Workflow orchestration (loop logic) mixed with provider resolution, retry logic, event emission, and notification dispatch.
- `executePrompt` handles provider lookup, API key management, streaming, retry, and event emission in one method.

### Extraction Opportunities

- Extract `LoopController` class: `evaluateLoop()`, `shouldStop()`, `runLoop()` — separates loop orchestration from prompt execution.
- Extract `PromptExecutor` class: `executePrompt()` — handles provider streaming, chunk emission, completion/failure events.
- Extract `delay()` into a shared `async-utils.ts`.
- Extract provider/key lookup into `provider-resolver.ts`.

### Interface Suggestions

- `WorkflowRunner` interface: `start(): Promise<void>`, `pause(): void`, `resume(): void`, `stop(): void`, `getStatus(): RunnerStatus`.
- `LoopStrategy` interface: `shouldContinue(iteration, config): boolean` — replace the `evaluateLoop` switch.

### Dependency Direction

- ✅ `runner.ts` depends on `queue`, `retry`, `events`, `providers/factory`, `notifications` — all lower-level modules.
- ⚠️ Direct calls to `getProviderAdapter` / `getProviderName` couple runner to provider discovery — use dependency injection.

### Duplication

- `emit('execution:status', ...)` called in multiple places with similar payloads — could have helper `emitStatus(phase, ...)`.
- `this.abortController.signal.aborted` checked in both `shouldStop` and inline.
- Provider/API key null-check pattern repeated in `executePrompt`.

### Constants/Magic Values

- `maxRetries = 3` (constructor default), `'execution:status'`, `'execution:started'`, `'execution:chunk'`, `'execution:completed'`, `'execution:failed'`, `'workflow:completed'`.

---

## `electron/main/engine/queue.ts`

### Current Layer Mix

- Simple FIFO queue wrapping an array — clean but minimal.

### Extraction Opportunities

- Extract queue interface to allow priority queues or persisted queues.
- Add `enqueueBatch(items: PromptConfig[])` for bulk operations.

### Interface Suggestions

- `IQueue<T>` interface: `enqueue(item): void`, `dequeue(): T | undefined`, `peek(): T | undefined`, `clear(): void`, `get length(): number`, `getAll(): T[]`.

### Dependency Direction

- ✅ Low-level utility, depends only on `types`.

### Duplication

- None.

### Constants/Magic Values

- None.

---

## `electron/main/engine/retry.ts`

### Current Layer Mix

- Error classification (business logic), delay calculation (math), and retry execution loop all mixed.
- `classifyError` mixes provider detection (`isOpenAI`, `isAnthropic`, `isGoogle`) with error pattern matching.

### Extraction Opportunities

- Extract `error-classifier.ts`: pure function that maps error to `ErrorClassification`.
- Extract `backoff-calculator.ts`: `calculateBackoff(attempt, baseDelay, maxDelay): number`.
- Extract provider detection into `provider-matcher.ts` (reuse with factory matchers).

### Interface Suggestions

- `RetryStrategy` interface: `shouldRetry(attempt, classification): boolean`, `getDelay(attempt, classification): number`.
- `ErrorClassifier` interface: `classify(error): ErrorClassification`.

### Dependency Direction

- ✅ Self-contained pure utility — excellent isolation.

### Duplication

- `.toLowerCase().includes(...)` pattern repeated for every category.
- Provider name detection (`isOpenAI`/`isAnthropic`/`isGoogle`) repeated across `rate_limit` and `auth` branches — extract `detectProvider(message): string | null`.

### Constants/Magic Values

- `maxRetries = 3`, `baseDelayMs = 1000`, `maxDelayMs = 60000`, `'rate limit'`, `'api key'`, `'unauthorized'`, `'timeout'`, `'network'`, `'econnrefused'`, user-facing message strings.

---

## `electron/main/engine/scheduler.ts`

### Current Layer Mix

- Placeholder stub — no actual logic yet.

### Extraction Opportunities

- When implementing, separate into: `schedule-parser.ts` (cron/ISO parsing), `schedule-store.ts` (persistence), `schedule-worker.ts` (execution loop).

### Interface Suggestions

- `ScheduleWorker` interface: `start(): void`, `stop(): void`, `addSchedule(config): void`, `removeSchedule(id): void`.

### Dependency Direction

- ✅ No current dependencies.

### Duplication

- N/A.

### Constants/Magic Values

- N/A.

---

## `electron/main/engine/events.ts`

### Current Layer Mix

- Event emission coupled with `BrowserWindow` access — single function.

### Extraction Opportunities

- Extract event channel names into `event-channels.ts` as a const enum.
- Consider using a typed `EventBus` interface for testability.

### Interface Suggestions

- `EventBus` interface: `emit<T>(channel, data): void`, `on<T>(channel, handler): () => void`.
- The current `emit` only sends to all windows — could support other targets.

### Dependency Direction

- ✅ Minimal — depends only on `BrowserWindow` and `types`.

### Duplication

- None (small file).

### Constants/Magic Values

- None (channel names come from `ExecutionEventMap` keys).

---

## `electron/main/engine/types.ts`

### Current Layer Mix

- Pure type definitions — good.

### Extraction Opportunities

- Consider splitting `ExecutionEventMap` into its own file (`events-types.ts`).
- `PromptConfig` duplicates fields from `src/lib/converters.ts` `PromptData` — share or derive one from the other.

### Interface Suggestions

- `RunnerState` could be a branded type or enum.
- `ExecutionEventMap` is well-typed — consider making channels a const enum for type-safe references.

### Dependency Direction

- ✅ Pure types, no runtime dependencies.

### Duplication

- `PromptConfig` and `PromptData` (in `src/lib/converters.ts`) overlap heavily — consolidate.
- `RunnerState` duplicates `ExecStatus` in `src/store/executionStore.ts`.
