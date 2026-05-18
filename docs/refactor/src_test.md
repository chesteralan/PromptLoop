# Refactoring Rules: `src/test/`

## Purpose

Contains Vitest test files for auth, stores, routes, and a basic example.

## Current Issues

### auth.test.tsx

- Mocks for `firebase/app`, `firebase/auth`, `firebase/firestore`, and `../../lib/firebase` are set up correctly
- `mockOnAuthStateChanged` uses `vi.fn()` but `onAuthStateChanged` returns an unsubscribe function — the mock returns `vi.fn()` which is correct
- Missing mock for `doc`, `getDoc`, `setDoc`, `serverTimestamp` from `firebase/firestore` — current tests don't trigger `ensureUserDocument` but it could break silently
- `renderWithProviders` wraps in `MemoryRouter` but `AuthProvider` doesn't use routing — unnecessary wrapper

### example.test.ts

- Trivial sanity check — remove once real tests exist

### routes.test.tsx

- Mocks same as auth.test.tsx — should share via `setup.ts`
- `LoginPage` component redefined locally instead of importing the real one — duplicates behavior
- Tests only cover `ProtectedRoute` and login redirection; missing route param tests

### setup.ts

- Only imports `@testing-library/jest-dom` — could add global mocks for `window.electronAPI`, `import.meta.env`
- Missing `vitest` global setup for `electronAPI` mock

### stores.test.ts

- Good test coverage for all three stores
- `settingsStore` test uses `// eslint-disable-next-line @typescript-eslint/no-explicit-any` — should use proper type cast instead
- `mockUser` in settings store test is typed as `any` — define a proper `Partial<User>` mock

## Refactoring Rules

1. **Extract shared mocks** into `src/test/setup.ts` to avoid duplication between `auth.test.tsx` and `routes.test.tsx`
2. **Remove unused `MemoryRouter`** wrapper from `auth.test.tsx`
3. **Replace `// eslint-disable-next-line @typescript-eslint/no-explicit-any`** with proper type definition for mock user
4. **Add `window.electronAPI` mock** to `setup.ts` globally
5. **Add mock for `import.meta.env`** for tests that depend on env vars
6. **Remove `example.test.ts`** once other tests provide sufficient coverage
7. **Add missing Firestore mocks** (`doc`, `getDoc`, `setDoc`) to prevent runtime errors if tests expand
8. **Use real `LoginPage` import** in `routes.test.tsx` instead of redefining locally

## Dependencies

- `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
- `auth.test.tsx`: `../components/auth/AuthProvider`
- `routes.test.tsx`: `../../components/layout/ProtectedRoute`, `../../components/auth/AuthProvider`
- `stores.test.ts`: `../../store/*`

## Verification

- `npx vitest run` — all tests pass
- No console errors during test runs
- Coverage reports show meaningful coverage
