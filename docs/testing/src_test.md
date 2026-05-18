# Test Infrastructure — Testing Rules

## 1. `src/test/setup.ts`

- **Test type:** Configuration
- **Key scenarios:**
  - Imports `@testing-library/jest-dom` to register custom matchers (`toBeInTheDocument`, etc.)
- **Coverage targets:** N/A (setup only)
- **Suggested test file location:** _(this is the setup file itself)_

## 2. `src/test/example.test.ts`

- **Test type:** Sanity
- **Key scenarios:**
  - Verifies test runner works: `expect(1 + 1).toBe(2)`
- **Coverage targets:** N/A (sanity check)
- **Suggested test file location:** _(this is the example test)_

## 3. `src/test/auth.test.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - `AuthProvider` with `onAuthStateChanged` mock: loading → unauthenticated → authenticated flow
  - `mockOnAuthStateChanged` returns unsubscribe function
  - Firebase module mocks for `firebase/app`, `firebase/auth`, `firebase/firestore`, `../../lib/firebase`
  - `TestConsumer` renders different text based on auth state
  - `renderWithProviders` wraps in `MemoryRouter`
- **Coverage targets:** Loading, authenticated, unauthenticated states
- **Suggested test file location:** `src/test/auth.test.tsx` _(existing file)_

## 4. `src/test/routes.test.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - `ProtectedRoute` with `MemoryRouter` and `Routes`
  - Unauthenticated user redirected to login
  - Authenticated user sees dashboard
  - Authenticated user on `/login` sees redirect
- **Coverage targets:** 3 routing scenarios (unauth→login, auth→dashboard, auth→login→redirect)
- **Suggested test file location:** `src/test/routes.test.tsx` _(existing file)_

## 5. `src/test/stores.test.ts`

- **Test type:** Unit
- **Key scenarios:**
  - executionStore: all actions tested (setActiveWorkflow, setExecutionStatus, appendResponseChunk, clearResponse, addLog cap at 100)
  - workflowStore: all actions tested (setWorkflows, addWorkflow, updateWorkflow, removeWorkflow, setActiveWorkflow)
  - settingsStore: all actions tested (setTheme, setWindowMode, toggleMinimizeToTray, toggleNotifications, setStartOnBoot, setUser, clearUser)
  - Each store resets state in `beforeEach`
- **Coverage targets:** All store actions; log cap boundary condition
- **Suggested test file location:** `src/test/stores.test.ts` _(existing file)_

---

## Global Rule

All test files must be placed under `src/test/`. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `src/test/components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/test/hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `src/test/electron/main/encryption.test.ts`

This keeps all tests colocated under a single `src/test/` root regardless of whether the source is in `src/` or `electron/`.
