# Refactoring Rules: `src/routes.tsx`

## Purpose

Defines the application routing structure using `createHashRouter` for Electron compatibility.

## Current Issues

1. **`createHashRouter`** is used (correct for Electron) but there's no fallback for browser-only dev mode
2. **`path: '/'`** has `children` with `index: true` pointing to `DashboardPage` but `/login` and `/onboarding` are separate root routes outside `AppLayout` — correct structure
3. **Catch-all route** `'*'` maps to `DashboardPage` — if a user navigates to an unknown route while unauthenticated, they'll hit `ProtectedRoute` which redirects to `/login`. This is correct but the catch-all should be a 404 page instead
4. **No route-level code splitting** — all pages are eagerly imported

## Refactoring Rules

1. **Add lazy loading** with `React.lazy()` and `Suspense` for page components
2. **Add a shared `NotFoundPage`** (or use a simple redirect) instead of mapping `'*'` to Dashboard
3. **Add route data** with titles for document head
4. **Consider `createBrowserRouter`** fallback when not in Electron
5. **Extract route configuration** into a typed array for easier maintenance

## Dependencies

- `react-router-dom`
- All page components

## Verification

- `npm run lint`
- `npm run typecheck`
- Test all routes load correct components
- Test unknown route shows fallback
