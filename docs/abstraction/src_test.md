# Abstraction Rules: Tests

**Files:** `src/test/stores.test.ts`, `example.test.ts`, `setup.ts`, `routes.test.tsx`, `auth.test.tsx`

---

## `src/test/stores.test.ts`

### Current Layer Mix

- Pure unit tests for all 3 Zustand stores — well-structured.

### Extraction Opportunities

- Extract repeated store reset logic into a `beforeEach` helper.
- The mock data (`{ id: '1', name: 'Test', status: 'idle', createdAt: '', updatedAt: '' }`) is duplicated — extract a `createMockWorkflow(overrides)` factory.

### Interface Suggestions

- Test helpers could follow a factory pattern for creating mock entities.

### Dependency Direction

- ✅ Tests real stores directly — correct.

### Duplication

- `useXxxStore.setState({ ... })` reset called in every `describe` — could extract `resetStores()` utility.
- Workflow mock object repeated 4+ times.

### Constants/Magic Values

- `'wf-1'`, `'p-1'`, `100`, `50`, `105`, `'Hello '`, `'World'`.

---

## `src/test/example.test.ts`

### Current Layer Mix

- Sanity check test — minimal.

### Extraction Opportunities

- None needed.

### Interface Suggestions

- N/A.

### Dependency Direction

- ✅ Zero dependencies.

### Duplication

- N/A.

### Constants/Magic Values

- `1 + 1` sanity check.

---

## `src/test/setup.ts`

### Current Layer Mix

- Single import of `@testing-library/jest-dom` for DOM matchers — correctly placed in setup.

### Extraction Opportunities

- Could add global mocks here (e.g., `window.electronAPI`, `crypto.randomUUID`).

### Interface Suggestions

- N/A.

### Dependency Direction

- ✅ Zero project dependencies.

### Duplication

- N/A.

### Constants/Magic Values

- None.

---

## `src/test/routes.test.tsx`

### Current Layer Mix

- `ProtectedRoute` integration tests with mocked Firebase auth — well-structured.

### Extraction Opportunities

- Extract the complex `mockOnAuthStateChanged` setup into a shared test helper (`src/test/helpers/auth.ts`).
- Extract the mock factories for Firebase modules into `src/test/mocks/firebase.ts`.
- Extract `renderWithRouter` into a shared test utility `src/test/test-utils.tsx`.

### Interface Suggestions

- `AuthStateMock` helper: `simulateAuthenticated(user)`, `simulateUnauthenticated()`, `simulateLoading()`.

### Dependency Direction

- ✅ Tests components via `AuthProvider` and `ProtectedRoute` — correct integration test pattern.

### Duplication

- Firebase mock setup (`vi.mock('firebase/auth')`, `vi.mock('firebase/firestore')`, etc.) **completely duplicated** in `routes.test.tsx` and `auth.test.tsx`.
- `mockOnAuthStateChanged` pattern duplicated.
- `AuthProvider` mock setup duplicated.
- `import { describe, it, expect, vi, beforeEach }` imports duplicated.

### Constants/Magic Values

- `'123'` (mock uid), `'test@example.com'`, `'/dashboard'`, `'/login'`, `'login-page'`, `'dashboard'`, `'login-redirected'`, `'not-found'`.

---

## `src/test/auth.test.tsx`

### Current Layer Mix

- `AuthProvider` unit tests — well-structured.

### Extraction Opportunities

- **High overlap with `routes.test.tsx`.** Both files mock identical Firebase modules with identical `vi.mock` calls.
- Extract all shared test infrastructure into `src/test/test-utils.tsx` and `src/test/mocks/`.

### Interface Suggestions

- `renderWithAuth(ui, options)` helper that wraps with `AuthProvider` and optional user state.

### Dependency Direction

- ✅ Tests `AuthProvider` and `useAuth` — correct.

### Duplication

- **~90% duplication with `routes.test.tsx`:** Firebase mocks, `mockOnAuthStateChanged`, provider setup all identical.
- `import { describe, it, expect, vi, beforeEach }` duplicated.

### Constants/Magic Values

- `'auth-state'` (test ID), `'loading'`, `'authenticated'`, `'unauthenticated'`, `'123'`, `'test@example.com'`.
