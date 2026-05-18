# Refactoring Rules: `src/pages/Onboarding.tsx`

## Purpose

Onboarding page for new users to set their display name and confirm completion before accessing the dashboard.

## Current Issues

1. **`name` state initialized** with `user?.displayName ?? ''` — fine, but `user` may not be loaded yet on first render
2. **`loaded` guard** prevents flash of unloaded form — good pattern
3. **Nested `useEffect` + `getDoc`** could race if user signs out while onboarding page is open
4. **No back navigation** — user cannot skip onboarding (intentional but could frustrate)
5. **`updateDoc`** only updates `name` and `onboardingComplete` — if user changes name on this page, it doesn't update Auth profile (Firebase Auth displayName stays unchanged)
6. **`getDoc` called** in the effect but result could be from Firestore cache — stale data

## Refactoring Rules

1. **Add `useEffect` cleanup** to abort pending Firestore reads when component unmounts
2. **Use `onSnapshot`** instead of `getDoc` for real-time user document
3. **Add loading state** to the "Get Started" button during save
4. **Consider auth profile update** via `updateProfile` to sync display name
5. **Add skip option** with confirmation dialog
6. **Extract loading spinner** to shared component

## Dependencies

- `../lib/firebase`, `../components/auth/AuthProvider`
- `../components/ui/*`, `lucide-react`, `sonner`, `react-router-dom`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test: new user sees onboarding
- Test: returning user redirected to dashboard
