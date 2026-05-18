# Refactoring Rules: `src/pages/Login.tsx`

## Purpose

Login page that redirects authenticated users to /dashboard and presents Google/GitHub OAuth buttons.

## Current Issues

1. **`useEffect` redirect** causes a flash of the login page before redirect — correct use of `replace: true` mitigates this
2. **`loading` and `user` destructured** from `useAuth` but only `user` is used in effect dependency — `loading` is included but doesn't affect redirect
3. **No error handling** for OAuth failures — the sign-in methods throw but there's no catch/toast
4. **`CardDescription`** hardcodes "Sign in to continue" — could be more descriptive

## Refactoring Rules

1. **Add error handling** to OAuth sign-in with toast notification
2. **Remove `loading` from JSX** when `user` is already available (show spinner only during initial load)
3. **Add `aria-label`** to the card for screen readers
4. **Extract spinner** as shared component (duplicated across pages)

## Dependencies

- `../hooks/useAuth`
- `../components/auth/OAuthButtons`
- `../components/ui/card`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test: unauthenticated user sees login page
- Test: authenticated user is redirected to /dashboard
