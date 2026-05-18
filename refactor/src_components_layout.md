# Refactoring Rules: `src/components/layout/`

## Purpose

Provides application layout shell (AppLayout, ProtectedRoute, Sidebar, StatusBar) for authenticated routes.

## Current Issues

### AppLayout.tsx

- `getDoc` call in `useEffect` creates a loading flash before redirecting to onboarding — consider using `onSnapshot` or checking a Firestore cache
- `.catch(() => {})` swallows errors silently — at minimum log a warning
- `sidebarCollapsed` state is local and not persisted across navigation

### ProtectedRoute.tsx

- Clean for its purpose; minimal refactoring needed
- Could use `Navigate` `state` more explicitly with a `from` type guard

### Sidebar.tsx

- `const navItems` declared outside component — good, but `navigate` dependency in `handleSignOut` could cause stale closures
- `cycleTheme` function creates new array on every render; hoist `themes` constant
- No keyboard navigation support for sidebar links (`NavLink` handles this, but custom click targets may not)
- `collapse` transition uses arbitrary width values (`w-16`, `w-60`) instead of CSS variables

### StatusBar.tsx

- `executionStatus` from store could be undefined; `statusColor` lookup uses bracket notation which returns `undefined` gracefully but TypeScript may not infer
- `appVersion` is fetched on mount but not refreshed

## Refactoring Rules

1. **Add error logging** to `.catch(() => {})` in `AppLayout.tsx`
2. **Persist `sidebarCollapsed`** to zustand store or localStorage
3. **Extract `themes` array** to module-level constant in `Sidebar.tsx`
4. **Replace inline SVG icons** in sidebar with consistent `lucide-react` imports
5. **Handle undefined `executionStatus`** in `StatusBar.tsx` with a fallback
6. **Add `aria-current="page"`** to active `NavLink` (React Router already does this, but verify)
7. **Memoize `handleSignOut`** with `useCallback`

## Dependencies

- `AppLayout.tsx`: `react-router-dom`, `firebase/firestore`, `../auth/AuthProvider`, `./Sidebar`, `./StatusBar`, `./ProtectedRoute`
- `ProtectedRoute.tsx`: `react-router-dom`, `../auth/AuthProvider`
- `Sidebar.tsx`: `react-router-dom`, `lucide-react`, `../auth/AuthProvider`, `../../store/settingsStore`, `../ui/*`
- `StatusBar.tsx`: `lucide-react`, `../../store/executionStore`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test sidebar collapse toggle
- Verify protected route redirects to /login
