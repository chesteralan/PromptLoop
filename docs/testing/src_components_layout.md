# Layout Components — Testing Rules

## 1. `src/components/layout/AppLayout.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - On mount when user exists: fetches user doc from Firestore; navigates to `/onboarding` if `onboardingComplete === false`
  - While fetching onboarding status: shows loading spinner
  - When no user: shows loading then renders children via `ProtectedRoute`
  - Renders `Sidebar`, `Outlet`, `StatusBar`
  - Sidebar collapse state toggles via `sidebarCollapsed`
  - Firestore fetch error caught with `console.warn` (no crash)
- **Mocking requirements:** `react-router-dom` (Outlet, useNavigate); `firebase/firestore` (doc, getDoc); `../../lib/firebase` (db); `../../hooks/useAuth`; Sidebar, StatusBar, ProtectedRoute components
- **Coverage targets:** Onboarding complete vs incomplete; user exists vs null; fetch success vs error
- **Suggested test file location:** `src/test/components/layout/AppLayout.test.tsx`

## 2. `src/components/layout/ProtectedRoute.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - When `loading` is true: renders spinner
  - When `user` is null: redirects to `/login` with `state.from` set to current location
  - When `user` exists: renders children
- **Mocking requirements:** `react-router-dom` (Navigate, useLocation); `../../hooks/useAuth`
- **Coverage targets:** All 3 states (loading, unauthenticated, authenticated)
- **Suggested test file location:** `src/test/components/layout/ProtectedRoute.test.tsx`

## 3. `src/components/layout/Sidebar.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders navigation items: Dashboard, New Workflow, Settings, API Keys
  - NavLink applies active/inactive classes correctly
  - Collapsed state: hides labels, applies `w-16` instead of `w-60`, centers icons
  - Toggle button shows `PanelLeft` or `PanelLeftClose` icon based on collapsed state
  - Theme button cycles through light → dark → system
  - User avatar shows photoURL or fallback initial
  - Dropdown menu shows user email and Sign Out option
  - Sign Out calls `signOut()` and navigates to `/login`
- **Mocking requirements:** `react-router-dom` (NavLink, useNavigate); `../../hooks/useAuth`; `../../store/settingsStore`; Avatar, Button, DropdownMenu components
- **Coverage targets:** Collapsed vs expanded; all 4 nav items; all 3 theme states; user with/without displayName; avatar with/without photoURL
- **Suggested test file location:** `src/test/components/layout/Sidebar.test.tsx`

## 4. `src/components/layout/StatusBar.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Shows execution status with colored circle indicator
  - Unknown status falls back to `text-muted-foreground`
  - Loads app version via `window.electronAPI.getAppVersion()` on mount
  - Shows version only when available (guarded rendering)
  - Status color mapping covers all 6 states (idle, running, paused, completed, stopped, error)
  - Error in getAppVersion is caught silently
- **Mocking requirements:** `../../store/executionStore`; `window.electronAPI.getAppVersion`
- **Coverage targets:** All 6 status colors; version loaded vs not loaded; electronAPI absent
- **Suggested test file location:** `src/test/components/layout/StatusBar.test.tsx`

---

## Global Rule

All test files must be placed under `src/test/`. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `src/test/components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/test/hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `src/test/electron/main/encryption.test.ts`

This keeps all tests colocated under a single `src/test/` root regardless of whether the source is in `src/` or `electron/`.
