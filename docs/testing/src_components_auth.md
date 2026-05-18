# Auth Components — Testing Rules

## 1. `src/components/auth/AuthProvider.tsx`

- **Test type:** Unit / Integration
- **Key scenarios:**
  - `AuthProvider` provides `AuthContext` with `user`, `loading`, `signInWithGoogle`, `signInWithGitHub`, `signOut`
  - On mount, subscribes to `onAuthStateChanged`; unsubscribes on unmount
  - On Electron (`isElectron`): calls `getRedirectResult` on mount
  - `onAuthStateChanged` callback: sets user; calls `ensureUserDocument` when user exists; sets `loading = false`
  - `ensureUserDocument()`: creates new Firestore doc if not exists (with name, email, photoURL, onboardingComplete=false); merges `lastLoginAt` if exists
  - `signInWithProvider()`: uses redirect for Electron, popup for browser
  - `signInWithGoogle`/`signInWithGitHub` are memoized callbacks
  - `signOut` calls `firebaseSignOut(auth)`
  - Context value is memoized
- **Mocking requirements:** `firebase/auth` (onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, GithubAuthProvider, signOut, browserPopupRedirectResolver); `firebase/firestore` (doc, getDoc, setDoc, serverTimestamp); `../../lib/firebase` (auth, db)
- **Coverage targets:** Electron vs browser path; user exists vs new user; getRedirectResult success vs failure; `ensureUserDocument` error caught silently
- **Suggested test file location:** `src/test/components/auth/AuthProvider.test.tsx`

## 2. `src/components/auth/OAuthButtons.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders Google and GitHub sign-in buttons
  - Both buttons call respective `onClick` handler
  - `isLoading` disables both buttons and sets `aria-busy` on container
  - Buttons have correct `aria-label` attributes
  - SVG icons rendered with `aria-hidden="true"`
- **Mocking requirements:** Button component from `../ui/button`
- **Coverage targets:** Loading vs not loading state
- **Suggested test file location:** `src/test/components/auth/OAuthButtons.test.tsx`
