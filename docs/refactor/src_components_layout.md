# Layout Components Refactor Rules

Files: `src/components/layout/Sidebar.tsx`, `src/components/layout/AppLayout.tsx`, `src/components/layout/ProtectedRoute.tsx`, `src/components/layout/StatusBar.tsx`

## Standards Violated

### 4 — State Management

- **Specific issues:**
  - `AppLayout.tsx:16-29` — `useEffect` for boot-time navigation (onboarding check) mixes data fetching with routing side effects
  - `AppLayout.tsx:13` — `sidebarCollapsed` is local state (good), but the layout triggers navigation in an effect
- **Fix:** Move onboarding check to a dedicated hook (`useOnboardingRedirect`) or handle in route guards
- **Priority:** Medium

### 11 — Error Handling (silent failures)

- **Specific issues:**
  - `AppLayout.tsx:27` — `.catch((err) => console.warn(...))` — better than silent, but onboarding failures are invisible to user
  - `StatusBar.tsx:13` — `.catch(() => {})` — completely silent failure when getting app version
- **Fix:** Surface failures appropriately; at minimum add context to console.warn
- **Priority:** Medium

### 17 — Code Smells to Eliminate

- **Specific issues:**
  - `Sidebar.tsx:49-52` — `cycleTheme` uses `THEMES.indexOf(theme)` — mutates theme via index cycling (brittle)
  - `Sidebar.tsx:34-39` — `navItems` defined outside component, but the `icon` component references couple it to sidebar
  - `AppLayout.tsx:16-29` — `checking` state + useEffect for navigational redirect is an antipattern vs route-level guards
- **Fix:** Replace index-based theme cycling with an explicit `Record<Theme, Theme>` next map; use route-level guards instead of effect-based navigation
- **Priority:** Medium

### 14 — Accessibility

- **Specific issues:**
  - `Sidebar.tsx:112` — `DropdownMenuTrigger` has `cursor-default` but acts as a button
- **Fix:** Ensure keyboard navigation works for sidebar theme toggle and user menu
- **Priority:** Low
