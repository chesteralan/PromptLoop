# Test Files Refactor Rules

Files: `src/test/stores.test.ts`, `src/test/auth.test.tsx`, `src/test/routes.test.tsx`, `src/test/example.test.ts`, `src/test/setup.ts`

## Standards Violated

### 15 — Testing Standards

- **Specific issues:**
  - `example.test.ts:1-7` — Trivial sanity check (`1+1 === 2`). No real value; should be removed when real tests exist
  - `auth.test.tsx:33-42` — `TestConsumer` component duplicates production logic for test assertions — tests implementation details via `data-testid="auth-state"`
  - `routes.test.tsx:35-48` — Inline `LoginPage` and `DashboardPage` stub components duplicate routing behavior
- **Fix:** Remove `example.test.ts` once coverage is sufficient; test user-facing behavior (rendered content) rather than `data-testid` states where possible
- **Priority:** Low

### 11 — Error Handling

- **Specific issues:**
  - Tests don't cover error states: failed Firestore operations, IPC errors, network failures
- **Fix:** Add error-handling test cases for hooks and stores
- **Priority:** Medium

### What's done well

- `stores.test.ts` — Good coverage of all store actions with proper `beforeEach` state reset
- `auth.test.tsx` and `routes.test.tsx` — Proper Firebase mocking setup, testing loading/authenticated/unauthenticated states
- `setup.ts` — Clean, single import of `@testing-library/jest-dom`

### Coverage gaps

- No component tests for execution, workflow, settings, or shared components
- No hook tests (useAuth, useWorkflows, useAutoSave, etc.)
- No integration tests for user flows (login → dashboard → create workflow → execute)
