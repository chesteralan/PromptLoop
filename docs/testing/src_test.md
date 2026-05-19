# Test Infrastructure — Testing Rules

## 1. `setup.ts`

- **Test type:** Configuration
- **Key scenarios:**
  - Imports `@testing-library/jest-dom` to register custom matchers (`toBeInTheDocument`, etc.)
- **Coverage targets:** N/A (setup only)
- **Suggested test file location:** _(this is the setup file itself)_

## 2. `example.test.ts`

- **Test type:** Sanity
- **Key scenarios:**
  - Verifies test runner works: `expect(1 + 1).toBe(2)`
- **Coverage targets:** N/A (sanity check)
- **Suggested test file location:** _(this is the example test)_

## 3. `auth.test.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - `AuthProvider` with `onAuthStateChanged` mock: loading → unauthenticated → authenticated flow
  - `mockOnAuthStateChanged` returns unsubscribe function
  - Firebase module mocks for `firebase/app`, `firebase/auth`, `firebase/firestore`, `../../lib/firebase`
  - `TestConsumer` renders different text based on auth state
  - `renderWithProviders` wraps in `MemoryRouter`
- **Coverage targets:** Loading, authenticated, unauthenticated states
- **Suggested test file location:** `auth.test.tsx` _(existing file)_

## 4. `routes.test.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - `ProtectedRoute` with `MemoryRouter` and `Routes`
  - Unauthenticated user redirected to login
  - Authenticated user sees dashboard
  - Authenticated user on `/login` sees redirect
- **Coverage targets:** 3 routing scenarios (unauth→login, auth→dashboard, auth→login→redirect)
- **Suggested test file location:** `routes.test.tsx` _(existing file)_

## 5. `stores.test.ts`

- **Test type:** Unit
- **Key scenarios:**
  - executionStore: all actions tested (setActiveWorkflow, setExecutionStatus, appendResponseChunk, clearResponse, addLog cap at 100)
  - workflowStore: all actions tested (setWorkflows, addWorkflow, updateWorkflow, removeWorkflow, setActiveWorkflow)
  - settingsStore: all actions tested (setTheme, setWindowMode, toggleMinimizeToTray, toggleNotifications, setStartOnBoot, setUser, clearUser)
  - Each store resets state in `beforeEach`
- **Coverage targets:** All store actions; log cap boundary condition
- **Suggested test file location:** `stores.test.ts` _(existing file)_

---

---

## Global Rules

### Test file placement

All test files must be placed in a `__tests__` directory within the same folder as the source file:

- `src/components/auth/AuthProvider.tsx` → `src/components/auth/__tests__/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/hooks/__tests__/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `electron/main/__tests__/encryption.test.ts`

### `vi.mock` paths must use `@/` aliases

Because `vitest.config.ts` defines a `resolve.alias` mapping `@` → `src/`, relative-path mocks like `vi.mock('../ui/button')` will **not** intercept imports correctly. The alias causes vitest to create a separate module entry for the resolved path, so the mock never applies to the source's import.

**Always use the `@/` alias in `vi.mock` paths:**

```ts
// ❌ WRONG — relative path (will not intercept the source's import)
vi.mock('../ui/button', () => ({ Button: ... }))
vi.mock('../../hooks/useAuth', () => ({ useAuth: ... }))

// ✅ CORRECT — @/ alias path
vi.mock('@/components/ui/button', () => ({ Button: ... }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: ... }))
```

This applies to any mock targeting a module inside `src/`. External npm packages (e.g., `@hello-pangea/dnd`, `sonner`, `@base-ui/react/*`) are unaffected — use their normal package names.
