# Electron Engine Refactor Rules

Files: `electron/main/engine/runner.ts`, `electron/main/engine/queue.ts`, `electron/main/engine/scheduler.ts`, `electron/main/engine/retry.ts`, `electron/main/engine/types.ts`, `electron/main/engine/events.ts`

## Standards Violated

### 1 — General Principles (readability, component size)

- **Specific issues:**
  - `runner.ts` — 233 lines; `runLoop` method handles loop logic, execution, and event emission
  - `runner.ts:136-205` — `executePrompt` is 69 lines handling provider lookup, streaming, retries, and event emission
- **Fix:** Extract `executePrompt` into smaller focused methods; separate event emission from execution logic
- **Priority:** High

### 4 — State Management

- **Specific issues:**
  - `runner.ts:9-16` — Class-based state with manual `state: RunnerState` transitions; abort logic mixed with execution
- **Fix:** Consider extracting state machine or using a simpler enum-based dispatcher
- **Priority:** Low

### 6 — TypeScript Standards

- **Specific issues:**
  - `retry.ts:18` — `as { statusCode: number }` unsafe cast on error objects
  - `retry.ts:34` — `as Record<string, unknown>` pattern for extracting `retryAfter`
  - `runner.ts:197` — `error instanceof Error ? ... : String(error)` repeated cast pattern
- **Fix:** Use proper type guards (`hasStatusCode`, `hasRetryAfter`) instead of raw `as`
- **Priority:** Medium

### 10 — API & Data Fetching

- **Specific issues:**
  - `runner.ts:136-205` — Provider execution, streaming, and event emission all in one method
- **Fix:** Separate concerns: provider interaction, stream accumulation, and event dispatch
- **Priority:** Medium

### 17 — Code Smells to Eliminate

- **Specific issues:**
  - `scheduler.ts:7-14` — Stub class with TODO comments and `console.warn` (dead code)
  - `runner.ts:218-231` — `evaluateLoop` switch with nested `if` in `default` returning false
  - `retry.ts:152-153` — Magic number `0.5` jitter multiplier in exponential backoff
- **Fix:** Implement scheduler or remove; extract backoff config to constants; simplify loop evaluation
- **Priority:** Medium

### 18 — Documentation

- **Specific issues:**
  - `scheduler.ts:1-6` — Large TODO block describing planned behavior (should be in issue tracker)
- **Fix:** Move planned behavior to issues; keep code self-documenting
- **Priority:** Low
