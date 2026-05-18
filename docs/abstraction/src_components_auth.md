# Abstraction Rules: Auth Components

**Files:** `src/components/auth/AuthProvider.tsx`, `OAuthButtons.tsx`

---

## `src/components/auth/AuthProvider.tsx`

### Current Layer Mix

- React context creation, Firebase `onAuthStateChanged` listener, Firestore user document CRUD, Electron detection, OAuth provider creation, and sign-in/sign-out methods all in one file.
- Business logic (`ensureUserDocument`, `createSignInProvider`, `signInWithProvider`) mixed with React state (`useState`, `useEffect`, `useCallback`).

### Extraction Opportunities

- Extract `ensureUserDocument` into `src/lib/user-service.ts` — pure Firestore data access.
- Extract `createSignInProvider` / `signInWithProvider` into `src/lib/auth-service.ts` — authentication business logic.
- Extract Electron detection (`isElectron`) into a shared `src/lib/env.ts` utility.
- Extract `AuthContextValue` interface into `src/lib/auth-types.ts`.

### Interface Suggestions

- `UserService` interface: `ensureUserDocument(user: User): Promise<void>`.
- `AuthService` interface: `signInWithProvider(name): Promise<void>`, `signOut(): Promise<void>`, `onAuthStateChanged(cb): () => void`.

### Dependency Direction

- ✅ Depends on `firebase/auth`, `firebase/firestore`, and `src/lib/firebase` — correct.
- ⚠️ `AuthProvider` creates context AND manages auth state — could split into `AuthProvider` (context wrapper) and `useAuthState` (hook).

### Duplication

- `isElectron` check duplicated in `AddApiKeyDialog` and `SettingsPage` — centralize.
- `serverTimestamp()` call for `lastLoginAt` repeated in both branches of `ensureUserDocument`.

### Constants/Magic Values

- `'users'` (Firestore collection), `'google'`, `'github'`, `500`, `700` (auth window dimensions in `isElectron` branch).

---

## `src/components/auth/OAuthButtons.tsx`

### Current Layer Mix

- Pure presentational component — well-separated. Inline SVG icons mixed with button rendering.

### Extraction Opportunities

- Extract Google/GitHub SVG icons into separate icon components or a shared `icons.tsx` file.
- Button props (variant, className) repeated — could use a factory pattern.

### Interface Suggestions

- `OAuthButtonsProps` is clean. Consider adding an `onError?: (error: Error) => void` callback.

### Dependency Direction

- ✅ Only depends on `../ui/button` — correct.

### Duplication

- Button layout pattern (icon + text, `variant="outline"`, `className="w-full gap-2"`) repeated — could extract into a shared `OAuthButton` component.
- SVG path data duplicated inline — consider importing as assets.

### Constants/Magic Values

- `'Sign in with Google'`, `'Sign in with GitHub'`, SVG path data.
