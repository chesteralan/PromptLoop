# Abstraction Rules: Layout Components

**Files:** `src/components/layout/AppLayout.tsx`, `ProtectedRoute.tsx`, `Sidebar.tsx`, `StatusBar.tsx`

---

## `src/components/layout/AppLayout.tsx`

### Current Layer Mix

- Layout structure (sidebar + content + status bar) mixed with onboarding redirect logic and Firestore data access.
- `getDoc(doc(db, 'users', user.uid))` inline — data access mixed with UI.

### Extraction Opportunities

- Extract onboarding check into `useOnboardingRedirect()` hook.
- Extract the loading spinner into a shared `LoadingScreen` component.
- Extract sidebar collapse state management into `useSidebarState()` hook or zustand store slice.

### Interface Suggestions

- None critical — component is reasonably structured.

### Dependency Direction

- ⚠️ `AppLayout` directly accesses Firestore (`getDoc`) — should delegate to a `useOnboardingStatus(user)` hook.
- ✅ Uses `useAuth`, `Sidebar`, `StatusBar`, `ProtectedRoute` — correct composition.

### Duplication

- Loading spinner div (`animate-spin rounded-full border-4`) duplicated across `ProtectedRoute`, `AppLayout`, `OnboardingPage`, `LoginPage` — extract into component.

### Constants/Magic Values

- `'users'` collection name, `onboardingComplete` field name.

---

## `src/components/layout/ProtectedRoute.tsx`

### Current Layer Mix

- Simple guard component — well-separated.

### Extraction Opportunities

- Make the loading state configurable via prop (default to spinner).

### Interface Suggestions

- `ProtectedRouteProps` could include `fallback?: ReactNode` for custom loading state.

### Dependency Direction

- ✅ Depends only on `useAuth` and `react-router-dom`.

### Duplication

- Loading spinner identical to `AppLayout.tsx`.

### Constants/Magic Values

- `'/login'` redirect path.

---

## `src/components/layout/Sidebar.tsx`

### Current Layer Mix

- Navigation, theme toggling, user avatar/dropdown, sign-out logic, and collapse state all in one component.

### Extraction Opportunities

- Extract `NavItem` into `src/lib/navigation.ts` config.
- Extract theme cycling logic into `useThemeCycle()` hook.
- Extract user dropdown into `UserMenu` component.
- Extract collapse/expand toggle into `CollapseToggle` component.

### Interface Suggestions

- `ThemeCycler` interface: `cycleTheme(): void`, `currentTheme: Theme`, `ThemeIcon: LucideIcon`.
- `SidebarProps` is clean.

### Dependency Direction

- ✅ Depends on `useAuth`, `useSettingsStore`, UI components — correct.
- ⚠️ Direct `navigate('/login')` call in `handleSignOut` — could emit event instead.

### Duplication

- `navItems` array defines route/path/label/icon — duplicated intent with `routes.tsx`.
- Theme icon selection (`theme === 'dark' ? Moon : ...`) could be a lookup table.

### Constants/Magic Values

- `['light', 'dark', 'system']` (themes array), `'w-16'`/`'w-60'` (collapsed/expanded widths), `'Sign Out'`, `'PromptLoop'` (brand name).

---

## `src/components/layout/StatusBar.tsx`

### Current Layer Mix

- Status display mixed with `useExecutionStore` access and `electronAPI.getAppVersion()` fetch.

### Extraction Opportunities

- Extract `statusColors` into a shared config (`statusConfig.ts`).
- Extract app version fetching into `useAppVersion()` hook.
- The status color mapping duplicates `tray.ts` `STATUS_ICONS` colors — share in `electron/shared/types.ts`.

### Interface Suggestions

- `StatusBarProps` could accept `executionStatus` as prop instead of reading store directly — better testability.

### Dependency Direction

- ✅ Depends on `useExecutionStore` and `window.electronAPI` — acceptable for layout-level component.

### Duplication

- `statusColors` mapping duplicates `WorkflowStatusBadge`'s `statusConfig` and `tray.ts` color constants.

### Constants/Magic Values

- `'idle'`, `'running'`, `'paused'`, `'completed'`, `'stopped'`, `'error'` (status strings and their color classes), `'text-muted-foreground'` fallback.
