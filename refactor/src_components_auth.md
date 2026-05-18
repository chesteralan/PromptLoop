# Refactoring Rules: `src/components/auth/`

## Purpose

Provides authentication context provider (AuthProvider) and sign-in buttons (OAuthButtons) for Google and GitHub OAuth flows.

## Current Issues

### AuthProvider.tsx

- `getRedirectResult` call in `useEffect` fires on mount unconditionally but catches silently — should check if redirect result exists
- `ensureUserDocument` runs on every auth state change, not just first login
- `signInWithGoogle` / `signInWithGitHub` duplicate identical logic; extract provider factory
- `isElectron` check uses `typeof window !== 'undefined'` which is always true in browser; simplify to `'electronAPI' in window`
- `onAuthStateChanged` callback is `async` but returns `void` — unsubscribe function may not work correctly if the callback throws
- `useSettingsStore.getState().setUser(user)` called in `onAuthStateChanged` but settings store persists `user` to localStorage — this leaks auth state to storage
- No `useCallback` on `signInWithGoogle` / `signInWithGitHub` / `signOut` — causes context value to change on every render
- `eslint-disable react-refresh/only-export-components` is a workaround; split `useAuth` hook into separate file

### OAuthButtons.tsx

- SVG icons inline rather than using `lucide-react` or imported SVG assets — increases bundle size
- No `aria-label` on buttons (screen readers will read "Sign in with Google" correctly, but loading state lacks description)
- Button text should use `aria-busy` when loading

## Refactoring Rules

1. **Extract provider factory** from duplicated `signInWith*` methods
2. **Move `useAuth` hook** to `hooks/useAuth.ts` (already exists as re-export) and remove `eslint-disable` comment
3. **Add `useCallback`** to all context methods to prevent unnecessary re-renders
4. **Do not persist `user`** in settings store; remove `setUser` call from `onAuthStateChanged`
5. **Avoid `async` in `onAuthStateChanged`** callback — handle inner errors with `.catch()`
6. **Replace inline SVGs** in `OAuthButtons.tsx` with imported icon components or a shared SVG sprite
7. **Add `aria-busy`** to buttons when loading
8. **Memoize `AuthContextValue`** with `useMemo`

## Dependencies

- Both: `../ui/button`, `../../lib/firebase`
- `AuthProvider.tsx`: `firebase/auth`, `firebase/firestore`, `../../store/settingsStore`
- `OAuthButtons.tsx`: `../ui/button`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test Google/GitHub sign-in flow in both Electron and browser
- Verify `useAuth()` throws outside provider
