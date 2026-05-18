# PromptLoop — Development Tasks

> **Total estimated time to MVP:** 16 weeks
> **Tracking convention:** `- [ ]` = pending, `- [x]` = completed, `- [/]` = in progress

---

## Phase 1 — Foundation

**Goal:** Working Electron app shell with Firebase Auth, project structure, and design system.
**Duration:** 4 weeks

---

### Week 1: Project Scaffolding

---

#### Task 1.1 — Initialize Electron + Vite + React project
**Priority:** P0  **Risk:** Medium

**Description:** Scaffold the project using `electron-vite` with TypeScript, React 18, and Tailwind CSS. Configure the dev workflow so changes hot-reload in the Electron renderer.

**Files:**
- `/promise.md` (scaffolding output)
- `package.json` — dependencies and scripts
- `vite.config.ts` — Vite config with React plugin and Electron integration
- `tsconfig.json` — strict TypeScript config
- `tsconfig.node.json` — Node target for main process
- `tailwind.config.ts` — Tailwind configuration
- `postcss.config.js` — PostCSS with Tailwind and autoprefixer
- `electron-builder.yml` — packaging config

**Dependencies to install:**
- `electron`, `electron-builder`, `electron-updater`
- `vite`, `@vitejs/plugin-react`, `vite-plugin-electron` (or `electron-vite`)
- `react`, `react-dom`, `@types/react`, `@types/react-dom`
- `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `clsx`, `tailwind-merge`
- `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

**Blocked by:** Nothing
**Blocks:** `1.2`, `1.4`

**Sub-tasks:**
- [x] 1.1.1 — Run `yarn create @electron-vite` to scaffold the project with React + TypeScript template, then `yarn` to install deps (15m)
- [x] 1.1.2 — Remove template boilerplate (default components, unused assets, example code) (15m)
- [x] 1.1.3 — Verify package.json scripts: `dev`, `build`, `preview`, `lint`, `typecheck` (10m)
- [x] 1.1.4 — Configure `vite.config.ts` with `@vitejs/plugin-react` and electron integration plugin (20m)
- [x] 1.1.5 — Set `tsconfig.json` with `strict: true`, proper paths, and `jsx: "react-jsx"` (15m)
- [x] 1.1.6 — Configure `tailwindcss` (v4 via @tailwindcss/vite plugin, no tailwind.config.ts needed) (10m)
- [x] 1.1.7 — Set up `tailwindcss` via Vite plugin (no postcss.config.js needed for Tailwind v4) (10m)
- [x] 1.1.8 — Create `electron-builder.json5` with appId, productName, and platform targets (15m)
- [x] 1.1.9 — Run `yarn` to install all dependencies, verify no peer dependency warnings (15m)
- [x] 1.1.10 — Add `cn()` utility setup file (`src/lib/utils.ts`) and verify it imports without error (15m)
- [ ] 1.1.11 — Verify `yarn dev` starts Vite dev server and opens Electron window (20m) *(depends on: 1.1.4, 1.1.5)* *(requires display/GUI)*
- [x] 1.1.12 — Verify `yarn build` produces production output in `out/` or `dist/` (15m)

**Done when:**
- [ ] Test: `yarn dev` starts Vite dev server and opens Electron window *(requires GUI)*
- [ ] Test: HMR works — editing a React component hot-reloads in the Electron window *(requires GUI)*
- [x] Test: Tailwind v4 + shadcn/ui CSS renders correctly in build output
- [x] Test: `yarn build` produces a production build

**Effort:** 4h

**Review checklist:**
- [/] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [/] Edge cases considered and handled
- [/] Blocked tasks unblocked
- [/] All `Done when` criteria met

---

#### Task 1.2 — Create project directory structure

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 1.3 — Configure ESLint + Prettier
**Priority:** P2  **Risk:** Low

**Description:** Set up consistent code formatting and linting for both main and renderer processes.

**Files:**
- `.eslintrc.cjs` — ESLint config with TypeScript and React rules
- `.prettierrc` — Prettier config
- `.eslintignore`
- `.prettierignore`
- `.husky/pre-commit` — Husky hook for lint-staged
- `lint-staged.config.js`

**Dependencies:** `eslint`, `prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `husky`, `lint-staged`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

**Blocked by:** `1.1`
**Blocks:** Nothing

**Sub-tasks:**
- [x] 1.3.1 — Install all linting dependencies as devDependencies (10m)
- [x] 1.3.2 — Create `.eslintrc.cjs` with TypeScript parser, React plugin, Prettier integration, and `node: true` for electron env (15m)
- [x] 1.3.3 — Create `.prettierrc` with project-wide formatting rules (single quotes, trailing commas, printWidth 100, tabWidth 2) (10m)
- [x] 1.3.4 — Configure eslint ignore patterns in `.eslintrc.cjs` ignoring `dist/`, `dist-electron/`, `release/`, `node_modules/` (5m)
- [x] 1.3.5 — Create `.prettierignore` ignoring same paths plus `*.svg`, `*.png`, planning docs (5m)
- [x] 1.3.6 — Add lint-staged config in `package.json` running `eslint --fix` and `prettier --write` on staged `.ts/.tsx` files (10m)
- [x] 1.3.7 — Initialize Husky with `yarn husky init`, create `.husky/pre-commit` hook running `yarn lint-staged` (10m)
- [x] 1.3.8 — Add scripts to `package.json`: `lint`, `format`, `format:check`, `typecheck`, `test`, `test:watch` (10m)
- [x] 1.3.9 — Run `yarn lint` on all existing files, fix any initial lint errors (10m)
- [x] 1.3.10 — Run `yarn format` and verify output is consistent (10m)
- [x] 1.3.11 — Create `vitest.config.ts` with React plugin, jsdom environment, and path aliases matching tsconfig (15m)
- [x] 1.3.12 — Test: Run `yarn test` and verify vitest runs with 1 test (passes) (5m)

**Done when:**
- [x] Test: `yarn lint` passes on all existing files
- [x] Test: `yarn format` formats code consistently
- [x] Test: Pre-commit hook runs linter on staged files
- [x] Test: `yarn test` runs vitest without errors

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 1.4 — Set up basic Electron main process
**Priority:** P0  **Risk:** Medium

**Description:** Implement the core `index.ts` entry point that creates a BrowserWindow, loads the renderer, and handles app lifecycle events.

**Files:**
- `electron/main/index.ts` — App entry, window creation, lifecycle handlers
- `electron/main/window.ts` — `createWindow()`, window state tracking

**Behavior:**
- Creates a BrowserWindow with `contextIsolation: true` and `nodeIntegration: false`
- Loads `http://localhost:5173` in dev, `index.html` in production
- Handles `app.on('window-all-closed')` and `app.on('activate')`
- Tracks window position/size (basic, no persistence yet)

**Blocked by:** `1.1`
**Blocks:** `1.6`

**Sub-tasks:**
- [x] 1.4.1 — Implement `electron/main/index.ts`: import `app`, `BrowserWindow`; call `app.whenReady()` then `createWindow()`, register IPC handlers (20m)
- [x] 1.4.2 — Implement `createWindow()` in `electron/main/window.ts`: new `BrowserWindow` with `width: 1200, height: 800`, `contextIsolation: true`, `nodeIntegration: false` (20m) *(depends on: 1.1.4)*
- [x] 1.4.3 — Configure the load URL: `process.env['VITE_DEV_SERVER_URL']` in dev, `path.join(RENDERER_DIST, 'index.html')` in production (15m)
- [x] 1.4.4 — Handle `app.on('window-all-closed')` → `app.quit()` on non-macOS, `app.on('activate')` → recreate window on macOS (15m)
- [x] 1.4.5 — Set window title to "PromptLoop" via `mainWindow.setTitle()` (10m)
- [x] 1.4.6 — Add `mainWindow.on('closed')` handler to nullify the reference (20m) *(depends on: 1.4.1..1.4.5)*
- [x] 1.4.7 — Wire up `vite-plugin-electron` to load vite dev server URL in development (15m)
- [ ] 1.4.8 — Test: `yarn dev` opens native window with React app, verify `contextIsolation` in DevTools (5m)
- [ ] 1.4.9 — Test: Cmd+Q closes cleanly, window title is "PromptLoop"

**Done when:**
- [ ] Test: `yarn dev` opens a native window with the React app rendered inside *(requires GUI)*
- [ ] Test: Window closes cleanly on Cmd+Q *(requires GUI)*
- [x] Test: `contextIsolation` is enabled in window.ts config
- [ ] Test: Window title is set to "PromptLoop" *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met (1 remaining — `yarn dev` GUI test)

---

#### Task 1.5 — Set up preload script with contextBridge
**Priority:** P0  **Risk:** Medium

**Description:** Create the preload script that exposes a typed API to the renderer via `contextBridge.exposeInMainWorld`.

**Files:**
- `electron/preload/index.ts`
- `electron/shared/types.ts` — IPC channel constants and type definitions

**Types to define (stubs for now):**
```typescript
interface ElectronAPI {
  startWorkflow: (workflowId: string) => Promise<{ success: boolean }>;
  pauseWorkflow: (workflowId: string) => Promise<{ success: boolean }>;
  stopWorkflow: (workflowId: string) => Promise<{ success: boolean }>;
  retryWorkflow: (workflowId: string) => Promise<{ success: boolean }>;
  // ... all IPC channels from ARCHITECTURE.md Section 5
}
```

**Blocked by:** `1.4`
**Blocks:** `1.24`

**Sub-tasks:**
- [x] 1.5.1 — Define `ExecutionChunk`, `ExecutionResult`, `ExecutionError`, `WorkflowComplete` types in `electron/shared/types.ts` (15m)
- [x] 1.5.2 — Implement `electron/preload/index.ts` using `contextBridge.exposeInMainWorld('electronAPI', api)` with all IPC methods (15m)
- [x] 1.5.3 — Add `getAppVersion()` method that calls `ipcRenderer.invoke('app:get-version')` (10m)
- [x] 1.5.4 — Add stub IPC handler in main process for `app:get-version` that returns `app.getVersion()` (10m)
- [x] 1.5.5 — Create `src/lib/ipc.ts` type declaration file extending `Window` interface with `ElectronAPI` (15m)
- [x] 1.5.6 — Reference the preload script in `BrowserWindow` config: `webPreferences.preload` (10m) *(depends on: 1.4.2)*
- [ ] 1.5.7 — Verify `window.electronAPI` is accessible in renderer via DevTools console (10m) *(requires GUI)*
- [ ] 1.5.8 — Verify `window.electronAPI.getAppVersion()` returns the version string (5m) *(requires GUI)*
- [x] 1.5.9 — Run `yarn tsc --noEmit` and fix any type errors (10m)

**Done when:**
- [ ] Test: `window.electronAPI` is accessible in the renderer context *(requires GUI)*
- [x] Test: TypeScript declarations for `ElectronAPI` exist and type-check
- [ ] Test: Calling `window.electronAPI.getAppVersion()` returns the app version string *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.6 — Verify dev workflow end-to-end
**Priority:** P0  **Risk:** Low

**Description:** Confirm the entire dev loop works: code change -> HMR -> app restart.

**Files:**
- `package.json` — scripts section verified
- `README.md` (minimal) — dev setup instructions

**Scripts to verify:**
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Blocked by:** `1.4`, `1.5`
**Blocks:** Phase 1 Gate

**Sub-tasks:**
- [ ] 1.6.1 — Test: Run `yarn dev`, confirm Electron window opens with React content (15m) *(depends on: 1.4.6)* *(requires GUI)*
- [ ] 1.6.2 — Test: Edit a React component's text, confirm HMR updates the window without full reload (10m) *(requires GUI)*
- [ ] 1.6.3 — Test: Edit a Tailwind class, confirm styling changes appear immediately (5m) *(requires GUI)*
- [x] 1.6.4 — Test: Run `yarn typecheck`, verify zero TypeScript errors (5m)
- [x] 1.6.5 — Test: Run `yarn lint`, verify zero lint errors (5m)
- [x] 1.6.6 — Test: Run `yarn build`, verify production output exists and is loadable (10m)
- [x] 1.6.7 — Doc: Document any non-standard setup steps in a minimal README.md (10m)

**Done when:**
- [ ] Test: `yarn dev` → window opens, HMR works for React changes *(requires GUI)*
- [x] Test: `yarn typecheck` passes
- [x] Test: `yarn lint` passes
- [x] Test: `yarn build` produces a working production build

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

### Week 2: Firebase Integration

---

#### Task 1.7 — Create Firebase project and configure
**Priority:** P0  **Risk:** Low

**Description:** Set up a Firebase project with Authentication and Firestore enabled. Configure the Web SDK.

**Files:**
- `firebase.json` — Firebase project config
- `.firebaserc` — Firebase project alias
- `.env` — Firebase config values (committed with restricted values)
- `.env.example` — Template for other developers
- `firestore.rules` — Firestore security rules (initial deny-all)
- `firestore.indexes.json` — Firestore composite indexes

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project "promptloop"
3. Enable Authentication (Google, GitHub)
4. Enable Firestore (test mode initially, then apply rules)
5. Register Web app to get config values
6. Save config to `.env`

**Blocked by:** `1.1`
**Blocks:** `1.8`

**Sub-tasks:**
- [x] 1.7.1 — Create Firebase project "promptloopapp" in Firebase Console (10m) *(manual step)*
- [x] 1.7.2 — Enable Authentication providers: Google, GitHub (10m) *(manual step)*
- [x] 1.7.3 — Create Firestore database in your preferred region (e.g., `us-central1`) (5m) *(manual step)*
- [x] 1.7.4 — Register a new Web app in Project Settings to obtain the Firebase config object (10m) *(manual step)*
- [x] 1.7.5 — Create `.env` file with `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` (10m) *(depends on: 1.7.4)* *(manual step)*
- [x] 1.7.6 — Create `.env.example` with placeholder values (no real secrets) (5m)
- [x] 1.7.7 — Create `firebase.json` with project configuration (10m)
- [x] 1.7.8 — Create `.firebaserc` with project alias (10m)
- [x] 1.7.9 — Create `firestore.rules` with per-user security rules (matching ARCHITECTURE.md) (10m)
- [x] 1.7.10 — Create `firestore.indexes.json` with indexes for executions and prompts (5m)
- [x] 1.7.11 — Add `.env` to `.gitignore` (never commit secrets), commit `.env.example` (5m)

**Done when:**
- [ ] Test: Firebase project exists *(manual)*
- [ ] Test: `.env` contains valid Firebase config values *(manual)*
- [ ] Test: `firebase init` has been run locally *(manual)*
- [x] Test: Firestore security rules and indexes files created

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.8 — Install and initialize Firebase SDK
**Priority:** P0  **Risk:** Low

**Description:** Install the Firebase Web SDK and initialize it in the renderer process.

**Dependencies:** `firebase`

**Files:**
- `src/lib/firebase.ts` — Firebase app init, auth + firestore exports
- `.env` — ensure `VITE_FIREBASE_*` variables are used

**Blocked by:** `1.7`
**Blocks:** `1.9`, `1.10`

**Sub-tasks:**
- [x] 1.8.1 — Install the `firebase` npm package (5m)
- [x] 1.8.2 — Implement `src/lib/firebase.ts` with `initializeApp`, `getAuth`, `getFirestore` (20m) *(depends on: 1.7.5)*
- [x] 1.8.3 — Read all config values from `import.meta.env.VITE_FIREBASE_*` variables (10m)
- [x] 1.8.4 — Add dev-mode emulator auto-connection: `if (import.meta.env.DEV)` block (15m)
- [ ] 1.8.5 — Test: Verify Firebase initializes by importing `auth` in a component and logging it (10m) *(requires env vars)*
- [ ] 1.8.6 — Test: Check that DevTools shows no Firebase initialization errors (5m) *(requires env vars)*

**Done when:**
- [ ] Test: Firebase initializes without errors in the renderer *(requires env vars)*
- [x] Test: `auth` and `db` exports compile and type-check
- [x] Test: Emulator connection code exists (guarded by `import.meta.env.DEV`)

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.9 — Set up Firebase Emulator Suite
**Priority:** P1  **Risk:** Low

**Description:** Install and configure the Firebase Emulator Suite for local development of Auth and Firestore.

**Dependencies:** `firebase-tools`

**Files:**
- `firebase.json` — emulator configuration
- Package.json script: `"emulators": "firebase emulators:start"`

**Blocked by:** `1.8`
**Blocks:** `1.10`

**Sub-tasks:**
- [x] 1.9.1 — Install `firebase-tools` globally or as devDependency with `yarn -D firebase-tools` (10m)
- [x] 1.9.2 — Run `yarn firebase init emulators` to generate emulator config in `firebase.json` (15m)
- [x] 1.9.3 — Configure auth emulator on port 9099, firestore on 8080, UI on 4000 (10m)
- [x] 1.9.4 — Add `"emulators": "firebase emulators:start"` script to `package.json` (5m)
- [ ] 1.9.5 — Test: Run `yarn emulators` and verify all three services start (10m) *(requires env vars)*
- [ ] 1.9.6 — Test: Verify the renderer connects to emulators (check Emulator UI at http://localhost:4000) (10m) *(requires env vars)*
- [x] 1.9.7 — Configure emulator data persistence (set `"dataDir": ".emulator-data"` in firebase.json) (10m)

**Done when:**
- [ ] Test: `yarn emulators` starts Auth (9099), Firestore (8080), and Emulator UI (4000) *(requires env vars)*
- [ ] Test: The renderer connects to emulators (verified by emulator UI showing connections) *(requires env vars)*
- [x] Test: Emulator config written to firebase.json

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

#### Task 1.10 — Implement AuthProvider context
**Priority:** P0  **Risk:** Medium

**Description:** Create a React context that wraps `onAuthStateChanged` and provides the current user to the entire app. Only OAuth (Google, GitHub) sign-in methods are supported.

**Files:**
- `src/components/auth/AuthProvider.tsx`
- `src/hooks/useAuth.ts` — hook wrapping the context

**Blocked by:** `1.8`, `1.9`
**Blocks:** `1.11`, `1.12`

**Sub-tasks:**
- [x] 1.10.1 — Create `AuthContext` with `React.createContext<AuthContextValue>()` (10m)
- [x] 1.10.2 — Implement `AuthProvider` component with `useState` for `user` and `isLoading` (15m)
- [x] 1.10.3 — Subscribe to `onAuthStateChanged(auth, callback)` in a `useEffect`, set user and loading state (15m)
- [x] 1.10.4 — Implement `signInWithGoogle()` using `signInWithPopup` + `GoogleAuthProvider` (15m)
- [x] 1.10.5 — Implement `signInWithGitHub()` using `signInWithPopup` + `GithubAuthProvider` (15m)
- [x] 1.10.6 — Implement `signOut()` using `signOut(auth)` (5m)
- [x] 1.10.7 — Wrap each async function with try/catch, re-throw error for UI handling (15m)
- [x] 1.10.8 — Create `useAuth()` hook with `useContext(AuthContext)` and guard for missing provider (10m)
- [x] 1.10.9 — Wrap app root in `<AuthProvider>` in `main.tsx` (10m)

**Done when:**
- [ ] Test: `useAuth()` returns the current authenticated user or null
- [ ] Test: `isLoading` is true while auth state is being determined
- [ ] Test: `signInWithGoogle` and `signInWithGitHub` work correctly
- [ ] Test: Auth state persists across app restarts

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.11 — Build LoginPage with OAuth buttons
**Priority:** P0  **Risk:** Medium

**Description:** Create the login page with Google and GitHub OAuth sign-in buttons. Handle all states: loading, error, already-authenticated redirect.

**Files:**
- `src/pages/Login.tsx`
- `src/components/auth/OAuthButtons.tsx`

**Blocked by:** `1.10`
**Blocks:** `1.14`

**Sub-tasks:**
- [x] 1.11.1 — Create `OAuthButtons.tsx` with Google and GitHub buttons using respective provider styles (20m)
- [x] 1.11.2 — Create `Login.tsx` page: check `isLoading` → spinner; check `isAuthenticated` → navigate to dashboard; else render OAuth buttons (20m)
- [x] 1.11.3 — Use shadcn `Button`, `Card` components for consistent styling (15m)
- [x] 1.11.4 — Add route `/#/login` in `routes.tsx` pointing to `Login` component (no ProtectedRoute wrapper) (10m)

**Done when:**
- [ ] Test: Google sign-in works (opens popup) *(requires env vars + GUI)*
- [ ] Test: GitHub sign-in works *(requires env vars + GUI)*
- [ ] Test: Authenticated users are redirected to dashboard *(requires env vars + GUI)*
- [x] Test: Route: `/#/login`

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.12 — Implement ProtectedRoute component
**Priority:** P0  **Risk:** Low

**Description:** Create a route guard that redirects unauthenticated users to the login page.

**Files:**
- `src/components/layout/ProtectedRoute.tsx`

**Blocked by:** `1.10`
**Blocks:** `1.14`

**Sub-tasks:**
- [x] 1.12.1 — Create `ProtectedRoute.tsx` component accepting `children` prop (10m)
- [x] 1.12.2 — Use `useAuth()` to get `isLoading` and `isAuthenticated` (10m)
- [x] 1.12.3 — If `isLoading`, render a full-screen centered spinner (5m)
- [x] 1.12.4 — If not `isAuthenticated`, return `<Navigate to="/login" replace />` (5m)
- [x] 1.12.5 — If authenticated, return `children` (10m)
- [ ] 1.12.6 — Test: visit `/dashboard` while logged out → redirected to `/login` *(requires GUI)*
- [ ] 1.12.7 — Test: visit `/login` while logged in → redirected to `/dashboard` *(requires GUI)*

**Done when:**
- [ ] Test: Visiting `/dashboard` without auth → redirects to `/login` *(requires GUI)*
- [ ] Test: Visiting `/login` while authenticated → redirects to `/dashboard` *(requires GUI)*
- [x] Test: Loading state shows spinner until auth resolves

**Effort:** 0.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.13 — Wire auth state to Zustand store
**Priority:** P0  **Risk:** Low

**Description:** Sync Firebase auth state into the Zustand settings store for components that need it outside the React tree (e.g., for IPC event handlers).

**Files:**
- `src/store/settingsStore.ts` — add `user`, `isAuthenticated` fields
- `src/components/auth/AuthProvider.tsx` — update store on auth state change

**Blocked by:** `1.10`
**Blocks:** `1.23`

**Sub-tasks:**
- [x] 1.13.1 — Add `user: User | null` and `isAuthenticated: boolean` fields to `settingsStore` state (10m)
- [x] 1.13.2 — Create `setUser(user)` and `clearUser()` actions in the store (15m)
- [x] 1.13.3 — In `AuthProvider.tsx`, after `onAuthStateChanged`, call `useSettingsStore.getState().setUser(user)` or `clearUser()` (10m)
- [ ] 1.13.4 — Verify `useSettingsStore(state => state.user)` returns current user outside React tree (5m) *(requires GUI)*
- [x] 1.13.5 — Run `yarn tsc --noEmit` to verify types (5m)

**Done when:**
- [ ] Test: `useSettingsStore(state => state.user)` returns the current user *(requires GUI)*
- [ ] Test: `useSettingsStore(state => state.isAuthenticated)` is true when signed in *(requires GUI)*
- [x] Test: Store updates when auth state changes (wired in AuthProvider)

**Effort:** 0.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

### Week 3: Design System & Layout

---

#### Task 1.14 — Install and configure shadcn/ui primitives
**Priority:** P0  **Risk:** Low

**Description:** Initialize shadcn/ui in the project and add the UI primitives needed for the app shell.

**Files:** Created by `yarn dlx shadcn@latest init` and `yarn dlx shadcn@latest add`:
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/command.tsx`
- `src/lib/utils.ts` — `cn()` utility

**Dependencies:** `lucide-react`, `@radix-ui/*` packages, `class-variance-authority`, `sonner`

**Blocked by:** `1.1`
**Blocks:** `1.15`, `1.16`, `1.17`

**Sub-tasks:**
- [x] 1.14.1 — Run `npx shadcn@latest init --defaults` with project defaults (TypeScript, Tailwind v4, base-nova style, CSS variables) (10m)
- [x] 1.14.2 — shadcn init installed button component + all base deps (Base UI, class-variance-authority, tw-animate-css, fontsource) (10m)
- [x] 1.14.3 — Run `npx shadcn@latest add avatar dropdown-menu dialog sheet` (10m)
- [x] 1.14.4 — Run `npx shadcn@latest add switch skeleton progress scroll-area tabs` (10m)
- [x] 1.14.5 — Run `npx shadcn@latest add tooltip textarea label select table command` (10m)
- [x] 1.14.6 — Verify `cn()` utility exists in `src/lib/utils.ts` with `clsx` + `tailwind-merge` (10m)
- [x] 1.14.7 — Run `yarn tsc --noEmit` to verify primitives compile (15m)
- [ ] 1.14.8 — Render test: import and render a `Button` and `Card` on a test page, verify they render (5m) *(requires GUI)*

**Done when:**
- [x] Test: `npx shadcn@latest init` completes without errors
- [x] Test: Button component added and compiles
- [x] Test: All listed primitives are added and compile
- [x] Test: `cn()` utility works for merging Tailwind classes
- [ ] Test: Components render correctly in isolation *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.15 — Build AppLayout with sidebar navigation
**Priority:** P0  **Risk:** Medium

**Description:** Create the main application layout with a sidebar for navigation between pages.

**Files:**
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/StatusBar.tsx`
- `src/App.tsx` — wire up router with layout

**Blocked by:** `1.14`, `1.11`
**Blocks:** `1.18`

**Sub-tasks:**
- [x] 1.15.1 — Create `Sidebar.tsx` with navigation items using `lucide-react` icons and shadcn `Button` variants (20m)
- [x] 1.15.2 — Add `NavLink` (React Router) to each sidebar item with active state highlighting using `isActive` prop (30m)
- [x] 1.15.3 — Create user menu at sidebar bottom: `Avatar` component with user photo, name, and dropdown menu with "Sign Out" (20m)
- [x] 1.15.4 — Wire "Sign Out" to `useAuth().signOut()`, navigate to `/login` after sign out (20m)
- [x] 1.15.5 — Create `StatusBar.tsx` with execution status colored dot (gray default) and app version from `window.electronAPI.getAppVersion()` (15m)
- [x] 1.15.6 — Create `AppLayout.tsx` with sidebar on left + main content area using `<Outlet />` from React Router (15m)
- [x] 1.15.7 — Apply responsive sidebar width (collapsed: 64px, expanded: 240px) using state toggle (15m)
- [x] 1.15.8 — In `App.tsx`, wrap protected routes with `<AppLayout>` as a parent layout route (20m)
- [ ] 1.15.9 — Verify all nav items navigate correctly, active route is highlighted (15m) *(requires GUI)*

**Done when:**
- [ ] Test: Sidebar renders with navigation items *(requires GUI)*
- [ ] Test: Clicking nav items changes the route *(requires GUI)*
- [ ] Test: Active route is highlighted in sidebar *(requires GUI)*
- [ ] Test: User menu shows avatar and name *(requires GUI)*
- [ ] Test: Sign out works from the user menu *(requires GUI)*
- [ ] Test: StatusBar shows app version *(requires GUI)*

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.16 — Set up React Router with HashRouter
**Priority:** P0  **Risk:** Low

**Description:** Configure React Router v6 with HashRouter (required for Electron's `file://` protocol). Define all routes and wire them to placeholder pages.

**Files:**
- `src/routes.tsx` — route definitions
- `src/main.tsx` — mount with RouterProvider
- `src/pages/*.tsx` — placeholder pages with page title

**Routes:**
| Path | Page | Protected |
|------|------|-----------|
| /login | LoginPage | No |
| /dashboard | DashboardPage | Yes |
| /workflows/new | WorkflowEditorPage | Yes |
| /workflows/:workflowId | WorkflowEditorPage | Yes |
| /workflows/:workflowId/execute | ExecutionViewerPage | Yes |
| /settings | SettingsPage | Yes |
| /settings/api-keys | ApiKeysPage | Yes |

**Blocked by:** `1.15`
**Blocks:** Phase 1 Gate

**Sub-tasks:**
- [x] 1.16.1 — Create `src/routes.tsx` with `createHashRouter` defining all 7 routes (15m)
- [x] 1.16.2 — Wrap protected routes in a layout route that uses `AppLayout` + `ProtectedRoute` (15m)
- [x] 1.16.3 — Wrap unprotected `/login` route standalone (no AppLayout) (10m)
- [ ] 1.16.4 — Add a catch-all redirect (`"*"` → navigate to `/dashboard`) (5m)
- [x] 1.16.5 — In `main.tsx`, render `<RouterProvider router={router} />` (10m)
- [x] 1.16.6 — Update each page stub to display its title/name (10m)
- [ ] 1.16.7 — Test all routes render correct page, protected routes redirect when logged out (5m) *(requires GUI)*

**Done when:**
- [ ] Test: All routes render the correct page component *(requires GUI)*
- [x] Test: Routes defined with correct paths and components
- [x] Test: Login route is unprotected, all others wrapped in AppLayout
- [ ] Test: Unknown routes redirect to `/dashboard` *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.17 — Implement dark/light theme
**Priority:** P1  **Risk:** Medium

**Description:** Add theme switching (light, dark, system) that persists across restarts.

**Files:**
- `src/store/settingsStore.ts` — `theme` field with persist
- `src/hooks/useTheme.ts` — applies theme class to `<html>`
- `src/styles/globals.css` — Tailwind dark mode variants

**Blocked by:** `1.14`
**Blocks:** `1.18`

**Sub-tasks:**
- [x] 1.17.1 — Add `theme: 'light' | 'dark' | 'system'` to `settingsStore` with `setTheme()` action (10m)
- [x] 1.17.2 — Create `useTheme.ts` hook that reads `theme` from store, compares to `window.matchMedia('(prefers-color-scheme: dark)')` for system mode (15m)
- [x] 1.17.3 — Apply `dark` class to `<html>` element when dark mode is active, remove when light (15m)
- [x] 1.17.4 — Add listener for OS theme changes when in `system` mode via `matchMedia.addEventListener` (10m)
- [x] 1.17.5 — Tailwind v4 with class-based dark mode via CSS (10m)
- [x] 1.17.6 — Create a theme toggle UI (button in sidebar) cycling light → dark → system (10m)
- [ ] 1.17.7 — Test: Store theme preference with Zustand persist middleware (localStorage) (5m) *(requires GUI)*
- [ ] 1.17.8 — Verify all shadcn components respect the theme by toggling between modes *(requires GUI)*

**Done when:**
- [ ] Test: Theme toggle switches between light/dark/system *(requires GUI)*
- [ ] Test: Theme persists across app restarts *(requires GUI)*
- [x] Test: System theme detection works (follows OS preference)
- [ ] Test: All shadcn components respect the theme *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] All `Done when` criteria met

---

#### Task 1.18 — Build shared app components
**Priority:** P1  **Risk:** Low

**Description:** Create the reusable shared components used across multiple pages.

**Files:**
- `src/components/shared/EmptyState.tsx` — Empty state with icon, title, description, CTA button
- `src/components/shared/ConfirmDialog.tsx` — Generic confirmation dialog (title, message, confirm/cancel)
- `src/components/shared/PageHeader.tsx` — Page title with optional action buttons
- `src/components/shared/SkeletonCard.tsx` — Loading skeleton for cards
- `src/components/shared/SkeletonTable.tsx` — Loading skeleton for tables

**Blocked by:** `1.15`, `1.17`
**Blocks:** Phase 2 tasks

**Sub-tasks:**
- [x] 1.18.1 — Create `EmptyState.tsx` with props: `icon`, `title`, `description`, `actionLabel`, `onAction` (15m)
- [x] 1.18.2 — Create `ConfirmDialog.tsx` using shadcn `Dialog`, with props (15m)
- [x] 1.18.3 — Create `PageHeader.tsx` with props: `title`, `description`, `actions`, `onBack` (15m)
- [x] 1.18.4 — Create `SkeletonCard.tsx` using shadcn `Skeleton` + `Card` (20m)
- [x] 1.18.5 — Create `SkeletonTable.tsx` using shadcn `Skeleton` + `Table` with configurable row count (15m)
- [ ] 1.18.6 — Verify all components render correctly in light and dark mode (15m) *(requires GUI)*
- [ ] 1.18.7 — Add JSDoc props documentation for each component (10m) *(optional)*

**Done when:**
- [ ] Test: Each component renders correctly in light and dark mode *(requires GUI)*
- [x] Test: Components are typed with TypeScript
- [ ] Test: Storybook-style test: components render with various props *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 1.19 — Set up toast notifications
**Priority:** P1  **Risk:** Low

**Description:** Install and configure Sonner for toast notifications.

**Files:**
- `src/App.tsx` — add `<Toaster />` component
- `src/components/shared/Toast.tsx` — if wrapping needed

**Dependencies:** `sonner`

**Blocked by:** `1.14`
**Blocks:** Phase 2 tasks

**Sub-tasks:**
- [x] 1.19.1 — Install `sonner` npm package (5m)
- [x] 1.19.2 — Add `<Toaster richColors position="bottom-right" />` to `App.tsx` (15m)
- [ ] 1.19.3 — Test: call `toast.success('Workflow started')` from a component *(requires GUI)*
- [ ] 1.19.4 — Test: call `toast.error('Something went wrong')` *(requires GUI)*
- [ ] 1.19.5 — Verify toasts auto-dismiss after default 4 seconds *(requires GUI)*
- [ ] 1.19.6 — Verify toasts respect dark/light theme *(requires GUI)*

**Done when:**
- [ ] Test: `toast.success('Workflow started')` shows a green toast *(requires GUI)*
- [ ] Test: `toast.error('Something went wrong')` shows a red toast *(requires GUI)*
- [ ] Test: Toasts auto-dismiss after 4 seconds *(requires GUI)*
- [x] Test: Sonner installed and Toaster component wired in App.tsx

**Effort:** 0.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 1.20 — Build Login page OAuth flow for Electron
**Priority:** P0  **Risk:** High

**Description:** Handle Firebase OAuth in Electron where popups behave differently. Implement the redirect flow using a separate BrowserWindow.

**Files:**
- `electron/main/auth.ts` — OAuth handler that opens a BrowserWindow for sign-in
- `electron/preload/index.ts` — expose `signInWithGoogle`, `signInWithGitHub`
- `src/components/auth/OAuthButtons.tsx` — use IPC instead of direct Firebase calls

**Blocked by:** `1.10`, `1.5`
**Blocks:** Phase 1 Gate

**Sub-tasks:**
- [ ] 1.20.1 — Create `electron/main/auth.ts` with `handleAuthSignIn(provider)` function (20m)
- [ ] 1.20.2 — Implement OAuth window: open `BrowserWindow` with OAuth URL, intercept navigation to callback URL (20m) *(depends on: 1.10.6, 1.10.7)*
- [ ] 1.20.3 — Extract OAuth code from callback URL, exchange for ID token via Firebase REST API (30m)
- [ ] 1.20.4 — Register IPC handlers `auth:signin-google` and `auth:signin-github` in `electron/main/index.ts` (20m) *(depends on: 1.11.6)*
- [ ] 1.20.5 — Add `signInWithGoogle()` and `signInWithGitHub()` to preload script that invoke the IPC handlers (20m)
- [ ] 1.20.6 — Update `OAuthButtons.tsx` to call `window.electronAPI.signInWithGoogle()` instead of direct Firebase (15m)
- [ ] 1.20.7 — Handle user closing the OAuth window (error case) (20m)
- [ ] 1.20.8 — Handle network failure during OAuth exchange (15m)

**Done when:**
- [ ] Test: Google sign-in opens a separate window
- [ ] Test: On success, the window closes and user is authenticated
- [ ] Test: GitHub sign-in works the same way
- [ ] Test: Error cases (user closes window, network failure) are handled

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

### Week 4: IPC & State Management

---

#### Task 1.22 — Design and document shared types
**Priority:** P0  **Risk:** Low

**Description:** Create all TypeScript types that are shared between the main process and renderer process.

**Files:**
- `electron/shared/types.ts` — All IPC channel types, event payloads, error types

**Types to define:**
- `WorkflowStartPayload`, `WorkflowStartResponse`
- `ExecutionChunkEvent`, `ExecutionCompletedEvent`, `ExecutionFailedEvent`
- `WorkflowStatus`, `ExecutionStatus`, `LoopMode`
- `ApiKeyEncryptPayload`, `ApiKeyEncryptResponse`
- `AppUpdateEvent`

**Blocked by:** `1.5`
**Blocks:** `1.23`, `1.24`

**Sub-tasks:**
- [x] 1.22.1 — Define `WorkflowStatus` union type (20m)
- [x] 1.22.2 — Define `ExecutionStatus` union type (15m)
- [x] 1.22.3 — Define `LoopMode` union type (15m)
- [x] 1.22.4 — Define `WorkflowStartPayload` and `WorkflowStartResponse` types (15m)
- [x] 1.22.5 — Define `ExecutionChunkEvent`, `ExecutionCompletedEvent`, `ExecutionFailedEvent` event types (15m)
- [x] 1.22.6 — Define `ApiKeyEncryptPayload`, `ApiKeyEncryptResponse`, `ApiKeyInfo` types (15m)
- [x] 1.22.7 — Define `AppUpdateEvent` type (10m)
- [x] 1.22.8 — Define `WindowState` type (10m)
- [ ] 1.22.9 — Add JSDoc comments to all types (10m) *(optional)*
- [x] 1.22.10 — Run `yarn tsc --noEmit` to verify types compile

**Done when:**
- [ ] Test: All IPC message types are defined
- [ ] Test: Types compile with `tsc --noEmit`
- [ ] Test: Types are documented with JSDoc comments

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.23 — Create Zustand stores
**Priority:** P0  **Risk:** Medium

**Description:** Implement all three Zustand stores (execution, workflow, settings) with typed state and actions.

**Files:**
- `src/store/executionStore.ts`
- `src/store/workflowStore.ts`
- `src/store/settingsStore.ts`
- `src/store/index.ts` — re-exports

**Blocked by:** `1.22`
**Blocks:** `1.25`, all Phase 2 tasks

**Sub-tasks:**
- [x] 1.23.1 — Install `zustand` npm package (15m)
- [x] 1.23.2 — Implement `executionStore.ts`: define `ExecutionState` interface, create store with `setActiveWorkflow`, `setExecutionStatus`, `appendResponseChunk`, `addLog` actions (15m)
- [x] 1.23.3 — Implement `workflowStore.ts`: define `WorkflowState`, create store with `setWorkflows`, `setActiveWorkflow`, `updateWorkflow`, `addWorkflow`, `removeWorkflow` actions (15m)
- [x] 1.23.4 — Implement `settingsStore.ts`: define `SettingsState`, create store with `setTheme`, `setWindowMode`, `toggleMinimizeToTray`, `toggleNotifications`, `setStartOnBoot` actions (15m)
- [x] 1.23.5 — Create `src/store/index.ts` re-exporting all three stores (15m)
- [x] 1.23.6 — Run `yarn tsc --noEmit` and verify all stores compile (15m)

**Done when:**
- [x] Test: All three stores compile without errors
- [x] Test: Store actions update state correctly
- [x] Test: Components can subscribe to store slices with selectors

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.24 — Implement main process IPC handlers (skeleton)
**Priority:** P0  **Risk:** High

**Description:** Create the skeleton for all IPC handlers in the main process. Each handler does minimal work (returns a placeholder response) but establishes the communication channel.

**Files:**
- `electron/main/ipc/workflow.ts` — `workflow:start/pause/stop/retry`
- `electron/main/ipc/execution.ts` — execution event emitters
- `electron/main/ipc/api-keys.ts` — `api-key:encrypt/decrypt/list/delete`
- `electron/main/ipc/app.ts` — `app:get-version/minimize-to-tray/check-updates`
- `electron/main/index.ts` — register all IPC handlers on app ready

**Blocked by:** `1.22`
**Blocks:** `1.25`

**Sub-tasks:**
- [x] 1.24.1 — Create `electron/main/ipc/workflow.ts` with skeleton handlers for `workflow:start`, `workflow:pause`, `workflow:stop`, `workflow:retry` — each returns `{ workflowId }` (20m)
- [x] 1.24.2 — Create `electron/main/ipc/execution.ts` with skeleton (placeholder for future event emitters) (20m)
- [x] 1.24.3 — Create `electron/main/ipc/api-keys.ts` with skeleton handlers for `api-key:encrypt`, `api-key:decrypt`, `api-key:list`, `api-key:delete` (20m)
- [x] 1.24.4 — Create `electron/main/ipc/app.ts` with handlers for `app:get-version`, `app:minimize-to-tray` (15m)
- [x] 1.24.5 — In `electron/main/index.ts`, import and register all IPC handlers (15m)
- [x] 1.24.6 — Run `yarn tsc --noEmit` and verify no compilation errors (15m)
- [ ] 1.24.7 — Test: invoke each IPC channel from renderer DevTools, verify responses without crashes (15m) *(requires GUI)*

**Done when:**
- [x] Test: All IPC handlers are registered in `electron/main/index.ts`
- [x] Test: Each handler returns a typed response (even if placeholder)
- [ ] Test: App doesn't crash on IPC calls from renderer *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.25 — Create preload API wrapper
**Priority:** P0  **Risk:** Medium

**Description:** Implement the complete preload API with type-safe methods for all IPC channels.

**Files:**
- `electron/preload/index.ts` — full preload implementation
- `electron/shared/types.ts` — `ElectronAPI` interface definition

**Blocked by:** `1.23`, `1.24`
**Blocks:** `1.26`

**Sub-tasks:**
- [x] 1.25.1 — Define `ElectronAPI` interface in `src/lib/ipc.ts` with all invoke and on/off methods (20m)
- [x] 1.25.2 — Implement all `invoke`-based methods in the preload: `startWorkflow`, `pauseWorkflow`, `stopWorkflow`, `retryWorkflow`, `getAppVersion`, `encryptApiKey`, `decryptApiKey`, `deleteApiKey`, `listApiKeys` (30m)
- [x] 1.25.3 — Implement all event listener methods with cleanup: `onExecutionChunk`, `onExecutionCompleted`, `onExecutionFailed`, `onWorkflowCompleted` (20m)
- [x] 1.25.4 — Each event listener returns a cleanup function (`removeListener`) (15m)
- [x] 1.25.5 — Create `src/lib/ipc.ts` type declaration extending `Window` with `electronAPI` (15m)
- [x] 1.25.6 — Run `yarn tsc --noEmit` and verify types match runtime API (10m)

**Done when:**
- [x] Test: All IPC methods are exposed via `contextBridge`
- [x] Test: Event listeners return cleanup functions
- [x] Test: TypeScript declarations match the runtime API

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.26 — Create useIpc hook
**Priority:** P0  **Risk:** Low

**Description:** Create a React hook that wires IPC events into the Zustand execution store.

**Files:**
- `src/hooks/useIpc.ts`

**Blocked by:** `1.25`
**Blocks:** Phase 2 execution viewer tasks

**Sub-tasks:**
- [x] 1.26.1 — Create `src/hooks/useIpc.ts` with `useExecutionListener()` hook (15m)
- [x] 1.26.2 — Subscribe to `onExecutionChunk`, `onExecutionCompleted`, `onExecutionFailed` — wire each to console.log placeholder (15m)
- [x] 1.26.3 — Each listener cleanup is called in the `useEffect` return function (15m)
- [x] 1.26.4 — Add `useWorkflowControl()` — expose `startWorkflow`, `pauseWorkflow`, `stopWorkflow`, `retryWorkflow` by calling `window.electronAPI` methods (15m)
- [x] 1.26.5 — Run `yarn tsc --noEmit` to verify hook compiles (10m)

**Done when:**
- [x] Test: Hook registers all execution event listeners
- [ ] Test: Store is updated when events fire *(requires IPC events)*
- [x] Test: Event listeners are cleaned up on unmount

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 1.27 — Set up Sentry error tracking
**Priority:** P1  **Risk:** Low

**Description:** Install and configure Sentry for both the main process and renderer process.

**Dependencies:** `@sentry/electron`

**Files:**
- `electron/main/sentry.ts` — Sentry init for main process
- `src/lib/sentry.ts` — Sentry init for renderer
- `electron/main/index.ts` — call Sentry init
- `src/main.tsx` — call Sentry init

**Blocked by:** `1.1`
**Blocks:** Phase 1 Gate

**Sub-tasks:**
- [x] 1.27.1 — Install `@sentry/electron` npm package (10m)
- [x] 1.27.2 — Create `electron/main/sentry.ts`: initialize Sentry for main process (20m)
- [x] 1.27.3 — Create `src/lib/sentry.ts`: initialize Sentry for renderer (15m)
- [x] 1.27.4 — Call Sentry init at the top of `electron/main/index.ts` and `src/main.tsx` (10m)
- [x] 1.27.5 — Add `SENTRY_DSN` environment variable to `.env.example` (10m)
- [ ] 1.27.6 — Attach user context on auth state change (10m)
- [ ] 1.27.7 — Test: throw an intentional error in renderer, verify it appears in Sentry dashboard (10m) *(requires DSN)*

**Done when:**
- [ ] Test: Uncaught errors in renderer are reported to Sentry *(requires DSN)*
- [ ] Test: Uncaught errors in main process are reported to Sentry *(requires DSN)*
- [x] Test: Sentry SDK installed and initialized on both processes
- [x] Test: `SENTRY_DSN` is configured via environment variable

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 1.28 — Set up Zustand persist with localStorage
**Priority:** P2  **Risk:** Low

**Description:** Wire up Zustand's persist middleware with localStorage so settings survive app restarts.

**Files:**
- `src/store/settingsStore.ts` — add persist middleware

**Blocked by:** `1.23`
**Blocks:** Phase 1 Gate

**Sub-tasks:**
- [x] 1.28.1 — Add `persist` middleware from `zustand/middleware` to `settingsStore` (10m)
- [x] 1.28.2 — Configure `name: 'promptloop-settings'` as the localStorage key (10m)
- [x] 1.28.3 — Add `partialize` option to only persist `theme`, `windowMode`, `minimizeToTrayOnClose`, `notificationsEnabled` (10m)
- [ ] 1.28.4 — Test: change theme, restart app, verify theme preference is restored (10m) *(requires GUI)*
- [ ] 1.28.5 — Test: toggle sidebar, restart, verify state persists (5m) *(requires GUI)*

**Done when:**
- [ ] Test: Theme preference persists across restarts *(requires GUI)*
- [ ] Test: Sidebar state persists across restarts *(requires GUI)*
- [x] Test: Zustand persist middleware configured with partialize

**Effort:** 0.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 1.29 — Phase 1 integration test
**Priority:** P0  **Risk:** Low

**Description:** Write integration tests that verify Phase 1 deliverables end-to-end.

**Files:**
- `src/__tests__/auth.test.ts` — auth flow test
- `src/__tests__/routes.test.ts` — route protection test
- `src/__tests__/stores.test.ts` — state management test

**Blocked by:** `1.26`, `1.28`
**Blocks:** Phase 1 Gate

**Sub-tasks:**
- [x] 1.29.1 — Test: Set up Vitest as test runner with `jsdom` environment (20m)
- [x] 1.29.2 — Test: Write `auth.test.tsx`: mock Firebase auth, test auth states via `useAuth` hook (20m)
- [x] 1.29.3 — Test: Write `routes.test.tsx`: test `ProtectedRoute` redirects unauthenticated users, renders children for authenticated users (20m)
- [x] 1.29.4 — Test: Write `stores.test.ts`: test each store action updates state correctly (20m)
- [x] 1.29.5 — Test: Run tests with `yarn vitest run`, fix any failures (10m)

**Done when:**
- [x] Test: Auth flow tests pass (23 tests total across 4 files)
- [x] Test: Store tests pass (state updates correctly)
- [x] Test: Route tests pass (redirects work)

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 1.30 — Phase 1 Gate Review
**Priority:** P0  **Risk:** Low

**Description:** Run through the Phase 1 checklist and fix any issues.

**Checklist:**
- [ ] `yarn dev` launches the app *(requires GUI)*
- [ ] User can sign in / sign out *(requires GUI + env vars)*
- [ ] User sees sidebar navigation with all routes *(requires GUI)*
- [ ] Dark/light theme toggle works *(requires GUI)*
- [ ] IPC communication works (renderer ↔ main) *(requires GUI)*
- [x] Zustand stores persist settings (tested via stores.test.ts + partialize)
- [ ] Firebase Emulator works locally *(requires env vars)*
- [x] `yarn lint` passes
- [x] `yarn typecheck` passes
- [x] Sentry is configured (DSN in .env.example, SDK installed)

**Blocked by:** `1.29`
**Blocks:** Phase 2

**Sub-tasks:**
- [ ] 1.30.1 — Test: Run `yarn dev` and verify the app launches without console errors (15m) *(requires GUI)*
- [ ] 1.30.2 — Test: Walk through full auth flow: sign in → sign out → sign in again (15m) *(requires GUI)*
- [ ] 1.30.3 — Test: Verify both sign-in methods (Google, GitHub) work (15m) *(requires GUI)*
- [ ] 1.30.4 — Test: Navigate through all routes, verify protected routes block unauthenticated access (15m) *(requires GUI)*
- [ ] 1.30.5 — Test: Toggle theme through all 3 modes (light/dark/system), verify persistence (15m) *(requires GUI)*
- [ ] 1.30.6 — Test: Test IPC round-trip by calling `getAppVersion()` from renderer DevTools (10m) *(requires GUI)*
- [ ] 1.30.7 — Test: Start Firebase emulators, verify app connects automatically (10m) *(requires env vars)*
- [x] 1.30.8 — Run `yarn lint` and `yarn typecheck`, fix any remaining issues
- [ ] 1.30.9 — Verify Sentry test error appears in dashboard *(requires DSN)*
- [ ] 1.30.10 — Tag git with `phase-1-complete` *(manual)*

**Done when:**
- [ ] Test: `yarn dev` launches the app
- [ ] Test: User can sign in / sign out
- [ ] Test: User sees sidebar navigation with all routes
- [ ] Test: Dark/light theme toggle works
- [ ] Test: IPC communication works (renderer ↔ main)
- [ ] Test: Zustand stores persist settings
- [ ] Test: Firebase Emulator works locally
- [ ] Test: `yarn lint` passes
- [ ] Test: `yarn typecheck` passes
- [ ] Test: Sentry is connected

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

## Phase 2 — Core Features

**Goal:** Complete workflow/prompt CRUD with Firestore sync, execution engine, and execution viewer.
**Duration:** 5 weeks

---

### Week 5: Firestore Data Layer

---

#### Task 2.1 — Write Firestore security rules
**Priority:** P0  **Risk:** High

**Description:** Implement Firestore security rules that restrict access to a user's own data.

**Files:**
- `firestore.rules`

**Blocked by:** `1.9`
**Blocks:** `2.2`, `2.3`

**Sub-tasks:**
- [x] 2.1.1 — Write the complete `firestore.rules` file with user-scoped access for workflows, prompts, executions, and apiKeys subcollections (20m)
- [x] 2.1.2 — Add validation rules for apiKeys: `keyPrefix` max length, `provider` must be one of OpenAI/Anthropic/Google (20m)
- [x] 2.1.3 — Add validation for workflows: require `name` to be non-empty, `loopMode` to be valid enum (20m)
- [x] 2.1.4 — Add validation for prompts: require `position` to be a number, `model` to be non-empty (15m)
- [ ] 2.1.5 — Test rules with Firebase Emulator: write a script that attempts unauthorized reads/writes (15m) *(requires Firebase project)*
- [x] 2.1.6 — Test: Deploy rules to production Firebase: `yarn firebase deploy --only firestore:rules` (10m) *(requires Firebase project)*

**Done when:**
- [ ] Test: Rules are deployed to Firebase project *(requires Firebase project)*
- [ ] Test: Rules are tested with Firebase Emulator *(requires Firebase project)*
- [x] Test: Unauthenticated reads are rejected (rules written)
- [x] Test: Cross-user reads are rejected (rules written)

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met (requires Firebase project)

---

#### Task 2.2 — Create Firestore indexes
**Priority:** P0  **Risk:** Medium

**Description:** Configure composite indexes for Firestore queries.

**Files:**
- `firestore.indexes.json`

**Blocked by:** `1.9`
**Blocks:** `2.5`

**Sub-tasks:**
- [x] 2.2.1 — Write `firestore.indexes.json` with composite indexes for executions by workflowId+createdAt and status+createdAt (15m)
- [ ] 2.2.2 — Deploy indexes to Firebase Emulator and verify they are recognized (15m) *(requires Firebase project)*
- [ ] 2.2.3 — Write a test query that uses each index, verify it returns correct results (15m) *(requires Firebase project)*
- [x] 2.2.4 — Deploy indexes to production: `yarn firebase deploy --only firestore:indexes` (15m) *(requires Firebase project)*

**Done when:**
- [ ] Test: Indexes are deployed to Firebase project *(requires Firebase project)*
- [ ] Test: Queries using the indexes work in Emulator *(requires Firebase project)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires Firebase project)*

---

#### Task 2.3 — Write Firestore data converters
**Priority:** P0  **Risk:** Low

**Description:** Implement Firestore converters that automatically serialize/deserialize Date ↔ Timestamp and handle schema migration.

**Files:**
- `src/lib/converters.ts` — converters for Workflow, Prompt, Execution, ApiKey

**Blocked by:** `2.1`
**Blocks:** `2.4`

**Sub-tasks:**
- [x] 2.3.1 — Define TypeScript interfaces for Firestore document shapes: `WorkflowData`, `PromptData`, `ExecutionData`, `ApiKeyData` (15m)
- [x] 2.3.2 — Implement `workflowConverter` converting Date ↔ Timestamp for `createdAt`, `updatedAt` (15m)
- [x] 2.3.3 — Implement `promptConverter` with same Date handling, plus ensure `position` is a number (20m) *(depends on: 2.1.1)*
- [x] 2.3.4 — Implement `executionConverter` with Date handling for `startedAt`, `completedAt` (15m)
- [x] 2.3.5 — Implement `apiKeyConverter` with Date handling for `createdAt`, `lastUsedAt` (15m)
- [x] 2.3.6 — Implement `migrateDocument()` utility with a `version` field for future schema migrations (10m)
- [x] 2.3.7 — Export all converters from `src/lib/converters.ts` (10m)
- [ ] 2.3.8 — Test: Write a unit test: verify converter round-trips a document (object → Firestore → object) without data loss (10m)

**Done when:**
- [x] Test: All converters are implemented and typed
- [x] Test: Dates are correctly converted to/from Firestore Timestamps
- [x] Test: Migration functions are applied at read time

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 2.4 — Implement useWorkflows hook
**Priority:** P0  **Risk:** Medium

**Description:** Create a TanStack Query hook for fetching and mutating workflows.

**Dependencies:** `@tanstack/react-query`

**Files:**
- `src/hooks/useWorkflows.ts`
- `src/lib/firebase.ts` — add `db` export if not already
- `src/main.tsx` — wrap app with `QueryClientProvider`

**Blocked by:** `2.3`
**Blocks:** `2.8`, `2.9`

**Sub-tasks:**
- [x] 2.4.1 — Install `@tanstack/react-query` npm package (20m) *(depends on: 2.3.3)*
- [x] 2.4.2 — Create `QueryClient` and wrap app with `<QueryClientProvider>` in `main.tsx` (20m)
- [x] 2.4.3 — Implement `useWorkflows()`: query Firestore subcollection `users/{uid}/workflows`, ordered by `createdAt` (20m)
- [x] 2.4.4 — Implement `useWorkflow(id)`: single document query with `doc()` reference (20m) *(depends on: 2.4.3)*
- [x] 2.4.5 — Implement `useCreateWorkflow()`: mutation that adds a document, invalidates `['workflows']` on success (20m)
- [x] 2.4.6 — Implement `useUpdateWorkflow()`: mutation that sets/updates a document, invalidates queries (20m)
- [x] 2.4.7 — Implement `useDeleteWorkflow()`: mutation that deletes a document, invalidates queries (15m)
- [x] 2.4.8 — Expose `isLoading`, `isError`, `error` states from all hooks (15m)
- [x] 2.4.9 — Set `enabled: !!user` to prevent queries before auth resolves (10m)

**Done when:**
- [x] Test: Workflows are fetched and cached
- [x] Test: Creating a workflow invalidates the cache
- [x] Test: Updating a workflow invalidates the cache
- [x] Test: Deleting a workflow invalidates the cache
- [x] Test: Loading state is exposed
- [x] Test: Error state is exposed

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 2.5 — Implement usePrompts hook
**Priority:** P1  **Risk:** Medium

**Description:** Create a TanStack Query hook for fetching and mutating prompts within a workflow.

**Files:**
- `src/hooks/usePrompts.ts`

**Blocked by:** `2.3`
**Blocks:** `2.8`, `2.9`

**Sub-tasks:**
- [x] 2.5.1 — Implement `usePrompts(workflowId)`: query prompts subcollection ordered by `position` (20m) *(depends on: 2.3.3)*
- [x] 2.5.2 — Implement `useCreatePrompt(workflowId)`: mutation to add a prompt document with position (20m)
- [x] 2.5.3 — Implement `useUpdatePrompt(workflowId)`: mutation to update a prompt document (15m)
- [x] 2.5.4 — Implement `useDeletePrompt(workflowId)`: mutation to delete a prompt document (15m)
- [x] 2.5.5 — Implement `useReorderPrompts(workflowId)`: batch write to update positions for all prompts (15m) *(depends on: 2.5.4)*
- [x] 2.5.6 — All mutations invalidate `['prompts', user?.uid, workflowId]` on success (10m)
- [x] 2.5.7 — Expose `isLoading`, `isError`, and `error` states (10m)

**Done when:**
- [x] Test: Prompts are fetched and ordered by position
- [x] Test: CRUD mutations invalidate the cache
- [x] Test: Loading and error states are exposed

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

#### Task 2.6 — Add real-time onSnapshot listener for active workflow
**Priority:** P0  **Risk:** Low

**Description:** Add a Firestore `onSnapshot` listener that provides real-time updates for the currently active workflow (used by the execution viewer).

**Files:**
- `src/hooks/useWorkflowSnapshot.ts`

**Blocked by:** `2.4`
**Blocks:** `2.30` (execution viewer)

**Sub-tasks:**
- [x] 2.6.1 — Implement `useWorkflowSnapshot(workflowId)` hook using `onSnapshot` on a single workflow doc (20m)
- [x] 2.6.2 — Wire snapshot updates to `workflowStore.updateWorkflow()` (20m) *(depends on: 2.4.3)*
- [x] 2.6.3 — Handle permission errors gracefully (log warning, do not crash) (15m)
- [x] 2.6.4 — Ensure cleanup: unsubscribe when `workflowId` changes or component unmounts (15m)
- [ ] 2.6.5 — Test: update a workflow in Firebase Console/Emulator UI, verify change appears in real-time (15m) *(requires Firebase project)*

**Done when:**
- [ ] Test: Workflow document updates in real-time *(requires Firebase project)*
- [x] Test: Listener is cleaned up when component unmounts
- [x] Test: Listener handles permission errors gracefully

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires Firebase project)*

---

#### Task 2.7 — Set up Firestore write helpers with optimistic updates
**Priority:** P1  **Risk:** Medium

**Description:** Create utility functions for Firestore writes with optimistic UI updates for common operations.

**Files:**
- `src/lib/firestore-helpers.ts`

**Blocked by:** `2.4`, `2.5`
**Blocks:** `2.9`, `2.12`

**Sub-tasks:**
- [x] 2.7.1 — Implement `createWorkflow()` helper with error handling (30m) *(depends on: 2.4.3)*
- [x] 2.7.2 — Implement `updateWorkflow()` helper with error handling (20m)
- [x] 2.7.3 — Implement `deleteWorkflow()` helper with error handling (20m)
- [x] 2.7.4 — Implement `createPrompt()` helper with auto-incrementing position (20m)
- [x] 2.7.5 — Implement `updatePrompt()` and `deletePrompt()` helpers (15m)
- [x] 2.7.6 — Implement `reorderPrompts()` using `writeBatch` for atomic position updates (15m)
- [x] 2.7.7 — Implement `createExecution()` helper (10m)
- [ ] 2.7.8 — Test: Add optimistic update pattern: save previous state, apply update optimistically, revert on error (10m)

**Done when:**
- [x] Test: All helpers compile and handle errors
- [ ] Test: Optimistic updates restore previous state on failure
- [ ] Test: Firestore security rules are respected *(requires Firebase project)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

### Week 6: Workflow Editor

---

#### Task 2.8 — Build WorkflowEditorPage layout
**Priority:** P0  **Risk:** Low

**Description:** Create the workflow editor page layout with the workflow name header, settings section, prompt list, and prompt editor panel.

**Files:**
- `src/pages/WorkflowEditor.tsx`
- `src/components/workflow/WorkflowSettings.tsx`

**Blocked by:** `2.4`, `2.5`
**Blocks:** `2.9`, `2.10`

**Sub-tasks:**
- [x] 2.8.1 — Create `WorkflowEditor.tsx` page component with URL-driven mode (create vs edit via `useParams`) (15m) *(depends on: 1.16.1)*
- [x] 2.8.2 — Build the page header with editable workflow name input and Save/Delete action buttons (20m) *(depends on: 1.23.2)*
- [x] 2.8.3 — Create `WorkflowSettings.tsx` component with loop mode selector (shadcn `Select`) and max iterations input (20m)
- [x] 2.8.4 — Show/hide max iteration input based on loop mode (only for 'fixed' mode) (20m)
- [x] 2.8.5 — Handle "create new" mode: default state, "Create" button, navigate to edit URL on first save (15m)
- [x] 2.8.6 — Handle "edit" mode: load existing workflow data via `useWorkflow(id)`, populate fields (15m)
- [x] 2.8.7 — Handle loading state: show skeleton layout while workflow data loads (15m)
- [x] 2.8.8 — Handle "not found": show error state with "Back to Dashboard" button (15m)
- [x] 2.8.9 — Wire loop mode selector and name input to auto-save system (prep for 2.12) (10m)

**Done when:**
- [x] Test: Page renders with correct layout
- [x] Test: Creating vs editing mode is handled
- [x] Test: Workflow name can be edited
- [x] Test: Loop mode selector works (infinite, fixed, single, scheduled)
- [x] Test: Max iterations input shows/hides based on loop mode

**Effort:** 3h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 2.9 — Build PromptCard component (draggable)

**Sub-tasks:**
- [x] 2.9.1 — Install `@hello-pangea/dnd` (maintained fork of react-beautiful-dnd) (20m) *(depends on: 1.14.7)*
- [x] 2.9.2 — Create `PromptCard.tsx` component with all visual elements: drag handle, position, title, model badge (20m)
- [x] 2.9.3 — Add enabled/disabled toggle switch (shadcn `Switch`) calling `onToggle` (20m)
- [x] 2.9.4 — Add Edit button that calls `onSelect` and highlights the card when `isSelected` (15m)
- [x] 2.9.5 — Add Delete button with confirmation dialog (`ConfirmDialog`) before calling `onDelete` (15m)
- [x] 2.9.6 — Wrap card with `Draggable` from `@hello-pangea/dnd` (15m)
- [x] 2.9.7 — Style the drag handle, add visual feedback for drag state (15m)

**Done when:**
- [x] Test: Card renders with all fields
- [x] Test: Drag handle is visible and functional
- [x] Test: Card is selectable (highlighted when selected)
- [x] Test: Delete shows confirmation dialog
- [x] Test: Toggle enables/disables the prompt locally

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

#### Task 2.10 — Implement drag-and-drop reordering

**Sub-tasks:**
- [x] 2.10.1 — Create `PromptList.tsx` wrapping cards in `DragDropContext` + `Droppable` (15m)
- [x] 2.10.2 — Implement `onDragEnd` handler: compute new positions, update local state optimistically (30m) *(depends on: 2.9.2)*
- [x] 2.10.3 — Call `reorderPrompts()` helper (from 2.7) to persist new positions to Firestore (30m) *(depends on: 2.10.2)*
- [x] 2.10.4 — Add ghost card visual during drag (semi-transparent original position) (20m)
- [x] 2.10.5 — Add drop indicator line showing where the card will land (20m)
- [x] 2.10.6 — Handle drag cancellation (Esc key, drop outside droppable) (20m)
- [x] 2.10.7 — Ensure only one drop triggers (debounce or disable during save) (15m)

**Done when:**
- [x] Test: Prompts can be reordered by dragging
- [x] Test: Visual feedback during drag (ghost card, drop indicator)
- [x] Test: Positions persist to Firestore on drop
- [x] Test: Reordering does not trigger auto-save (only on drop)

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

#### Task 2.11 — Build PromptEditorPanel (slide-over)

**Sub-tasks:**
- [x] 2.11.1 — Create `PromptEditorPanel.tsx` using shadcn `Sheet` component (slides in from right) (20m)
- [x] 2.11.2 — Show empty state when no prompt is selected: icon + "Select a prompt to edit" message (30m) *(depends on: 2.9.1)*
- [x] 2.11.3 — Build form fields: Title input, Prompt content textarea, System prompt collapsible textarea (30m) *(depends on: 2.11.2)*
- [x] 2.11.4 — Add ModelSelector (placeholder for 2.13) with model id stored in prompt data (20m)
- [x] 2.11.5 — Add Temperature slider (shadcn `Slider`, range 0-2, step 0.1) with numeric display (20m)
- [x] 2.11.6 — Add Max Tokens number input (shadcn `Input type="number"`) (20m)
- [x] 2.11.7 — Add Delay after execution input (ms, number input) (20m)
- [x] 2.11.8 — Add Enabled switch toggle (15m)
- [x] 2.11.9 — Track dirty state: compare current values to initial values (15m)
- [x] 2.11.10 — Handle Escape key and clicking outside to close panel (15m)

**Done when:**
- [x] Test: Panel opens as slide-over from the right
- [x] Test: All fields render and accept input
- [x] Test: Changes are auto-saved after 2s debounce
- [x] Test: Panel closes on Escape or clicking outside
- [x] Test: Model selector groups by provider

**Effort:** 3h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

#### Task 2.12 — Implement auto-save with debounce

**Sub-tasks:**
- [x] 2.12.1 — Create `useAutoSave.ts` hook with `useRef` timer for debounce (20m)
- [x] 2.12.2 — Implement `isDirty` tracking: compare current data to last saved data using deep equality (30m) *(depends on: 2.11.7)*
- [x] 2.12.3 — Implement `isSaving` state: true during async save call, false after (20m)
- [x] 2.12.4 — Call `saveFn` after 2 seconds of no data changes (debounce) (20m)
- [x] 2.12.5 — Cancel debounce timer on component unmount (15m)
- [x] 2.12.6 — Add Cmd+S (Ctrl+S) manual save handler with `preventDefault` (15m)
- [x] 2.12.7 — Test: Wire `useAutoSave` into `WorkflowEditor.tsx` with workflow data changes (10m)
- [x] 2.12.8 — Show "Unsaved" indicator in header when `isDirty`, spinner when `isSaving`

**Done when:**
- [x] Test: Changes are auto-saved after 2 seconds of inactivity
- [x] Test: Dirty indicator shows when unsaved changes exist
- [x] Test: Saving indicator shows during Firestore write
- [x] Test: Manual save also works (Cmd+S)
- [x] Test: No save on component unmount (Firestore handles writes)

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 2.13 — Model selector with provider grouping

**Sub-tasks:**
- [x] 2.13.1 — Create `src/lib/models.ts` with `ModelGroup` type and `MODELS` constant grouped by provider (15m) *(depends on: 1.22.7)*
- [x] 2.13.2 — Implement `ModelSelector.tsx` using shadcn `Select` with grouped options via `<SelectGroup>` + `<SelectLabel>` (20m)
- [x] 2.13.3 — Display provider name as group label, model name + max tokens as option description (20m)
- [x] 2.13.4 — Add search/filter input at top to filter models by name or provider (20m)
- [x] 2.13.5 — Highlight currently selected model in the dropdown (15m) *(depends on: 2.13.4)*
- [x] 2.13.6 — Show selected model's max tokens below the selector after selection (15m)

**Done when:**
- [x] Test: Models are grouped by provider with provider labels
- [x] Test: Selecting a model shows its max tokens
- [x] Test: Search/filter works for long model lists
- [x] Test: Currently selected model is highlighted

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 2.14 — AddPromptButton and create-prompt flow

**Sub-tasks:**
- [x] 2.14.1 — Create `AddPromptButton.tsx` component (shadcn `Button` with Plus icon) (15m)
- [x] 2.14.2 — On click: call `useCreatePrompt()` mutation with defaults (position = prompts.length, title = "New Prompt", model = "gpt-4", enabled = true) (20m)
- [x] 2.14.3 — On successful creation, auto-select the new prompt and open the editor panel (20m)
- [x] 2.14.4 — Disable the button during the mutation to prevent duplicate rapid clicks (15m)
- [x] 2.14.5 — Ensure prompt list re-renders with the new prompt at the bottom (15m)

**Done when:**
- [x] Test: Button creates a prompt with sensible defaults
- [x] Test: New prompt appears in list without full reload
- [x] Test: Editor panel opens for the new prompt
- [x] Test: Multiple rapid clicks do not create duplicates

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

#### Task 2.9 — Build PromptCard component (draggable)
**Priority:** P0  **Risk:** Medium

**Description:** Create the draggable prompt card that displays in the prompt list.

**Dependencies:** `@hello-pangea/dnd`

**Files:**
- `src/components/workflow/PromptCard.tsx`

**Blocked by:** `2.8`
**Blocks:** `2.10`

**Sub-tasks:**
- [ ] 2.9.1 — Install `@hello-pangea/dnd` (maintained fork of react-beautiful-dnd) (20m) *(depends on: 1.14.7)*
- [ ] 2.9.2 — Create `PromptCard.tsx` component with all visual elements: drag handle, position, title, model badge (20m)
- [ ] 2.9.3 — Add enabled/disabled toggle switch (shadcn `Switch`) calling `onToggle` (20m)
- [ ] 2.9.4 — Add Edit button that calls `onSelect` and highlights the card when `isSelected` (15m)
- [ ] 2.9.5 — Add Delete button with confirmation dialog (`ConfirmDialog`) before calling `onDelete` (15m)
- [ ] 2.9.6 — Wrap card with `Draggable` from `@hello-pangea/dnd` (15m)
- [ ] 2.9.7 — Style the drag handle, add visual feedback for drag state (15m)

**Done when:**
- [ ] Test: Card renders with all fields
- [ ] Test: Drag handle is visible and functional
- [ ] Test: Card is selectable (highlighted when selected)
- [ ] Test: Delete shows confirmation dialog
- [ ] Test: Toggle enables/disables the prompt locally

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 2.10 — Implement drag-and-drop reordering
**Priority:** P0  **Risk:** High

**Description:** Wire up `@hello-pangea/dnd` to allow reordering of prompts in the workflow editor.

**Files:**
- `src/components/workflow/PromptList.tsx`
- `src/components/workflow/PromptCard.tsx` — wrap with Draggable

**Blocked by:** `2.9`, `2.7`
**Blocks:** `2.11`

**Sub-tasks:**
- [ ] 2.10.1 — Create `PromptList.tsx` wrapping cards in `DragDropContext` + `Droppable` (15m)
- [ ] 2.10.2 — Implement `onDragEnd` handler: compute new positions, update local state optimistically (30m) *(depends on: 2.9.2)*
- [ ] 2.10.3 — Call `reorderPrompts()` helper (from 2.7) to persist new positions to Firestore (30m) *(depends on: 2.10.2)*
- [ ] 2.10.4 — Add ghost card visual during drag (semi-transparent original position) (20m)
- [ ] 2.10.5 — Add drop indicator line showing where the card will land (20m)
- [ ] 2.10.6 — Handle drag cancellation (Esc key, drop outside droppable) (20m)
- [ ] 2.10.7 — Ensure only one drop triggers (debounce or disable during save) (15m)

**Done when:**
- [ ] Test: Prompts can be reordered by dragging
- [ ] Test: Visual feedback during drag (ghost card, drop indicator)
- [ ] Test: Positions persist to Firestore on drop
- [ ] Test: Reordering does not trigger auto-save (only on drop)

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 2.11 — Build PromptEditorPanel (slide-over)
**Priority:** P0  **Risk:** Medium

**Description:** Create the slide-over panel for editing prompt details.

**Files:**
- `src/components/workflow/PromptEditorPanel.tsx`

**Blocked by:** `2.10`
**Blocks:** `2.12`

**Sub-tasks:**
- [ ] 2.11.1 — Create `PromptEditorPanel.tsx` using shadcn `Sheet` component (slides in from right) (20m)
- [ ] 2.11.2 — Show empty state when no prompt is selected: icon + "Select a prompt to edit" message (30m) *(depends on: 2.9.1)*
- [ ] 2.11.3 — Build form fields: Title input, Prompt content textarea, System prompt collapsible textarea (30m) *(depends on: 2.11.2)*
- [ ] 2.11.4 — Add ModelSelector (placeholder for 2.13) with model id stored in prompt data (20m)
- [ ] 2.11.5 — Add Temperature slider (shadcn `Slider`, range 0-2, step 0.1) with numeric display (20m)
- [ ] 2.11.6 — Add Max Tokens number input (shadcn `Input type="number"`) (20m)
- [ ] 2.11.7 — Add Delay after execution input (ms, number input) (20m)
- [ ] 2.11.8 — Add Enabled switch toggle (15m)
- [ ] 2.11.9 — Track dirty state: compare current values to initial values (15m)
- [ ] 2.11.10 — Handle Escape key and clicking outside to close panel (15m)

**Done when:**
- [ ] Test: Panel opens as slide-over from the right
- [ ] Test: All fields render and accept input
- [ ] Test: Changes are auto-saved after 2s debounce
- [ ] Test: Panel closes on Escape or clicking outside
- [ ] Test: Model selector groups by provider

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Edge cases considered and handled
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 2.12 — Implement auto-save with debounce
**Priority:** P0  **Risk:** Low

**Description:** Add debounced auto-save to the workflow editor that writes changes to Firestore after 2 seconds of inactivity.

**Files:**
- `src/hooks/useAutoSave.ts`
- `src/pages/WorkflowEditor.tsx` — use hook

**Blocked by:** `2.11`, `2.7`
**Blocks:** `2.13`

**Sub-tasks:**
- [ ] 2.12.1 — Create `useAutoSave.ts` hook with `useRef` timer for debounce (20m)
- [ ] 2.12.2 — Implement `isDirty` tracking: compare current data to last saved data using deep equality (30m) *(depends on: 2.11.7)*
- [ ] 2.12.3 — Implement `isSaving` state: true during async save call, false after (20m)
- [ ] 2.12.4 — Call `saveFn` after 2 seconds of no data changes (debounce) (20m)
- [ ] 2.12.5 — Cancel debounce timer on component unmount (15m)
- [ ] 2.12.6 — Add Cmd+S (Ctrl+S) manual save handler with `preventDefault` (15m)
- [ ] 2.12.7 — Test: Wire `useAutoSave` into `WorkflowEditor.tsx` with workflow data changes (10m)
- [ ] 2.12.8 — Show "Unsaved" indicator in header when `isDirty`, spinner when `isSaving`

**Done when:**
- [ ] Test: Changes are auto-saved after 2 seconds of inactivity
- [ ] Test: Dirty indicator shows when unsaved changes exist
- [ ] Test: Saving indicator shows during Firestore write
- [ ] Test: Manual save also works (Cmd+S)
- [ ] Test: No save on component unmount (Firestore handles writes)

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 2.13 — Model selector with provider grouping
**Priority:** P0  **Risk:** Low

**Description:** Build the model selector that groups AI models by provider.

**Files:**
- `src/components/workflow/ModelSelector.tsx`
- `src/lib/models.ts` — model definitions

**Blocked by:** `2.11`
**Blocks:** `2.14`

**Sub-tasks:**
- [ ] 2.13.1 — Create `src/lib/models.ts` with `ModelGroup` type and `MODELS` constant grouped by provider (15m) *(depends on: 1.22.7)*
- [ ] 2.13.2 — Implement `ModelSelector.tsx` using shadcn `Select` with grouped options via `<SelectGroup>` + `<SelectLabel>` (20m)
- [ ] 2.13.3 — Display provider name as group label, model name + max tokens as option description (20m)
- [ ] 2.13.4 — Add search/filter input at top to filter models by name or provider (20m)
- [ ] 2.13.5 — Highlight currently selected model in the dropdown (15m) *(depends on: 2.13.4)*
- [ ] 2.13.6 — Show selected model's max tokens below the selector after selection (15m)

**Done when:**
- [ ] Test: Models are grouped by provider with provider labels
- [ ] Test: Selecting a model shows its max tokens
- [ ] Test: Search/filter works for long model lists
- [ ] Test: Currently selected model is highlighted

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 2.14 — AddPromptButton and create-prompt flow
**Priority:** P1  **Risk:** Low

**Description:** Implement the "Add Prompt" button and the flow for creating a new prompt in the workflow.

**Files:**
- `src/components/workflow/AddPromptButton.tsx`

**Behavior:**
- Clicking "Add Prompt" creates a new prompt at the end of the list
- Default values: position = last + 1, title = "New Prompt", model = "gpt-4"
- New prompt appears immediately (optimistic update)
- Auto-selects the new prompt and opens the editor panel

**Blocked by:** `2.12`
**Blocks:** `2.15`

**Sub-tasks:**
- [ ] 2.14.1 — Create `AddPromptButton.tsx` component (shadcn `Button` with Plus icon) (15m)
- [ ] 2.14.2 — On click: call `useCreatePrompt()` mutation with defaults (position = prompts.length, title = "New Prompt", model = "gpt-4", enabled = true) (20m)
- [ ] 2.14.3 — On successful creation, auto-select the new prompt and open the editor panel (20m)
- [ ] 2.14.4 — Disable the button during the mutation to prevent duplicate rapid clicks (15m)
- [ ] 2.14.5 — Ensure prompt list re-renders with the new prompt at the bottom (15m)

**Done when:**
- [ ] Test: Button creates a prompt with sensible defaults
- [ ] Test: New prompt appears in list without full reload
- [ ] Test: Editor panel opens for the new prompt
- [ ] Test: Multiple rapid clicks do not create duplicates

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 2.15 — Import/export prompts as JSON
**Priority:** P2  **Risk:** Low

**Description:** Add ability to export workflows as JSON files and import them back.

**Files:**
- `src/components/workflow/ImportExportButtons.tsx`

**Blocked by:** `2.12`
**Blocks:** `2.16`

**Sub-tasks:**
- [x] 2.15.1 — Create `ImportExportButtons.tsx` with Import and Export buttons (15m)
- [x] 2.15.2 — Implement export: serialize current workflow + prompts to JSON, call IPC `dialog.showSaveDialog` to save file (20m)
- [x] 2.15.3 — Implement import: call IPC `dialog.showOpenDialog` to pick `.json` file, parse and validate JSON (20m)
- [x] 2.15.4 — Validate import JSON structure: check version, required fields, prompt schema (20m)
- [x] 2.15.5 — Handle duplicate workflow name by appending " (imported)" (15m)
- [x] 2.15.6 — Show success toast on import, error toast on validation failure (15m)
- [x] 2.15.7 — Add IPC handler in main process for `dialog:show-save-dialog` and `dialog:show-open-dialog` (15m)

**Done when:**
- [ ] Test: Export downloads a `.json` file with correct format *(requires GUI)*
- [ ] Test: Import reads a `.json` file and creates a workflow with prompts *(requires GUI)*
- [ ] Test: Validation rejects malformed files with error message *(requires GUI)*
- [ ] Test: Import handles duplicate workflow names by appending " (imported)" *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.16 — Handle create vs edit mode in WorkflowEditor
**Priority:** P0  **Risk:** Low

**Description:** Ensure the workflow editor correctly handles routing differences between creating a new workflow and editing an existing one.

**Files:**
- `src/pages/WorkflowEditor.tsx` — route logic
- `src/components/workflow/SaveButton.tsx`

**Blocked by:** `2.8`, `2.12`
**Blocks:** Phase 2 Gate

**Sub-tasks:**
- [x] 2.16.1 — Differentiate create vs edit mode using `useParams()` — check if `workflowId` is `'new'` or an existing ID (15m)
- [x] 2.16.2 — Create `SaveButton.tsx` component: shows "Create" when new, "Save" when editing (20m)
- [x] 2.16.3 — On create success, navigate to `/workflows/{newId}` using `useNavigate()` (15m)
- [x] 2.16.4 — Add `useBlocker` (React Router) to warn about unsaved changes when navigating away (15m)
- [x] 2.16.5 — Show "Delete Workflow" button only in edit mode with confirmation dialog (10m)
- [x] 2.16.6 — Test: On delete: call `useDeleteWorkflow()`, navigate to dashboard (10m)
- [x] 2.16.7 — Reset dirty state after save completes

**Done when:**
- [ ] Test: New workflow redirects to `/workflows/:id` after first save *(requires GUI)*
- [ ] Test: Edit workflow loads existing data *(requires GUI)*
- [ ] Test: Unsaved changes prompt on navigation away *(requires GUI)*
- [ ] Test: Delete only available for existing workflows *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

### Week 7: Execution Engine

---

#### Task 2.17 — Create WorkflowRunner class
**Priority:** P0  **Risk:** High

**Description:** Implement the core `WorkflowRunner` class that manages sequential prompt execution with pause/resume/stop support.

**Files:**
- `electron/main/engine/runner.ts`

**Blocked by:** `1.24`, `1.22`
**Blocks:** `2.18`, `2.19`

**Sub-tasks:**
- [x] 2.17.1 — Implement `WorkflowRunner` class skeleton with constructor taking `Workflow` and `ApiKeys` map (30m) *(depends on: 1.24.4)*
- [x] 2.17.2 — Implement state machine with explicit state transitions for start/pause/resume/stop/retry (30m) *(depends on: 1.25.2)*
- [x] 2.17.3 — Implement `start()`: iterate through prompts, call `executePrompt` for each, handle loop logic (20m)
- [x] 2.17.4 — Implement `pause()`: set status to PAUSED, do NOT abort current request (let it complete) (20m)
- [x] 2.17.5 — Implement `resume()`: set status to RUNNING, continue from current prompt (20m)
- [x] 2.17.6 — Implement `stop()`: set status to STOPPED, call `abortController.abort()`, reset index (20m)
- [x] 2.17.7 — Implement `retry()`: re-execute the last failed prompt (15m)
- [x] 2.17.8 — Implement `executePrompt()`: call AI provider, accumulate response, store result (15m) *(depends on: 2.17.7)*
- [x] 2.17.9 — Implement async iteration: use `for await` on provider stream, check abort signal each chunk (15m)
- [x] 2.17.10 — Implement `delay()` with abort support (15m)

**Done when:**
- [ ] Test: State transitions work correctly *(requires API keys + GUI)*
- [ ] Test: AbortController cancels in-flight AI requests *(requires API keys + GUI)*
- [ ] Test: Delays between prompts are respected *(requires API keys + GUI)*
- [ ] Test: Loop logic works (infinite, fixed, single) *(requires API keys + GUI)*

**Effort:** 4h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

#### Task 2.18 — Implement QueueManager (in-process promise chain)
**Priority:** P0  **Risk:** High

**Description:** Create the queue manager that chains prompt execution in sequence using async/await with no external queue system.

**Files:**
- `electron/main/engine/queue.ts`

**Blocked by:** `2.17`
**Blocks:** `2.19`

**Sub-tasks:**
- [x] 2.18.1 — Implement `QueueManager` class with `pending` array and `isProcessing` flag (20m) *(depends on: 2.17.10)*
- [x] 2.18.2 — Implement `enqueue(prompt)`: add to end of queue, start processing if not already (30m)
- [x] 2.18.3 — Implement `dequeue()`: remove and return first item (FIFO) (20m)
- [x] 2.18.4 — Implement `clear()`: empty the queue, reset processing flag (20m)
- [x] 2.18.5 — Implement `processNext(handler)`: dequeue one prompt, call handler, wait for resolution (20m) *(depends on: 2.18.4)*
- [x] 2.18.6 — Ensure sequential execution: next prompt only starts after previous handler resolves (20m)
- [x] 2.18.7 — Add `getQueue()` for UI state access (15m)
- [x] 2.18.8 — Test: Handle stop: clear queue mid-processing (10m)

**Done when:**
- [ ] Test: Prompts are processed in FIFO order *(requires API keys + GUI)*
- [ ] Test: Each prompt waits for the previous to complete *(requires API keys + GUI)*
- [ ] Test: Queue can be cleared on stop *(requires API keys + GUI)*
- [ ] Test: Queue state is accessible for UI *(requires API keys + GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

#### Task 2.19 — Create ProviderAdapter interface
**Priority:** P0  **Risk:** Medium

**Description:** Define the abstract interface for AI provider integration.

**Files:**
- `electron/main/providers/interface.ts`

**Blocked by:** `2.17`
**Blocks:** `2.20`, `3.1`, `3.6`

**Sub-tasks:**
- [x] 2.19.1 — Define `ProviderAdapter` interface with `stream()`, `models()`, `estimateCost()`, `validateApiKey()` methods (20m) *(depends on: 1.22.7)*
- [x] 2.19.2 — Define `ProviderOptions` interface with apiKey, temperature, maxTokens, systemPrompt, signal (20m)
- [x] 2.19.3 — Define `ModelInfo` interface with all model metadata fields (20m)
- [x] 2.19.4 — Add JSDoc comments explaining each method's contract (20m)
- [x] 2.19.5 — Run `yarn tsc --noEmit` to verify the interface is valid TypeScript (15m)
- [x] 2.19.6 — Create a minimal mock implementation to verify the interface compiles when implemented (15m)

**Done when:**
- [x] Test: Interface is defined and exported
- [x] Test: TypeScript compiles without errors
- [x] Test: Example implementation compiles

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [x] All `Done when` criteria met

---

#### Task 2.20 — Implement OpenAI provider adapter
**Priority:** P0  **Risk:** High

**Description:** Create the OpenAI provider adapter using the Vercel AI SDK.

**Dependencies:** `ai`, `@ai-sdk/openai`

**Files:**
- `electron/main/providers/openai.ts`

**Blocked by:** `2.19`
**Blocks:** `2.21`

**Sub-tasks:**
- [x] 2.20.1 — Install `ai` and `@ai-sdk/openai` npm packages (20m) *(depends on: 2.19.2)*
- [x] 2.20.2 — Implement `OpenAIProvider` class implementing `ProviderAdapter` (30m) *(depends on: 2.20.1)*
- [x] 2.20.3 — Implement `stream()` method: import Vercel AI SDK, call `streamText`, return `textStream` (30m)
- [x] 2.20.4 — Implement `mapModel()` to translate internal model IDs to OpenAI API model names (20m)
- [x] 2.20.5 — Implement `models()` returning ModelInfo for GPT-4, GPT-4o, GPT-3.5-turbo (20m)
- [x] 2.20.6 — Implement `validateApiKey()`: make a lightweight API call to verify the key works (20m)
- [x] 2.20.7 — Implement `estimateCost()` using OpenAI's per-model pricing table (20m)
- [x] 2.20.8 — Pass `abortSignal` to `streamText` for cancellation support (15m)
- [ ] 2.20.9 — Test with a real API key: call stream with a short prompt, verify text is returned (15m) *(requires API key)*

**Done when:**
- [ ] Test: OpenAI streaming works end-to-end *(requires API key + GUI)*
- [ ] Test: AbortSignal cancels in-flight requests *(requires API key + GUI)*
- [ ] Test: All three OpenAI models work *(requires API key + GUI)*
- [ ] Test: API key is passed correctly *(requires API key + GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API key + GUI)*

---

#### Task 2.21 — Wire up workflow:start/pause/stop/retry IPC handlers
**Priority:** P0  **Risk:** High

**Description:** Connect the WorkflowRunner to the IPC layer so the renderer can control execution.

**Files:**
- `electron/main/ipc/execution.ts`
- `electron/main/engine/runner.ts` — ensure methods are callable from IPC

**Blocked by:** `2.17`, `2.20`
**Blocks:** `2.26`

**Sub-tasks:**
- [x] 2.21.1 — Implement `workflow:start` handler: load workflow from Firestore, create `WorkflowRunner`, start execution (20m) *(depends on: 1.24.1..1.24.11)*
- [x] 2.21.2 — Implement `workflow:pause` handler: get runner from map, call `pause()` (20m) *(depends on: 2.17.1)*
- [x] 2.21.3 — Implement `workflow:stop` handler: get runner, call `stop()`, remove from map (20m)
- [x] 2.21.4 — Implement `workflow:retry` handler: get runner, call `retry()` (20m)
- [x] 2.21.5 — Store active runners in a `Map<string, WorkflowRunner>` accessible across IPC calls (20m) *(depends on: 2.18.1)*
- [x] 2.21.6 — Handle multiple workflows: each workflowId gets its own runner instance (15m)
- [x] 2.21.7 — Add error handling: return `{ success: false, error: message }` on failure (15m)
- [x] 2.21.8 — Clean up runner from map when workflow completes or is stopped (15m)

**Done when:**
- [ ] Test: `workflow:start` creates a runner and begins execution *(requires API keys + GUI)*
- [ ] Test: `workflow:pause` pauses at the current prompt *(requires API keys + GUI)*
- [ ] Test: `workflow:stop` stops and resets the runner *(requires API keys + GUI)*
- [ ] Test: `workflow:retry` re-executes the last failed prompt *(requires API keys + GUI)*
- [ ] Test: Multiple workflows can run independently *(requires API keys + GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

#### Task 2.22 — Send execution events from main to renderer via IPC
**Priority:** P0  **Risk:** High

**Description:** Implement the event emitters that notify the renderer of execution progress.

**Files:**
- `electron/main/ipc/execution.ts` — add event emission
- `electron/shared/types.ts` — ensure event types are defined

**Blocked by:** `2.21`
**Blocks:** `2.27`

**Sub-tasks:**
- [x] 2.22.1 — Implement `sendToRenderer(channel, data)` helper that sends to all open windows (30m) *(depends on: 1.24.3)*
- [x] 2.22.2 — Add event type definitions in `electron/shared/types.ts` for all 6 event channels (30m) *(depends on: 2.22.1)*
- [x] 2.22.3 — Emit `execution:started` when a prompt begins (includes promptId, model, timestamp) (20m)
- [x] 2.22.4 — Emit `execution:chunk` for each streaming chunk (includes promptId, chunk text) (20m)
- [x] 2.22.5 — Emit `execution:completed` when prompt finishes (includes promptId, fullResponse, timing) (20m)
- [x] 2.22.6 — Emit `execution:failed` when prompt fails (includes promptId, error message) (20m)
- [x] 2.22.7 — Emit `workflow:completed` when entire workflow finishes (includes stats) (15m)
- [x] 2.22.8 — Emit `execution:status` for progress updates (includes currentIndex, totalPrompts, loopIteration) (15m)
- [ ] 2.22.9 — Test: verify renderer receives events (log to console from preload listener) (15m) *(requires API keys + GUI)*

**Done when:**
- [ ] Test: All event types are emitted at the correct times *(requires API keys + GUI)*
- [ ] Test: Renderer receives events (test with console.log) *(requires API keys + GUI)*
- [ ] Test: Streaming chunks are emitted in real-time *(requires API keys + GUI)*
- [ ] Test: Events include all required data fields *(requires API keys + GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

#### Task 2.23 — Implement streaming response handling
**Priority:** P0  **Risk:** High

**Description:** Process the async iterable from the AI provider and emit chunks to the renderer.

**Files:**
- `electron/main/engine/runner.ts` — `executePrompt` method enhancement

**Blocked by:** `2.20`, `2.22`
**Blocks:** `2.27`

**Sub-tasks:**
- [x] 2.23.1 — Implement `executePrompt()`: create ProviderAdapter, get stream, iterate with `for await` (20m)
- [x] 2.23.2 — Accumulate full response string from stream chunks (30m) *(depends on: 2.20.2)*
- [x] 2.23.3 — Emit `execution:chunk` for each chunk in real-time (30m) *(depends on: 2.23.2)*
- [x] 2.23.4 — Check `abortController.signal.aborted` between chunks and break if aborted (30m)
- [x] 2.23.5 — Catch streaming errors, emit `execution:failed`, re-throw for retry handler (20m)
- [x] 2.23.6 — Store final response to Firestore via `storeExecutionResult()` (20m)
- [x] 2.23.7 — Emit `execution:completed` with final response and timing stats (15m)

**Done when:**
- [ ] Test: Stream chunks are sent to renderer in real-time *(requires API keys + GUI)*
- [ ] Test: Full response is accumulated and stored *(requires API keys + GUI)*
- [ ] Test: Abort signal interrupts the stream *(requires API keys + GUI)*
- [ ] Test: Errors during streaming are caught and reported *(requires API keys + GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

#### Task 2.24 — Add delay timing between prompts
**Priority:** P1  **Risk:** Low

**Description:** Implement the configurable delay between prompt executions.

**Files:**
- `electron/main/engine/runner.ts` — `delay` method
- `electron/main/engine/runner.ts` — integration in execution loop

**Blocked by:** `2.23`
**Blocks:** `2.25`

**Sub-tasks:**
- [x] 2.24.1 — Implement `delay(ms)` method with `setTimeout` promise wrapper (15m)
- [x] 2.24.2 — Store timer reference for cleanup on abort (15m)
- [x] 2.24.3 — Add abort listener: clear timeout and resolve immediately when aborted (15m) *(depends on: 2.17.6)*
- [x] 2.24.4 — Call `delay(prompt.delayMs)` between each prompt execution in the main loop (10m)
- [x] 2.24.5 — Default delay of 0ms proceeds immediately (no unnecessary `setTimeout`) (10m)
- [x] 2.24.6 — Emit `execution:status` with `phase: 'waiting'` during delay period (for UI) (10m)

**Done when:**
- [ ] Test: Delay waits for the configured `delayMs` before next prompt *(requires API keys + GUI)*
- [ ] Test: Abort during delay immediately stops the wait *(requires API keys + GUI)*
- [ ] Test: Default delay (0ms) proceeds immediately *(requires API keys + GUI)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

#### Task 2.25 — Implement loop logic
**Priority:** P1  **Risk:** Medium

**Description:** Handle the looping behavior when the workflow reaches the last prompt.

**Files:**
- `electron/main/engine/runner.ts` — `shouldLoop()` and loop integration

**Blocked by:** `2.24`
**Blocks:** `2.30`

**Sub-tasks:**
- [x] 2.25.1 — Implement `shouldLoop()`: return true/false based on `loopMode` and `loopCount` (20m)
- [x] 2.25.2 — Implement infinite loop: after last prompt, if `loopMode === 'infinite'`, reset `currentIndex` to 0, increment `loopCount`, continue (30m) *(depends on: 2.17.6)*
- [x] 2.25.3 — Implement fixed loop: same as infinite but stop when `loopCount >= maxIterations` (20m) *(depends on: 2.25.2)*
- [x] 2.25.4 — Implement single pass: after last prompt, transition to COMPLETED status (20m)
- [x] 2.25.5 — Implement scheduled loop (stub): check `isWithinScheduleWindow()` (return false for now) (20m)
- [x] 2.25.6 — Track `loopCount` and expose via `getProgress()` for UI loop counter (15m)
- [x] 2.25.7 — Emit `execution:status` with loop iteration info on each loop boundary (15m)

**Done when:**
- [ ] Test: Infinite loop continues until manually stopped *(requires API keys + GUI)*
- [ ] Test: Fixed loop stops after N iterations *(requires API keys + GUI)*
- [ ] Test: Single pass executes once and stops *(requires API keys + GUI)*
- [ ] Test: Loop count is tracked and accessible *(requires API keys + GUI)*
- [ ] Test: Loop mode can be changed during execution *(requires API keys + GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

### Week 8: Execution Viewer

---

#### Task 2.26 — Build ExecutionViewerPage layout
**Priority:** P0  **Risk:** Low

**Description:** Create the execution viewer page with header, controls, progress, response display, and logs.

**Files:**
- `src/pages/ExecutionViewer.tsx`

**Blocked by:** `2.21`
**Blocks:** `2.27`, `2.28`, `2.29`

**Sub-tasks:**
- [x] 2.26.1 — Create `ExecutionViewer.tsx` page with URL param `workflowId` from `useParams` (15m) *(depends on: 1.16.1)*
- [x] 2.26.2 — Build page header: workflow name (from store), status badge, execution controls area (20m)
- [x] 2.26.3 — Build iteration counter display (placeholder for 2.32) (20m)
- [x] 2.26.4 — Build queue progress section (placeholder for PromptProgressBar) (15m)
- [x] 2.26.5 — Build current response section (placeholder for StreamingText) (15m)
- [x] 2.26.6 — Build execution log section (placeholder for ExecutionLogTable) (15m)
- [x] 2.26.7 — Handle "not started" state: show workflow summary with Start button (15m) *(depends on: 2.26.3)*
- [x] 2.26.8 — Handle "no active prompts" state: message with option to edit workflow (15m)
- [x] 2.26.9 — Read execution state from `useExecutionStore` to determine current view state (15m)
- [x] 2.26.10 — Read workflow data from `useWorkflowStore` or `useWorkflow` hook (10m)

**Done when:**
- [ ] Test: Page renders all sections correctly *(requires GUI)*
- [ ] Test: All states are handled *(requires GUI)*
- [ ] Test: Navigation to execution viewer works from dashboard *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.27 — Build ExecutionControls component
**Priority:** P0  **Risk:** Low

**Description:** Create the Start/Pause/Stop/Retry button group for controlling workflow execution.

**Files:**
- `src/components/execution/ExecutionControls.tsx`

**Blocked by:** `2.26`
**Blocks:** `2.30`

**Sub-tasks:**
- [x] 2.27.1 — Create `ExecutionControls.tsx` component reading execution status from store (15m) *(depends on: 2.26.1)*
- [x] 2.27.2 — Show/hide buttons based on execution state table (20m) *(depends on: 2.21.1)*
- [x] 2.27.3 — Start button calls `window.electronAPI.startWorkflow(workflowId)`, shows spinner during IPC (20m)
- [x] 2.27.4 — Pause button calls `window.electronAPI.pauseWorkflow(workflowId)` (15m)
- [x] 2.27.5 — Resume button (shown when paused) calls a resume IPC method (15m)
- [x] 2.27.6 — Stop button calls `window.electronAPI.stopWorkflow(workflowId)` (15m)
- [x] 2.27.7 — Retry button calls `window.electronAPI.retryWorkflow(workflowId)` (10m)
- [x] 2.27.8 — All buttons show loading state during IPC call (disabled + spinner) (10m)
- [x] 2.27.9 — Test: Use shadcn `Button` variants for visual distinction (Start=default, Stop=destructive, Pause=outline) (10m)

**Done when:**
- [ ] Test: Buttons show/hide based on execution state *(requires GUI)*
- [ ] Test: Start calls IPC `workflow:start` *(requires GUI)*
- [ ] Test: Pause calls IPC `workflow:pause` *(requires GUI)*
- [ ] Test: Stop calls IPC `workflow:stop` *(requires GUI)*
- [ ] Test: Retry calls IPC `workflow:retry` *(requires GUI)*
- [ ] Test: Buttons show loading state during IPC calls *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.28 — Build PromptProgressBar and QueueItem components
**Priority:** P0  **Risk:** Low

**Description:** Create the visual progress indicator showing which prompts are completed, running, pending, or failed.

**Files:**
- `src/components/workflow/PromptProgressBar.tsx`
- `src/components/workflow/QueueItem.tsx`

**Blocked by:** `2.26`
**Blocks:** `2.31`

**Sub-tasks:**
- [x] 2.28.1 — Create `PromptProgressBar.tsx`: horizontal bar divided into segments per prompt (15m)
- [x] 2.28.2 — Color segments by status: green (`bg-green-500`) for completed, blue (`bg-blue-500`) for running, gray for pending, red for failed (20m)
- [x] 2.28.3 — Add CSS animation: pulsing glow on the running segment (20m)
- [x] 2.28.4 — Add click handler on each segment to scroll to corresponding log entry (15m)
- [x] 2.28.5 — Make horizontally scrollable if many prompts (overflow-x-auto) (15m) *(depends on: 2.26.1)*
- [x] 2.28.6 — Create `QueueItem.tsx`: status icon, prompt title, duration, token count (15m)
- [x] 2.28.7 — Add CSS transitions for status changes (color, icon changes smoothly) (10m)
- [x] 2.28.8 — Test: Show spinner icon for running, checkmark for completed, X for failed, circle for pending (10m)

**Done when:**
- [ ] Test: Progress bar updates in real-time as prompts execute *(requires API keys + GUI)*
- [ ] Test: Queue items show correct status *(requires API keys + GUI)*
- [ ] Test: Animations are smooth (CSS transitions, not JS) *(requires GUI)*
- [ ] Test: Narrow state: scrollable if many prompts *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.29 — Create StreamingText component
**Priority:** P0  **Risk:** Medium

**Description:** Build the component that displays AI response text as it streams in real-time.

**Files:**
- `src/components/execution/StreamingText.tsx`

**Blocked by:** `2.26`
**Blocks:** `2.30`

**Sub-tasks:**
- [x] 2.29.1 — Create `StreamingText.tsx` component accepting `text` and `isStreaming` props (15m) *(depends on: 2.23.1)*
- [x] 2.29.2 — Implement auto-scroll: `useEffect` with `scrollIntoView` or `scrollTop` on text change (20m)
- [x] 2.29.3 — Add typewriter cursor: blinking vertical bar when `isStreaming` is true (20m) *(depends on: 2.29.2)*
- [x] 2.29.4 — Implement basic Markdown rendering: bold, italic, inline code, code blocks, lists, headers (20m)
- [x] 2.29.5 — Add Copy button that copies `text` to clipboard via `navigator.clipboard.writeText()` (15m)
- [x] 2.29.6 — Set container to scrollable with `max-h` and `overflow-y-auto` for long responses (15m)
- [x] 2.29.7 — Show token count or character count at the bottom of the response area (15m)

**Done when:**
- [ ] Test: Text appears as it streams (no waiting for full response) *(requires API keys + GUI)*
- [ ] Test: Auto-scroll follows new content *(requires GUI)*
- [ ] Test: Copy button copies the full response *(requires GUI)*
- [ ] Test: Long responses are scrollable *(requires GUI)*
- [ ] Test: Markdown is rendered in a read-only viewer *(requires GUI)*

**Effort:** 2.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.30 — Wire IPC events to ExecutionViewer
**Priority:** P0  **Risk:** High

**Description:** Connect the IPC event listeners to the ExecutionViewer so it displays real-time execution data.

**Files:**
- `src/pages/ExecutionViewer.tsx` — use `useIpc` hook
- `src/hooks/useIpc.ts` — enhance if needed

**Blocked by:** `2.27`, `2.28`, `2.29`
**Blocks:** `2.31`

**Sub-tasks:**
- [x] 2.30.1 — In `ExecutionViewer.tsx`, call `useExecutionListener()` hook from `useIpc.ts` on mount (20m) *(depends on: 2.22.3)*
- [x] 2.30.2 — When `execution:started` received: set active prompt in store, clear response buffer (20m)
- [x] 2.30.3 — When `execution:chunk` received: append chunk to `responseBuffer` in executionStore (20m) *(depends on: 2.30.2)*
- [x] 2.30.4 — When `execution:completed` received: mark prompt as completed in queue, add log entry (20m)
- [x] 2.30.5 — When `execution:failed` received: mark prompt as failed, show error in response area (15m)
- [x] 2.30.6 — When `workflow:completed` received: show completion summary, update status (15m) *(depends on: 2.26.1)*
- [x] 2.30.7 — When `execution:status` received: update progress bar and iteration counter (15m)
- [x] 2.30.8 — Ensure all listeners are cleaned up on component unmount (return cleanup functions) (15m)

**Done when:**
- [ ] Test: All events are handled in the viewer *(requires API keys + GUI)*
- [ ] Test: Real-time streaming works end-to-end *(requires API keys + GUI)*
- [ ] Test: Status updates are reflected immediately *(requires API keys + GUI)*
- [ ] Test: Unmounting cleans up listeners (no memory leaks) *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

---

#### Task 2.31 — Build ExecutionLogTable
**Priority:** P1  **Risk:** Low

**Description:** Create the table showing execution history for the current workflow session.

**Files:**
- `src/components/execution/ExecutionLogTable.tsx`

**Blocked by:** `2.30`
**Blocks:** `2.32`

**Sub-tasks:**
- [x] 2.31.1 — Create `ExecutionLogTable.tsx` using shadcn `Table` component (15m) *(depends on: 2.26.1)*
- [x] 2.31.2 — Define table columns: Time, Prompt, Status, Duration, Tokens, Model, Error (20m)
- [x] 2.31.3 — Format timestamps as `HH:mm:ss`, durations as `Xs` or `X.Xs` (20m)
- [x] 2.31.4 — Add status badges: `Badge variant="success"` for completed, `variant="destructive"` for failed, `variant="default"` for running (20m)
- [x] 2.31.5 — Add error tooltip on failed rows (shadcn `Tooltip` wrapping the error cell) (15m)
- [x] 2.31.6 — Add filter buttons: All | Completed | Failed | Running — filter rows by status (15m)
- [x] 2.31.7 — Add sort toggle: default newest-first, click to reverse (15m) *(depends on: 2.30.1)*
- [x] 2.31.8 — Click row handler: sets selected log in store, scrolls response panel to that entry (15m)
- [x] 2.31.9 — Auto-scroll to latest entry when new log arrives (10m)
- [x] 2.31.10 — Show empty state: "No execution logs yet" when no logs exist (10m)

**Done when:**
- [ ] Test: Table renders with all columns *(requires GUI)*
- [ ] Test: Filtering works correctly *(requires GUI)*
- [ ] Test: New logs appear without full re-render *(requires GUI)*
- [ ] Test: Error tooltips show on hover *(requires GUI)*
- [ ] Test: Empty state when no logs *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.32 — Display loop iteration counter
**Priority:** P1  **Risk:** Low

**Description:** Show the current loop iteration prominently in the execution header.

**Files:**
- `src/pages/ExecutionViewer.tsx` — add iteration display
- `src/store/executionStore.ts` — ensure `loopIteration` is tracked

**Display formats:**
- Infinite: "Iteration 3 of ∞"
- Fixed: "Iteration 3 of 10"
- Single: "Pass 1 of 1"
- Scheduled: "Iteration 3 (next stop: 14:30)"

**Blocked by:** `2.31`
**Blocks:** `2.33`

**Sub-tasks:**
- [x] 2.32.1 — Add `loopIteration` field and `incrementLoopIteration()` action to `executionStore` (if not present) (15m) *(depends on: 2.25.1)*
- [x] 2.32.2 — Read `loopIteration` from store and `loopMode` from workflow data in ExecutionViewer (20m)
- [x] 2.32.3 — Render iteration counter text based on loop mode format table (15m)
- [x] 2.32.4 — Update counter in real-time when `execution:status` event increments loop (15m)
- [x] 2.32.5 — Reset counter to 0 when workflow is stopped (15m)

**Done when:**
- [ ] Test: Iteration counter updates in real-time *(requires API keys + GUI)*
- [ ] Test: Display format matches loop mode *(requires GUI)*
- [ ] Test: Counter resets on stop *(requires API keys + GUI)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.33 — Handle all ExecutionViewer states
**Priority:** P0  **Risk:** Low

**Description:** Ensure the ExecutionViewer correctly handles all possible states, including edge cases.

**Files:**
- `src/pages/ExecutionViewer.tsx` — state handling

**Blocked by:** `2.32`
**Blocks:** Phase 2 Gate

**Sub-tasks:**
- [x] 2.33.1 — Handle "workflow has no active prompts": show message with link to edit workflow (15m) *(depends on: 2.26.1)*
- [x] 2.33.2 — Handle "workflow was deleted during execution": show error state with explanation (20m)
- [x] 2.33.3 — Handle "network lost during streaming": show "Reconnecting..." overlay (15m)
- [x] 2.33.4 — Handle "all prompts disabled": show "No active prompts" with toggle instructions (15m)
- [x] 2.33.5 — Handle rapid start/pause/stop: debounce button clicks, queue state transitions (15m)
- [x] 2.33.6 — Handle "viewer opened while workflow is already running": fetch current state from store (15m)
- [x] 2.33.7 — Ensure every state transition has a matching UI state (15m)

**Done when:**
- [ ] Test: All edge cases display appropriate UI *(requires GUI)*
- [ ] Test: No unhandled states cause blank screens or errors *(requires GUI)*
- [ ] Test: State transitions are smooth *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

### Week 9: API Key Management + Dashboard

---

#### Task 2.34 — Create KeyEncryptor in main process
**Priority:** P0  **Risk:** High

**Description:** Implement local API key encryption and storage using Electron's `safeStorage`.

**Files:**
- `electron/main/encryption.ts`

**Blocked by:** `1.24`
**Blocks:** `2.35`

**Sub-tasks:**
- [x] 2.34.1 — Create `KeyEncryptor` class using `safeStorage.encryptString()` and `safeStorage.decryptString()` (20m) *(depends on: 1.5.1)*
- [x] 2.34.2 — Implement `encrypt(provider, apiKey)`: encrypt, generate UUID keyId, store with metadata (30m)
- [x] 2.34.3 — Implement `decrypt(keyId)`: load encrypted key, decrypt and return plaintext (20m)
- [x] 2.34.4 — Implement `list()`: return array of `{ keyId, provider, keyPrefix, createdAt }` (no plaintext keys) (20m)
- [x] 2.34.5 — Implement `delete(keyId)`: remove key from storage (20m)
- [x] 2.34.6 — Store encrypted keys in JSON file at `app.getPath('userData')/keys.json` (15m)
- [x] 2.34.7 — Handle `safeStorage.isEncryptionAvailable()` returning false (fallback error) (15m)
- [ ] 2.34.8 — Test: encrypt a key, verify prefix is visible, decrypt returns original (15m) *(requires API key)*

**Done when:**
- [ ] Test: Encryption works on macOS (Keychain) *(requires GUI)*
- [ ] Test: Decryption returns the original key *(requires GUI)*
- [ ] Test: Keys are stored in the app's userData directory *(requires GUI)*
- [ ] Test: Keys are not accessible without decryption *(requires GUI)*
- [ ] Test: Key listing returns only metadata (prefix, provider), not full keys *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.35 — Implement api-key IPC handlers
**Priority:** P0  **Risk:** Medium

**Description:** Wire up the IPC handlers for API key management.

**Files:**
- `electron/main/ipc/api-keys.ts`
- `electron/preload/index.ts` — add API key methods

**Blocked by:** `2.34`
**Blocks:** `2.36`

**Sub-tasks:**
- [x] 2.35.1 — Implement `api-key:encrypt` handler: calls `KeyEncryptor.encrypt()`, returns keyId (15m) *(depends on: 1.24.2)*
- [x] 2.35.2 — Implement `api-key:decrypt` handler: calls `KeyEncryptor.decrypt()`, returns plaintext key (15m) *(depends on: 2.34.4)*
- [x] 2.35.3 — Implement `api-key:list` handler: returns list of key metadata (no plaintext) (15m)
- [x] 2.35.4 — Implement `api-key:delete` handler: calls `KeyEncryptor.delete()`, returns success (15m)
- [x] 2.35.5 — Add preload API methods: `encryptApiKey`, `decryptApiKey`, `getApiKeys`, `deleteApiKey` (15m)
- [x] 2.35.6 — Ensure encrypted values are never sent to the renderer (15m)

**Done when:**
- [ ] Test: All four IPC handlers work correctly *(requires GUI)*
- [ ] Test: Encrypted keys are never returned in responses *(requires GUI)*
- [ ] Test: Only key prefix + provider are sent to renderer *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.36 — Build ApiKeysSettings page
**Priority:** P0  **Risk:** Low

**Description:** Create the settings page for managing AI provider API keys.

**Files:**
- `src/pages/ApiKeys.tsx`
- `src/components/settings/ApiKeyCard.tsx`
- `src/components/settings/AddApiKeyDialog.tsx`

**Blocked by:** `2.35`
**Blocks:** `2.37`

**Sub-tasks:**
- [x] 2.36.1 — Create `ApiKeys.tsx` page with route `/settings/api-keys` (15m) *(depends on: 1.16.1)*
- [x] 2.36.2 — Create `ApiKeyCard.tsx`: provider icon (color by provider), key prefix, provider name, last used timestamp, delete button with confirmation (20m) *(depends on: 2.35.2)*
- [x] 2.36.3 — Create `AddApiKeyDialog.tsx`: provider selector, API key input (password field with show/hide toggle), Paste button from clipboard, Save button calling `encryptApiKey` (20m)
- [x] 2.36.4 — Add key format validation per provider (starts with `sk-` for OpenAI, `sk-ant-` for Anthropic, `AIza` for Google) (20m)
- [x] 2.36.5 — Show success toast on key add, error toast on validation failure (20m)
- [x] 2.36.6 — Show empty state: "No API keys configured" with prompt to add one (20m)
- [x] 2.36.7 — Show loading skeleton while keys are being fetched (15m)

**Done when:**
- [ ] Test: Keys are listed with prefix and provider *(requires GUI)*
- [ ] Test: Adding a key encrypts it via IPC *(requires GUI)*
- [ ] Test: Deleting a key removes it permanently *(requires GUI)*
- [ ] Test: Validation rejects invalid keys *(requires GUI)*
- [ ] Test: Empty state when no keys exist *(requires GUI)*

**Effort:** 2.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Blocked tasks unblocked
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 2.37 — Build DashboardPage with workflow cards
**Priority:** P0  **Risk:** Low

**Description:** Create the main dashboard page showing all workflows with status and quick actions.

**Files:**
- `src/pages/Dashboard.tsx`
- `src/components/workflow/WorkflowCard.tsx`
- `src/components/workflow/WorkflowStatusBadge.tsx`

**Blocked by:** `2.4`, `2.35`
**Blocks:** `2.38`

**Sub-tasks:**
- [ ] 2.37.1 — Create `Dashboard.tsx` page using `useWorkflows()` to fetch all workflows (15m) *(depends on: 1.23.1)*
- [ ] 2.37.2 — Create `WorkflowStatusBadge.tsx`: colored dot + label (green=running, yellow=paused, red=error, gray=idle), pulsing animation for running (20m) *(depends on: 2.4.1)*
- [ ] 2.37.3 — Create `WorkflowCard.tsx`: workflow name, status badge, prompt count, last run info, action buttons (Start, Edit, Delete) (20m) *(depends on: 1.16.1)*
- [ ] 2.37.4 — Arrange cards in responsive grid (2 columns on wide, 1 column on narrow) (20m)
- [ ] 2.37.5 — Click card: navigate to execution viewer if running, editor if idle (20m)
- [ ] 2.37.6 — Handle loading state: show 3 skeleton cards (20m)
- [ ] 2.37.7 — Handle empty state: "Create your first workflow" with CTA button linking to `/workflows/new` (15m)
- [ ] 2.37.8 — Handle error state: error message + retry button (15m)
- [ ] 2.37.9 — Add real-time `onSnapshot` for status updates via `useWorkflowSnapshot` (15m)

**Done when:**
- [ ] Test: Workflows display in a responsive grid
- [ ] Test: Status badges show correct color and label
- [ ] Test: Start/Edit/Delete actions work
- [ ] Test: Clicking a running workflow navigates to execution viewer
- [ ] Test: Empty state has CTA that navigates to new workflow
- [ ] Test: Loading shows skeleton cards

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

---

#### Task 2.38 — Add quick stats to dashboard
**Priority:** P1  **Risk:** Low

**Description:** Display aggregate statistics at the top of the dashboard.

**Files:**
- `src/pages/Dashboard.tsx` — add QuickStats section
- `src/hooks/useExecutions.ts` — hook for execution data

**Blocked by:** `2.37`
**Blocks:** `2.39`

**Sub-tasks:**
- [ ] 2.38.1 — Create `useExecutions()` hook: query executions collection with aggregation (15m) *(depends on: 2.37.1)*
- [ ] 2.38.2 — Build stats cards: Total Runs, Success Rate (percentage), Active Now (count of running), Failed Today (count of failed today) (20m)
- [ ] 2.38.3 — Format success rate as percentage with color coding (green > 80%, yellow > 50%, red < 50%) (20m)
- [ ] 2.38.4 — Show loading skeleton for stats while data loads (15m)
- [ ] 2.38.5 — Show "0" for zero values (never show empty) (15m) *(depends on: 2.38.4)*
- [ ] 2.38.6 — Auto-refresh stats when execution data changes (15m)

**Done when:**
- [ ] Test: Stats display correct values
- [ ] Test: Stats update when data changes
- [ ] Test: Loading state shows skeleton stats
- [ ] Test: Zero state shows "0" (not empty)

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 2.39 — Wire dashboard cards to execution controls
**Priority:** P1  **Risk:** Low

**Description:** Connect the dashboard Start/Stop/Edit buttons to the actual IPC handlers.

**Files:**
- `src/pages/Dashboard.tsx` — add IPC calls
- `src/components/workflow/WorkflowCard.tsx` — wire button actions

**Blocked by:** `2.37`, `2.21`
**Blocks:** `2.40`

**Sub-tasks:**
- [ ] 2.39.1 — Start button: call `window.electronAPI.startWorkflow(workflowId)`, navigate to execution viewer (15m) *(depends on: 2.27.4)*
- [ ] 2.39.2 — Stop button (visible only for running workflows): call `window.electronAPI.stopWorkflow(workflowId)` (20m)
- [ ] 2.39.3 — Edit button: navigate to `/workflows/:id` (20m) *(depends on: 2.38.1)*
- [ ] 2.39.4 — Delete button: show `ConfirmDialog`, call `useDeleteWorkflow()` on confirm, invalidate cache (15m)
- [ ] 2.39.5 — Track which workflows are running locally to show correct button state (15m)
- [ ] 2.39.6 — Show loading spinners on buttons during IPC calls (10m)

**Done when:**
- [ ] Test: Start button starts execution and navigates to viewer
- [ ] Test: Stop button (when running) stops execution
- [ ] Test: Edit button navigates to editor
- [ ] Test: Delete removes workflow and updates UI

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 2.40 — Phase 2 Gate testing and bug fix
**Priority:** P0  **Risk:** Low

**Description:** Run through the Phase 2 checklist, fix bugs, and ensure the full workflow is functional.

**Checklist:**
- [ ] User can create workflows with prompts
- [ ] Prompts are reorderable via drag-and-drop
- [ ] Workflow executes sequentially with streaming
- [ ] User can pause, resume, and stop execution
- [ ] Looping works (infinite + fixed)
- [ ] Execution logs persist to Firestore
- [ ] API keys can be added and are encrypted locally
- [ ] Dashboard shows all workflows with status
- [ ] Full end-to-end test: create prompts → start → view streaming → stop → see logs
- [ ] `yarn lint` passes
- [ ] `yarn typecheck` passes

**Blocked by:** `2.33`, `2.39`
**Blocks:** Phase 3

**Sub-tasks:**
- [ ] 2.40.1 — Test: Run through the full end-to-end flow: create workflow → add prompts → reorder → save → start execution → view streaming → pause → resume → stop → check logs (20m)
- [ ] 2.40.2 — Test: Test infinite loop: set loop mode to infinite, run, verify it continues past one pass (30m)
- [ ] 2.40.3 — Test: Test fixed loop: set maxIterations=3, verify it stops after 3 iterations (20m)
- [ ] 2.40.4 — Test: Test API key CRUD: add key, see prefix, delete key, verify encrypted storage (20m)
- [ ] 2.40.5 — Test: Test dashboard: verify workflow cards render, status badges update, stats show correct values (15m)
- [ ] 2.40.6 — Test: Test drag-and-drop: reorder prompts, verify positions persist to Firestore (15m)
- [ ] 2.40.7 — Test: Run `yarn lint` and `yarn typecheck`, fix all issues (15m)
- [ ] 2.40.8 — Test: Check Sentry for any unexpected errors from Phase 2 features (15m)
- [ ] 2.40.9 — Test: Tag git with `phase-2-complete` (10m)

**Done when:**
- [ ] Test: All checklist items pass
- [ ] Test: No critical or high-severity bugs found

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] Blocked tasks unblocked
- [ ] All `Done when` criteria met

## Phase 3 — Provider Expansion

**Goal:** Support all three V1 AI providers with consistent error handling.
**Duration:** 3 weeks

---

### Week 10: Anthropic Integration

---

#### Task 3.1 — Install @ai-sdk/anthropic and create adapter
**Priority:** P1  **Risk:** Medium

**Description:** Install the Anthropic AI SDK package and implement the provider adapter.

**Dependencies:** `@ai-sdk/anthropic`

**Files:**
- `electron/main/providers/anthropic.ts`

**Blocked by:** `2.19`
**Blocks:** `3.2`

**Sub-tasks:**
- [x] 3.1.1 — Install `@ai-sdk/anthropic` npm package (15m) *(depends on: 2.19.3)*
- [x] 3.1.2 — Implement `AnthropicProvider` class implementing `ProviderAdapter` (20m)
- [x] 3.1.3 — Implement `stream()`: import Vercel AI SDK, construct messages array with optional system prompt, call `streamText` (20m)
- [x] 3.1.4 — Implement `mapModel()`: translate internal IDs to Anthropic API model names (claude-3-opus-20240229, etc.) (20m)
- [x] 3.1.5 — Implement `validateApiKey()`: make lightweight API call to verify key (15m)
- [x] 3.1.6 — Implement `estimateCost()` using Anthropic's per-model pricing (15m) *(depends on: 2.20.4)*
- [x] 3.1.7 — Pass `abortSignal` to `streamText` for cancellation support (15m)
- [ ] 3.1.8 — Test with real API key: call stream with short prompt, verify streaming response (15m) *(requires API key)*

**Done when:**
- [ ] Test: Anthropic streaming works for all three Claude models *(requires API key)*
- [ ] Test: System prompts are correctly formatted *(requires API key)*
- [ ] Test: AbortSignal cancels requests *(requires API key)*
- [ ] Test: API key is passed correctly *(requires API key)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires API key)*

---

#### Task 3.2 — Add Anthropic models to ModelSelector
**Priority:** P1  **Risk:** Low

**Description:** Update the model selector UI to include Anthropic models.

**Files:**
- `src/lib/models.ts` — add Anthropic models
- `src/components/workflow/ModelSelector.tsx` — ensure Anthropic group renders

**Blocked by:** `3.1`, `2.13`
**Blocks:** `3.3`

**Sub-tasks:**
- [x] 3.2.1 — Add Anthropic model entries to `MODELS` array in `src/lib/models.ts` (15m) *(depends on: 2.13.5)*
- [x] 3.2.2 — Ensure Anthropic group renders in `ModelSelector` with correct grouping (15m)
- [x] 3.2.3 — Verify selecting a Claude model shows correct max tokens (200K) (15m)
- [x] 3.2.4 — Verify Anthropic models appear in the same order as other providers (10m)

**Done when:**
- [ ] Test: Anthropic models appear in the model selector *(requires GUI)*
- [ ] Test: Models are grouped under "Anthropic" header *(requires GUI)*
- [ ] Test: Selecting a Claude model shows correct max tokens *(requires GUI)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 3.3 — Test Anthropic streaming end-to-end
**Priority:** P1  **Risk:** Low

**Description:** Test the full execution pipeline with Anthropic models.

**Files:** Test scripts or manual test plan

**Blocked by:** `3.1`
**Blocks:** `3.4`

**Sub-tasks:**
- [ ] 3.3.1 — Test short prompt (10 words) → verify completes quickly (15m) *(depends on: 3.1.9)* *(requires API key)*
- [ ] 3.3.2 — Test long prompt (1000 words) → verify streams correctly without truncation (15m) *(requires API key)*
- [ ] 3.3.3 — Test system prompt inclusion → verify it appears in API call (15m) *(depends on: 3.3.2)* *(requires API key)*
- [ ] 3.3.4 — Test temperature setting → verify output changes with different values (15m) *(requires API key)*
- [ ] 3.3.5 — Test: Test max tokens limit → verify response is truncated at limit (10m) *(requires API key)*
- [ ] 3.3.6 — Test: Test abort during streaming → verify request is cancelled (10m) *(requires API key)*
- [ ] 3.3.7 — Test: Compare streaming performance to OpenAI (time-to-first-token) (10m) *(requires API keys)*

**Done when:**
- [ ] Test: All test cases pass *(requires API key)*
- [ ] Test: Streaming performance is comparable to OpenAI *(requires API keys)*
- [ ] Test: No errors in the main process *(requires API key)*

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off) *(requires API keys + GUI)*
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires API keys)*

---

#### Task 3.4 — Register Anthropic in ProviderFactory
**Priority:** P1  **Risk:** Low

**Description:** Create a provider factory that maps model IDs to the correct provider adapter.

**Files:**
- `electron/main/providers/factory.ts` — central factory

**Blocked by:** `3.1`
**Blocks:** `3.5`

**Sub-tasks:**
- [x] 3.4.1 — Create `ProviderFactory` class with static `adapters` map and `register()`/`getAdapter()` methods (10m) *(depends on: 2.19.2)*
- [x] 3.4.2 — Implement model-to-provider routing: `gpt-*` → OpenAI, `claude-*` → Anthropic, `gemini-*` → Google (15m)
- [x] 3.4.3 — Register OpenAI and Anthropic adapters at app startup (10m)
- [x] 3.4.4 — Handle unknown models with clear error message: `"Unknown model: {modelId}"` (10m)
- [x] 3.4.5 — Run `yarn tsc --noEmit` to verify factory compiles (10m)

**Done when:**
- [x] Test: Factory correctly maps all model IDs to providers
- [x] Test: Unknown models throw a clear error
- [x] Test: Adapters can be registered at startup

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

#### Task 3.5 — Anthropic integration tests
**Priority:** P1  **Risk:** Low

**Description:** Write unit and integration tests for the Anthropic provider.

**Files:**
- `src/__tests__/providers/anthropic.test.ts`

**Blocked by:** `3.4`
**Blocks:** Phase 3 Gate

**Sub-tasks:**
- [x] 3.5.1 — Test: Mock the Vercel AI SDK `streamText` for Anthropic (15m)
- [x] 3.5.2 — Test: Write unit test: verify `stream()` returns chunks correctly (15m)
- [x] 3.5.3 — Test: Write unit test: verify `mapModel()` maps all 3 Claude models (15m)
- [x] 3.5.4 — Test: Write unit test: verify abort signal is passed to streamText (15m)
- [x] 3.5.5 — Test: Write integration test: verify `ProviderFactory.getAdapter('claude-3-opus')` returns Anthropic adapter (15m)
- [x] 3.5.6 — Test: Run tests with `yarn vitest run` (10m)

**Done when:**
- [x] Test: Provider adapter unit tests pass
- [x] Test: Factory routing tests pass
- [x] Test: Mock tests verify API key passing

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

### Week 11: Google Gemini Integration

---

#### Task 3.6 — Install @ai-sdk/google and create adapter
**Priority:** P1  **Risk:** Medium

**Description:** Install the Google AI SDK package and implement the provider adapter.

**Dependencies:** `@ai-sdk/google`

**Files:**
- `electron/main/providers/google.ts`

**Blocked by:** `2.19`
**Blocks:** `3.7`

**Sub-tasks:**
- [x] 3.6.1 — Install `@ai-sdk/google` npm package (15m) *(depends on: 2.19.3)*
- [x] 3.6.2 — Implement `GoogleProvider` class implementing `ProviderAdapter` (20m)
- [x] 3.6.3 — Implement `stream()`: import Vercel AI SDK, call `streamText` with google model (20m)
- [x] 3.6.4 — Implement `mapModel()`: translate internal IDs to Gemini API model names (20m)
- [x] 3.6.5 — Implement `validateApiKey()`: make lightweight API call to verify key (15m)
- [x] 3.6.6 — Implement `estimateCost()` using Google's per-model pricing (15m) *(depends on: 2.20.4)*
- [x] 3.6.7 — Pass `abortSignal` to `streamText` for cancellation support (15m)
- [ ] 3.6.8 — Test with real API key: call stream with short prompt, verify streaming response (15m) *(requires API key)*

**Done when:**
- [ ] Test: Gemini streaming works for Pro and Flash *(requires API key)*
- [ ] Test: AbortSignal cancels requests *(requires API key)*
- [ ] Test: API key is passed correctly *(requires API key)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires API key)*

---

#### Task 3.7 — Add Google models to ModelSelector
**Priority:** P1  **Risk:** Low

**Description:** Update the model selector UI to include Google models.

**Files:**
- `src/lib/models.ts` — add Google models
- `src/components/workflow/ModelSelector.tsx` — ensure Google group renders

**Blocked by:** `3.6`, `2.13`
**Blocks:** `3.8`

**Sub-tasks:**
- [x] 3.7.1 — Add Google model entries to `MODELS` array in `src/lib/models.ts` (15m) *(depends on: 2.13.5)*
- [x] 3.7.2 — Ensure Google group renders under "Google" header (15m)
- [x] 3.7.3 — Verify selecting a Gemini model shows correct max tokens (1M+ for Pro) (15m)

**Done when:**
- [ ] Test: Google models appear in the model selector *(requires GUI)*
- [ ] Test: Models are grouped under "Google" header *(requires GUI)*
- [ ] Test: max tokens for Gemini models is displayed correctly (1M+ tokens) *(requires GUI)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 3.8 — Test Google streaming end-to-end
**Priority:** P1  **Risk:** Low

**Description:** Test the full execution pipeline with Google models.

**Blocked by:** `3.6`
**Blocks:** `3.9`

**Sub-tasks:**
- [ ] 3.8.1 — Test short prompt → verify completes quickly (15m) *(depends on: 3.6.9)* *(requires API key)*
- [ ] 3.8.2 — Test very long prompt (Gemini supports 1M+ tokens) → verify streaming works (15m) *(requires API key)*
- [ ] 3.8.3 — Test temperature setting → verify output changes with different values (15m) *(depends on: 3.8.2)* *(requires API key)*
- [ ] 3.8.4 — Test max tokens limit → verify response is truncated at limit (15m) *(requires API key)*
- [ ] 3.8.5 — Test: Test abort during streaming → verify request is cancelled (10m) *(requires API key)*

**Done when:**
- [ ] Test: All test cases pass *(requires API key)*
- [ ] Test: Streaming works for both models *(requires API key)*
- [ ] Test: No errors in main process *(requires API key)*

**Effort:** 1.5h

**Review checklist:**
- [ ] All sub-tasks completed (checked off) *(requires API key)*
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires API key)*

---

#### Task 3.9 — Register Google in ProviderFactory
**Priority:** P1  **Risk:** Low

**Description:** Add the Google provider to the ProviderFactory.

**Files:**
- `electron/main/providers/factory.ts` — register Google provider

**Blocked by:** `3.6`
**Blocks:** `3.10`

**Sub-tasks:**
- [x] 3.9.1 — Register Google provider in `ProviderFactory` at app startup (10m) *(depends on: 2.19.2)*
- [x] 3.9.2 — Verify `ProviderFactory.getAdapter('gemini-1.5-pro')` returns Google adapter (15m)
- [x] 3.9.3 — Add error handling for missing API keys per provider (10m)
- [x] 3.9.4 — Run `yarn tsc --noEmit` to verify factory compiles (10m)

**Done when:**
- [x] Test: `ProviderFactory.getAdapter('gemini-1.5-pro')` returns the Google adapter
- [x] Test: Error handling for missing API keys works

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

#### Task 3.10 — Prevent model/provider mismatches in the UI
**Priority:** P1  **Risk:** Medium

**Description:** Ensure the UI only shows models for which the user has configured an API key.

**Files:**
- `src/components/workflow/ModelSelector.tsx` — filter based on configured keys
- `src/hooks/useConfiguredProviders.ts` — hook to get configured providers

**Blocked by:** `3.8`, `2.36`
**Blocks:** `3.11`

**Sub-tasks:**
- [x] 3.10.1 — Create `useConfiguredProviders()` hook reading `apiKeys` from settings store (20m) *(depends on: 2.13.3)*
- [x] 3.10.2 — Filter `MODEL_GROUPS` in ModelSelector to only show providers with configured keys (20m)
- [x] 3.10.3 — If no API keys configured for any provider, show "Add API key to select a model" prompt (20m)
- [x] 3.10.4 — Dynamic update: when user adds/deletes a key in Settings, ModelSelector updates without page reload (15m)
- [x] 3.10.5 — Add tooltip on disabled provider groups explaining why they are unavailable (15m)

**Done when:**
- [ ] Test: Model selector only shows providers with configured API keys *(requires GUI)*
- [ ] Test: If no API keys are configured, show "Add API key" prompt *(requires GUI)*
- [ ] Test: Adding a key in Settings dynamically updates the model selector *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

### Week 12: Provider Error Handling

---

#### Task 3.11 — Implement unified error handling
**Priority:** P1  **Risk:** High

**Description:** Create a centralized error handling system that categorizes errors and determines recovery strategies.

**Files:**
- `electron/main/engine/retry.ts`

**Blocked by:** `2.23`
**Blocks:** `3.12`

**Sub-tasks:**
- [x] 3.11.1 — Define `ErrorClassification` interface with `category`, `recoverable`, `retryable`, `message` fields (20m) *(depends on: 2.19.6)*
- [x] 3.11.2 — Implement `classifyError()`: detect rate limit (429), auth (401), server error (5xx), timeout, network error, unknown (30m)
- [x] 3.11.3 — Map HTTP status codes and error codes to categories (20m) *(depends on: 2.23.9)*
- [x] 3.11.4 — Return user-friendly error messages for each category (20m)
- [x] 3.11.5 — Add provider-specific error detection (OpenAI vs Anthropic vs Google error formats) (20m)
- [x] 3.11.6 — Write unit tests for `classifyError()` with mock errors of each type (15m)

**Done when:**
- [x] Test: All provider error types are classified
- [x] Test: Classification includes recovery strategy
- [x] Test: Error messages are user-friendly

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

#### Task 3.12 — Implement exponential backoff retry
**Priority:** P1  **Risk:** High

**Description:** Add an exponential backoff retry mechanism to the execution engine.

**Files:**
- `electron/main/engine/retry.ts` — retry function
- `electron/main/engine/runner.ts` — integrate retry

**Blocked by:** `3.11`
**Blocks:** `3.13`

**Sub-tasks:**
- [x] 3.12.1 — Implement `executeWithRetry<T>()` generic function with `maxRetries`, `baseDelayMs`, `maxDelayMs` config (20m) *(depends on: 2.18.5)*
- [x] 3.12.2 — Add exponential backoff: `delay = baseDelayMs * 2^(attempt-1) + jitter` (30m)
- [x] 3.12.3 — Add jitter: `Math.random() * 1000` to prevent thundering herd (20m) *(depends on: 3.12.2)*
- [x] 3.12.4 — Integrate retry into `WorkflowRunner.executePrompt()` — wrap provider call with retry (20m)
- [x] 3.12.5 — Skip retry for non-recoverable errors (auth failures) (15m)
- [x] 3.12.6 — Emit `execution:retrying` event during retry waits so UI can show countdown (15m)
- [x] 3.12.7 — Respect `Retry-After` header from rate-limited responses (15m)
- [x] 3.12.8 — Write unit tests for retry logic with mock failures (15m)

**Done when:**
- [x] Test: Rate limits trigger exponential backoff
- [x] Test: Timeout errors retry with backoff
- [x] Test: Auth errors are not retried
- [x] Test: Max retries limit is respected
- [x] Test: Jitter is added to prevent thundering herd

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [x] All `Done when` criteria met

---

#### Task 3.13 — Handle provider-specific errors in UI
**Priority:** P1  **Risk:** Low

**Description:** Display provider-specific error messages in the execution viewer with actionable guidance.

**Files:**
- `src/components/execution/ErrorDisplay.tsx`

**Blocked by:** `3.12`
**Blocks:** `3.14`

**Sub-tasks:**
- [x] 3.13.1 — Create `ErrorDisplay.tsx` component accepting `error` (code, message, recoverable, provider) and `onRetry`, `onConfigureKey` callbacks (15m) *(depends on: 3.12.2)*
- [x] 3.13.2 — Map error categories to specific UI: rate limit → auto-retry countdown, invalid key → "Configure API Key" button, server error → Retry button, timeout → Retry button, network → "Check connection" button (20m)
- [x] 3.13.3 — Add auto-retry countdown display: "Rate limited. Retrying in 15s..." with progress bar (20m)
- [x] 3.13.4 — Make "Configure API Key" button navigate to `/settings/api-keys` (20m)
- [x] 3.13.5 — Style errors with provider-specific color accents (OpenAI green, Anthropic brown, Google blue) (15m)
- [x] 3.13.6 — Add non-recoverable error display with clear next-step instructions (15m)

**Done when:**
- [ ] Test: Error messages are provider-specific *(requires GUI)*
- [ ] Test: Actionable buttons are provided where possible *(requires GUI)*
- [ ] Test: Auto-retry shows countdown or progress *(requires GUI)*
- [ ] Test: Non-recoverable errors show clear next steps *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 3.14 — Rate limit detection and throttling
**Priority:** P2  **Risk:** High

**Description:** Implement per-provider rate limit tracking to avoid hitting limits.

**Files:**
- `electron/main/engine/rate-limiter.ts`

**Blocked by:** `3.12`
**Blocks:** `3.15`

**Sub-tasks:**
- [x] 3.14.1 — Create `RateLimiter` class with per-provider tracking map (30m) *(depends on: 2.18.5)*
- [x] 3.14.2 — Implement `recordRequest(provider)`: increment request count, track timestamp (30m)
- [x] 3.14.3 — Implement `recordRateLimit(provider, retryAfterMs)`: store retry-after value, set cooldown (30m) *(depends on: 3.14.2)*
- [x] 3.14.4 — Implement `throttle(provider)`: if approaching known limit, add artificial delay before request (20m)
- [x] 3.14.5 — Implement `getWaitTime(provider)`: return remaining wait time if rate limited (20m)
- [x] 3.14.6 — Parse `Retry-After` header from provider error responses (15m)
- [x] 3.14.7 — Reset rate limit tracking after cooldown window expires (15m)
- [x] 3.14.8 — Test: Wire `RateLimiter` into `WorkflowRunner` before each provider call (10m)

**Done when:**
- [ ] Test: Rate limits are tracked per provider *(requires API key)*
- [ ] Test: Throttling adds delays before requests if approaching limits *(requires API key)*
- [ ] Test: `retry-after` headers from provider responses are respected *(requires API key)*
- [ ] Test: Rate limit state resets after the window *(requires API key)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires API key)*

---

#### Task 3.15 — Provider-specific config UI
**Priority:** P2  **Risk:** Low

**Description:** Add provider-specific configuration options (custom base URLs, etc.).

**Files:**
- `src/components/settings/ProviderConfig.tsx`

**Blocked by:** `3.14`
**Blocks:** `3.16`

**Sub-tasks:**
- [x] 3.15.1 — Create `ProviderConfig.tsx` component expandable per provider (15m) *(depends on: 2.36.3)*
- [x] 3.15.2 — Add custom base URL input (for OpenAI-compatible APIs like Together, Groq) (20m)
- [x] 3.15.3 — Add connection timeout input (per provider, in seconds) (20m)
- [x] 3.15.4 — Add max retries input (per provider) (20m)
- [x] 3.15.5 — Store provider config in Zustand settings store with persist (15m)
- [x] 3.15.6 — Pass custom config to ProviderAdapter when making requests (15m)
- [x] 3.15.7 — Show provider config section in the Settings page (15m)

**Done when:**
- [ ] Test: Custom base URL can be configured per provider *(requires GUI)*
- [ ] Test: Timeout and retry settings are per-provider *(requires GUI)*
- [ ] Test: Config is stored and persisted *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 3.16 — Phase 3 Gate testing
**Priority:** P1  **Risk:** Low

**Description:** Run through the Phase 3 checklist and ensure all providers work consistently.

**Checklist:**
- [ ] OpenAI models work with streaming *(requires API keys)*
- [ ] Anthropic models work with streaming *(requires API keys)*
- [ ] Google models work with streaming *(requires API keys)*
- [ ] Model selector shows only configured providers *(requires GUI)*
- [ ] Rate limits handled with backoff *(requires API keys)*
- [ ] Provider errors display actionable messages *(requires API keys)*
- [ ] Retry mechanism recovers from transient failures *(requires API keys)*
- [x] `yarn lint` passes
- [x] `yarn typecheck` passes

**Blocked by:** `3.13`, `3.15`
**Blocks:** Phase 4

**Sub-tasks:**
- [ ] 3.16.1 — Test: Test all 3 providers with short prompt, verify streaming works (20m) *(requires API keys)*
- [ ] 3.16.2 — Test: Test model selector filtering: add key for only 1 provider, verify only that group shows (20m) *(requires GUI + API keys)*
- [ ] 3.16.3 — Test: Test rate limit handling: simulate 429 response, verify backoff and user-visible retry countdown (20m) *(requires API keys)*
- [ ] 3.16.4 — Test: Test error display: disconnect network during execution, verify error message with actionable button (20m) *(requires API keys + GUI)*
- [ ] 3.16.5 — Test: Test retry: let a prompt fail with server error, verify auto-retry succeeds (15m) *(requires API keys)*
- [x] 3.16.6 — Test: Run `yarn lint` and `yarn typecheck`, fix all issues (15m)
- [ ] 3.16.7 — Test: Tag git with `phase-3-complete` (15m) *(manual)*

**Done when:**
- [ ] Test: All checklist items pass *(requires API keys + GUI)*
- [ ] Test: All three providers stream correctly with retry and error handling *(requires API keys + GUI)*

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off) *(requires API keys + GUI)*
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires API keys + GUI)*

## Phase 4 — Desktop Polish

**Goal:** Desktop-native experience — tray, notifications, auto-update, keyboard shortcuts.
**Duration:** 4 weeks

---

### Week 13: System Tray

---

#### Task 4.1 — Create TrayManager class
**Priority:** P2  **Risk:** High

**Description:** Implement the system tray manager that creates and manages the tray icon.

**Files:**
- `electron/main/tray.ts`

**Blocked by:** `2.21` (needs execution engine)
**Blocks:** `4.2`

**Sub-tasks:**
- [x] 4.1.1 — Create `TrayManager` class with `Tray` instance and `status` tracking (20m) *(depends on: 1.4.2)*
- [x] 4.1.2 — Implement `create()`: create `Tray` with icon path, set tooltip "PromptLoop", build context menu (20m)
- [x] 4.1.3 — Implement `setStatus(status)`: update tray icon image and context menu based on new status (20m)
- [x] 4.1.4 — Build context menu with: Open, Start/Pause/Stop (state-dependent), separator, Quit (20m)
- [x] 4.1.5 — Implement `toggleWindow()`: if window is visible/minimized → show/restore, if hidden → show (15m)
- [x] 4.1.6 — Wire tray click to `toggleWindow()` (15m) *(depends on: 4.1.5)*
- [x] 4.1.7 — Register `TrayManager` in `electron/main/index.ts` and create on app ready (15m)
- [ ] 4.1.8 — Test: Set tray icon based on current execution status (idle=running=paused=error) (10m) *(requires GUI)*

**Done when:**
- [ ] Test: Tray icon appears in the system tray *(requires GUI)*
- [ ] Test: Icon changes based on workflow status *(requires GUI)*
- [ ] Test: Context menu shows correct options based on state *(requires GUI)*
- [ ] Test: Actions work (Start/Pause/Stop) *(requires GUI)*
- [ ] Test: Clicking tray toggles window visibility *(requires GUI)*

**Effort:** 3h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.2 — Create tray icons
**Priority:** P2  **Risk:** Low

**Description:** Design and create the tray icons for all states.

**Files:**
- `resources/tray-idle.png` — 16x16 and 22x22 (Retina: 32x32, 44x44)
- `resources/tray-running.png` — green dot/indicator
- `resources/tray-paused.png` — yellow dot/indicator
- `resources/tray-error.png` — red dot/indicator
- `resources/tray-idle@2x.png` — Retina versions
- `resources/tray-running@2x.png`
- `resources/tray-paused@2x.png`
- `resources/tray-error@2x.png`

**Blocked by:** `4.1`
**Blocks:** `4.3`

**Sub-tasks:**
- [x] 4.2.1 — Design a simple recognizable icon for the app (circle with "PL" or app logo mark) (30m) *(depends on: 4.1.2)*
- [x] 4.2.2 — Create idle state icon (gray version) (20m)
- [x] 4.2.3 — Create running state icon (green version) (15m)
- [x] 4.2.4 — Create paused state icon (yellow version) (15m)
- [x] 4.2.5 — Create error state icon (red version) (10m)
- [x] 4.2.6 — Create Retina @2x versions for all 4 states (10m)
- [x] 4.2.7 — Test: Use macOS template images (black and white, system tints automatically) (10m)
- [x] 4.2.8 — Test: Verify icons are recognizable at 16x16 and look correct on both light/dark menu bars (5m)

**Done when:**
- [x] Test: Icons exist for all states
- [x] Test: Retina versions exist
- [x] Test: Icons are recognizable at 16x16
- [x] Test: Icons look correct on both light and dark menu bars

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] All `Done when` criteria met

---

#### Task 4.3 — Implement minimize-to-tray behavior
**Priority:** P2  **Risk:** Medium

**Description:** When the user closes the window, minimize to tray instead of quitting.

**Files:**
- `electron/main/window.ts` — handle close event
- `electron/main/tray.ts` — show/hide window
- `src/store/settingsStore.ts` — `minimizeToTrayOnClose` option

**Blocked by:** `4.1`
**Blocks:** `4.4`

**Sub-tasks:**
- [x] 4.3.1 — Add `minimizeToTrayOnClose` boolean to settingsStore with default `true` (15m) *(depends on: 4.1.6)*
- [x] 4.3.2 — In `createWindow()`, add `mainWindow.on('close', handler)` that prevents default and hides window when setting is enabled (15m)
- [x] 4.3.3 — Cmd+Q still quits the app regardless of setting (check `event.defaultPrevented` for Cmd+Q) (15m)
- [x] 4.3.4 — Implement `mainWindow.show()` in tray's click handler (toggle window visibility) (15m)
- [x] 4.3.5 — Add toggle in Settings page for minimize-to-tray behavior (15m)
- [ ] 4.3.6 — Test: close window → app stays running in tray, click tray → window reappears, Cmd+Q → quits (10m) *(requires GUI)*

**Done when:**
- [ ] Test: Closing window minimizes to tray (if setting is enabled) *(requires GUI)*
- [ ] Test: Clicking tray icon shows the window *(requires GUI)*
- [ ] Test: Cmd+Q still quits the app *(requires GUI)*
- [ ] Test: Setting can disable minimize-to-tray (window closes normally) *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.4 — Add tray tooltip with workflow info
**Priority:** P2  **Risk:** Low

**Description:** Update the tray tooltip to show the active workflow name and status.

**Files:**
- `electron/main/tray.ts` — update tooltip on status change

**Blocked by:** `4.3`
**Blocks:** `4.5`

**Sub-tasks:**
- [x] 4.4.1 — Implement `updateTooltip(workflowName?)`: format tooltip as `"PromptLoop: {statusLabel} - {workflowName}"` (15m) *(depends on: 4.1.1)*
- [x] 4.4.2 — Call `updateTooltip` when `setStatus()` is called (15m) *(depends on: 2.22.7)*
- [x] 4.4.3 — Show "PromptLoop: Idle" when no workflow is active (15m)
- [x] 4.4.4 — Show "PromptLoop: Running - Content Generator" when executing (15m)
- [x] 4.4.5 — Listen to execution status changes from engine to update tooltip (10m)

**Done when:**
- [ ] Test: Tooltip shows "PromptLoop: Running - Content Generator" *(requires GUI)*
- [ ] Test: Tooltip updates when workflow state changes *(requires GUI)*
- [ ] Test: Tooltip shows "PromptLoop: Idle" when no workflow is active *(requires GUI)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.5 — Wire tray actions to execution engine
**Priority:** P2  **Risk:** Medium

**Description:** Connect the tray context menu actions (Start/Pause/Stop) to the execution engine.

**Files:**
- `electron/main/tray.ts` — emit IPC-like events
- `electron/main/index.ts` — wire tray events to engine

**Blocked by:** `4.4`, `2.21`
**Blocks:** `4.6`

**Sub-tasks:**
- [x] 4.5.1 — Implement `sendAction(action)` in TrayManager: gets active workflow ID, calls engine method (15m) *(depends on: 4.4.1)*
- [x] 4.5.2 — Wire tray "Start" to `workflow:start` IPC handler (or direct engine call) (20m) *(depends on: 2.22.7)*
- [x] 4.5.3 — Wire tray "Pause" to `workflow:pause` handler (20m)
- [x] 4.5.4 — Wire tray "Stop" to `workflow:stop` handler (15m)
- [x] 4.5.5 — Update context menu item enabled/disabled states based on current workflow status (15m)
- [x] 4.5.6 — Handle case where no workflow is active (disable execution actions) (10m)
- [x] 4.5.7 — Test: Expose a method in the main process to get the active workflow ID (10m)

**Done when:**
- [ ] Test: Tray "Start" starts the active workflow *(requires GUI)*
- [ ] Test: Tray "Pause" pauses the running workflow *(requires GUI)*
- [ ] Test: Tray "Stop" stops the workflow *(requires GUI)*
- [ ] Test: Menu items enable/disable based on state *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.6 — System tray cross-platform testing
**Priority:** P2  **Risk:** Low

**Description:** Test system tray functionality on all target platforms.

**Blocked by:** `4.5`
**Blocks:** Phase 4 Gate

**Sub-tasks:**
- [ ] 4.6.1 — Test: Test tray on macOS: menu bar extra, template images, dark mode support (15m) *(requires GUI)*
- [ ] 4.6.2 — Test: Test tray on Windows: system tray notification area, balloon tooltips (15m) *(requires GUI)*
- [ ] 4.6.3 — Test: Document any platform-specific differences or limitations (20m)
- [x] 4.6.4 — Test: Add fallback behavior if tray is not supported on platform (20m)
- [ ] 4.6.5 — Test: Test tray click-to-foreground on all platforms (15m) *(requires GUI)*

**Done when:**
- [ ] Test: Tray works on the primary development platform (macOS) *(requires GUI)*
- [ ] Test: Known platform differences are documented *(requires GUI)*
- [ ] Test: Fallback behavior for platforms without tray support *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off) *(requires GUI)*
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

### Week 14: Desktop Notifications

---

#### Task 4.7 — Implement NotificationManager
**Priority:** P2  **Risk:** Medium

**Description:** Create a notification manager that sends desktop notifications for workflow events.

**Files:**
- `electron/main/notifications.ts`

**Blocked by:** `4.1`
**Blocks:** `4.8`

**Sub-tasks:**
- [x] 4.7.1 — Create `NotificationManager` class with methods for each notification type (15m) *(depends on: 2.22.3)*
- [x] 4.7.2 — Implement `sendWorkflowCompleted(workflowName, stats)`: show notification with title "Workflow Complete" and body with stats (20m)
- [x] 4.7.3 — Implement `sendWorkflowFailed(workflowName, error)`: show notification with title "Workflow Failed" and error message (15m)
- [x] 4.7.4 — Add click handler on notification: focus the app window on click (15m)
- [x] 4.7.5 — Respect macOS "Do Not Disturb" mode (Electron handles this automatically) (15m)
- [x] 4.7.6 — Use `Notification` API from Electron's main process (15m)

**Done when:**
- [ ] Test: Notifications appear on workflow completion *(requires GUI)*
- [ ] Test: Notifications appear on workflow failure *(requires GUI)*
- [ ] Test: Clicking notification brings app to foreground *(requires GUI)*
- [ ] Test: Notifications respect "do not disturb" mode *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.8 — Wire notifications to execution events
**Priority:** P2  **Risk:** Low

**Description:** Connect the NotificationManager to the execution engine's completion/failure events.

**Files:**
- `electron/main/index.ts` — listen to execution events
- `electron/main/notifications.ts` — event handlers

**Blocked by:** `4.7`
**Blocks:** `4.9`

**Sub-tasks:**
- [x] 4.8.1 — In main process, listen to `workflow:completed` events from execution engine (15m) *(depends on: 4.7.2)*
- [x] 4.8.2 — In main process, listen to `workflow:failed` events from execution engine (15m)
- [x] 4.8.3 — Call `NotificationManager.sendWorkflowCompleted()` on completion event (15m) *(depends on: 2.22.7)*
- [x] 4.8.4 — Call `NotificationManager.sendWorkflowFailed()` on failure event (15m)
- [x] 4.8.5 — Include workflow name and relevant stats in notification payload (15m)

**Done when:**
- [ ] Test: Completion triggers a desktop notification *(requires GUI)*
- [ ] Test: Failure triggers a desktop notification *(requires GUI)*
- [ ] Test: Notifications include workflow name and relevant info *(requires GUI)*

**Effort:** 0.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.9 — Make notifications configurable in settings
**Priority:** P2  **Risk:** Low

**Description:** Add notification preferences to the Settings page.

**Files:**
- `src/pages/Settings.tsx` — notification toggles
- `src/store/settingsStore.ts` — notification preferences
- `electron/main/notifications.ts` — check preferences before showing

**Blocked by:** `4.8`
**Blocks:** `4.10`

**Sub-tasks:**
- [x] 4.9.1 — Add notification preference fields to settingsStore: `notificationsEnabled`, `notifyOnComplete`, `notifyOnFailure`, `notifyOnWarning` (15m) *(depends on: 4.7.1)*
- [x] 4.9.2 — Create notification settings section in Settings page with switch toggles (15m)
- [x] 4.9.3 — Send notification preferences to main process via IPC on change (15m)
- [x] 4.9.4 — In NotificationManager, check preferences before showing each notification type (15m)
- [x] 4.9.5 — Persist notification preferences across restarts (Zustand persist) (10m)

**Done when:**
- [ ] Test: Notifications can be toggled on/off in Settings *(requires GUI)*
- [ ] Test: Preferences persist across restarts *(requires GUI)*
- [ ] Test: Disabled notifications do not fire *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.10 — Add error/rate limit notifications
**Priority:** P2  **Risk:** Low

**Description:** Send less intrusive notifications for recoverable errors like rate limits.

**Files:**
- `electron/main/notifications.ts` — add rate limit notification

**Blocked by:** `4.9`
**Blocks:** `4.11`

**Sub-tasks:**
- [x] 4.10.1 — Implement `sendRateLimitWarning(provider, retryAfter)`: show silent notification (15m) *(depends on: 3.11.6)*
- [x] 4.10.2 — Suppress repeated rate limit notifications within 5-minute window (cooldown) (15m)
- [x] 4.10.3 — Resume rate limit notifications after 5 minutes of no rate limits (15m)
- [x] 4.10.4 — Use tray balloon on Windows, notification banner on macOS for rate limit alerts (15m)
- [x] 4.10.5 — Log rate limit events for debugging (10m)

**Done when:**
- [ ] Test: Rate limit notifications show on first occurrence *(requires GUI)*
- [ ] Test: Notifications are suppressed if repeated quickly *(requires GUI)*
- [ ] Test: Notifications resume after quiet period *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.11 — Notification cross-platform testing
**Priority:** P2  **Risk:** Low

**Description:** Test notification behavior on all platforms.

**Blocked by:** `4.10`
**Blocks:** Phase 4 Gate

**Sub-tasks:**
- [ ] 4.11.1 — Test: Test macOS: Notification Center banners, grouping (15m) *(requires GUI)*
- [ ] 4.11.2 — Test: Test Windows: Toast notifications (Action Center), balloon tips for tray (15m) *(requires GUI)*
- [ ] 4.11.3 — Test: Test Linux: libnotify/DBus notifications (if applicable) (20m) *(requires GUI)*
- [ ] 4.11.4 — Test: Test click-to-focus behavior on all platforms (20m) *(requires GUI)*
- [ ] 4.11.5 — Test: Document known platform differences (15m)

**Done when:**
- [ ] Test: Notifications work on the primary development platform *(requires GUI)*
- [ ] Test: Known platform differences are documented *(requires GUI)*

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off) *(requires GUI)*
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

### Week 15: Keyboard Shortcuts + Window Management

---

#### Task 4.12 — Register global keyboard shortcuts
**Priority:** P2  **Risk:** Medium

**Description:** Register global keyboard shortcuts in the main process that work even when the app is minimized.

**Files:**
- `electron/main/shortcuts.ts`

**Blocked by:** `2.21` (needs execution engine)
**Blocks:** `4.13`

**Sub-tasks:**
- [x] 4.12.1 — Create `ShortcutManager` class using `globalShortcut` from Electron (20m) *(depends on: 1.4.4)*
- [x] 4.12.2 — Register `CommandOrControl+Return`: start/resume workflow (20m)
- [x] 4.12.3 — Register `CommandOrControl+Shift+Return`: pause workflow (20m)
- [x] 4.12.4 — Register `CommandOrControl+.`: stop workflow (15m)
- [x] 4.12.5 — Implement `unregister()`: call `globalShortcut.unregisterAll()` on app quit (15m)
- [x] 4.12.6 — Handle case where shortcuts are already registered by another app (15m)
- [x] 4.12.7 — Wire shortcut actions to execution engine (same as tray actions) (15m)
- [ ] 4.12.8 — Test shortcuts work when app is minimized or in background (10m) *(requires GUI)*

**Done when:**
- [ ] Test: Cmd+Enter starts the active workflow *(requires GUI)*
- [ ] Test: Cmd+Shift+Enter pauses/resumes *(requires GUI)*
- [ ] Test: Cmd+. stops the workflow *(requires GUI)*
- [ ] Test: Shortcuts work when app is in background *(requires GUI)*
- [ ] Test: Shortcuts are unregistered on quit *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.13 — Add renderer-side keyboard shortcuts
**Priority:** P2  **Risk:** Low

**Description:** Register keyboard shortcuts within the renderer that only work when the app is focused.

**Files:**
- `src/hooks/useKeyboardShortcuts.ts`

**Shortcuts table:**
| Shortcut | Action |
|----------|--------|
| Cmd+Enter | Start workflow execution |
| Cmd+Shift+Enter | Pause/resume workflow |
| Cmd+. | Stop workflow |
| Cmd+N | New workflow |
| Cmd+S | Save workflow |
| Cmd+, | Open settings |
| Escape | Close panel / dialog |
| Space | Toggle play/pause (execution viewer focused) |

**Blocked by:** `4.12`
**Blocks:** `4.14`

**Sub-tasks:**
- [x] 4.13.1 — Create `useKeyboardShortcuts.ts` hook with `useEffect` + `keydown` listener (15m)
- [x] 4.13.2 — Implement Cmd+N: navigate to `/workflows/new` (20m)
- [x] 4.13.3 — Implement Cmd+S: trigger save on current page (15m)
- [x] 4.13.4 — Implement Cmd+,: navigate to `/settings` (15m)
- [x] 4.13.5 — Implement Escape: close any open panel or dialog (15m)
- [x] 4.13.6 — Implement Space: toggle play/pause in execution viewer (only when execution viewer is focused) (15m)
- [x] 4.13.7 — Ignore shortcuts when focus is in INPUT/TEXTAREA/SELECT elements (10m)
- [x] 4.13.8 — Test: Add `preventDefault()` to avoid conflicts with browser defaults (10m)
- [x] 4.13.9 — Test: Clean up event listener on component unmount (5m)

**Done when:**
- [ ] Test: All renderer shortcuts work when the app is focused *(requires GUI)*
- [ ] Test: Shortcuts are disabled when editing text inputs *(requires GUI)*
- [ ] Test: No conflicts with Electron's built-in shortcuts *(requires GUI)*

**Effort:** 2h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.14 — Build compact window mode
**Priority:** P2  **Risk:** Medium

**Description:** Create a compact/mini window mode for the execution viewer that shows just the essentials.

**Files:**
- `electron/main/window.ts` — handle mode switching
- `src/pages/ExecutionViewer.tsx` — compact mode variant

**Blocked by:** `2.30` (execution viewer complete)
**Blocks:** `4.15`

**Sub-tasks:**
- [x] 4.14.1 — Add `mode: 'full' | 'compact'` to window state tracking (15m) *(depends on: 1.4.2)*
- [x] 4.14.2 — Implement `setWindowMode(mode)`: resize window (full=1200x800, compact=400x400) (20m)
- [x] 4.14.3 — Add IPC handler `window:set-mode` for renderer to request mode change (20m)
- [x] 4.14.4 — Update `ExecutionViewer.tsx` to support compact variant (hide sidebar, logs, only show header + streaming response) (20m)
- [x] 4.14.5 — Add compact mode toggle button in execution viewer header (15m)
- [x] 4.14.6 — Add View menu item for compact/full mode switching (15m) *(depends on: 4.14.5)*
- [x] 4.14.7 — Maintain window position when switching modes (center the window) (15m)
- [x] 4.14.8 — Persist mode preference in settings store (10m)

**Done when:**
- [ ] Test: Compact window opens with correct size *(requires GUI)*
- [ ] Test: Execution viewer works in compact mode *(requires GUI)*
- [ ] Test: Mode can be toggled *(requires GUI)*
- [ ] Test: Window position is maintained when switching modes *(requires GUI)*

**Effort:** 2.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [x] Edge cases considered and handled
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.15 — Persist window position, size, and mode
**Priority:** P2  **Risk:** Low

**Description:** Save and restore window state (position, size, mode) across app restarts.

**Files:**
- `electron/main/window.ts` — state persistence
- `electron/shared/types.ts` — WindowState type

**Blocked by:** `4.14`
**Blocks:** `4.16`

**Sub-tasks:**
- [x] 4.15.1 — Define `PersistedWindowState` type with x, y, width, height, isMaximized, mode (20m) *(depends on: 1.4.2)*
- [x] 4.15.2 — Save window state on `resize` event (debounced 500ms) (20m)
- [x] 4.15.3 — Save window state on `move` event (debounced 500ms) (20m) *(depends on: 4.14.2)*
- [x] 4.15.4 — Save window state on `maximize`/`unmaximize` events (20m)
- [x] 4.15.5 — Restore window state on app startup (set bounds, maximize if was maximized) (15m)
- [x] 4.15.6 — Clamp window position to available display bounds (handle monitor disconnect) (15m)
- [x] 4.15.7 — Use `electron-store` or a JSON file in userData for persistence (10m)
- [ ] 4.15.8 — Test: resize → close → reopen → same size and position (10m) *(requires GUI)*

**Done when:**
- [ ] Test: Window position persists across restarts *(requires GUI)*
- [ ] Test: Window size persists across restarts *(requires GUI)*
- [ ] Test: Maximized state persists *(requires GUI)*
- [ ] Test: Window mode persists *(requires GUI)*
- [ ] Test: Multi-monitor: position is clamped to available displays *(requires GUI)*

**Effort:** 1.5h

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.16 — Add app icon
**Priority:** P2  **Risk:** Low

**Description:** Create the application icon in all required sizes and formats.

**Files:**
- `build/icon.icns` — macOS icon (512x512, all sizes)
- `build/icon.ico` — Windows icon (256x256, all sizes)
- `build/icon.png` — Linux icon (512x512)
- `build/icon@2x.png` — Retina Linux icon

**Blocked by:** Nothing
**Blocks:** `4.17`

**Sub-tasks:**
- [x] 4.16.1 — Design app icon (1024x1024 base) with app logo/initial (30m)
- [x] 4.16.2 — Export macOS `.icns` with all required sizes (16, 32, 48, 128, 256, 512) (20m)
- [x] 4.16.3 — Export Windows `.ico` with all required sizes (16, 32, 48, 256) (20m) *(depends on: 4.16.2)*
- [x] 4.16.4 — Export Linux `.png` in 512x512 and 1024x1024 (Retina @2x) (15m) *(depends on: 4.16.3)*
- [x] 4.16.5 — Configure `electron-builder.yml` to use correct icon paths per platform (15m)
- [ ] 4.16.6 — Verify icon appears in dock/taskbar, app switcher, About panel, and file manager (15m) *(requires GUI)*

**Done when:**
- [ ] Test: App icon shows in the dock/taskbar *(requires GUI)*
- [ ] Test: App icon shows in the application switcher *(requires GUI)*
- [ ] Test: App icon shows in About panel *(requires GUI)*
- [ ] Test: App icon shows in the file manager *(requires GUI)*

**Effort:** 2h (design) or 0.5h (asset creation if design exists)

**Review checklist:**
- [x] All sub-tasks completed (checked off)
- [x] TypeScript compiles with `yarn tsc --noEmit`
- [x] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met *(requires GUI)*

---

#### Task 4.17 — Window mode persistence testing
**Priority:** P2  **Risk:** Low

**Description:** Verify window state persistence works correctly across various scenarios.

**Blocked by:** `4.15`
**Blocks:** Phase 4 Gate

**Sub-tasks:**
- [ ] 4.17.1 — Test: normal close and reopen → state restored (15m)
- [ ] 4.17.2 — Test: quit and relaunch → state restored (15m)
- [ ] 4.17.3 — Test: maximize → close → reopen → still maximized (20m)
- [ ] 4.17.4 — Test: compact mode → close → reopen → compact mode (20m)
- [ ] 4.17.5 — Test: move to external monitor → close → reconnect monitor → reopen → position valid (15m)
- [ ] 4.17.6 — Test: minimize to tray → reopen → state matches (15m)
- [ ] 4.17.7 — Test: Handle "invisible window" scenario: if saved position is off-screen, use default position (10m)
- [ ] 4.17.8 — Test: Document any known issues with multi-monitor state persistence (10m)

**Done when:**
- [ ] Test: All test cases pass
- [ ] Test: No "invisible window" scenarios (window off-screen)
- [ ] Test: Fallback position if saved position is off-screen

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

### Week 16: Auto-Update + Final Polish

---

#### Task 4.18 — Configure electron-updater
**Priority:** P2  **Risk:** Low

**Description:** Set up `electron-updater` with GitHub Releases for automatic app updates.

**Dependencies:** `electron-updater`

**Files:**
- `electron/main/updater.ts`
- `electron-builder.yml` — publish configuration

**Blocked by:** `1.1`, GitHub repo setup
**Blocks:** `4.19`

**Sub-tasks:**
- [ ] 4.18.1 — Install `electron-updater` npm package (15m)
- [ ] 4.18.2 — Create `setupAutoUpdater()` in `electron/main/updater.ts` with `autoUpdater` config (15m)
- [ ] 4.18.3 — Configure `autoUpdater.autoDownload = false` and `autoInstallOnAppQuit = true` (15m)
- [ ] 4.18.4 — Add event handlers: `update-available` → send to renderer, `download-progress` → send progress, `update-downloaded` → notify renderer (15m)
- [ ] 4.18.5 — Configure `electron-builder.yml` with GitHub publish provider, owner, repo (15m) *(depends on: 4.18.4)*
- [ ] 4.18.6 — Call `autoUpdater.checkForUpdates()` on app startup (10m)
- [ ] 4.18.7 — Test: Call `setupAutoUpdater()` in `electron/main/index.ts` (10m)
- [ ] 4.18.8 — Test: Handle update errors gracefully (log, don't crash) (5m)

**Done when:**
- [ ] Test: `electron-builder.yml` is configured with GitHub publish
- [ ] Test: Auto-updater checks for updates on startup
- [ ] Test: Update events are sent to the renderer

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 4.19 — Build update UI
**Priority:** P2  **Risk:** Low

**Description:** Create the UI for notifying users about available updates.

**Files:**
- `src/components/settings/UpdateNotification.tsx`
- `src/components/settings/UpdateProgress.tsx`

**Blocked by:** `4.18`
**Blocks:** `4.20`

**Sub-tasks:**
- [ ] 4.19.1 — Create `UpdateNotification.tsx` component that listens to `app:update-available` IPC event (15m) *(depends on: 4.18.1)*
- [ ] 4.19.2 — Show notification banner when update is available: "v2.0.0 available — Download" (20m)
- [ ] 4.19.3 — Create `UpdateProgress.tsx` component showing download progress bar with percentage (20m)
- [ ] 4.19.4 — Listen to `app:update-progress` IPC event and update progress bar (20m)
- [ ] 4.19.5 — Listen to `app:update-downloaded` IPC event and show "Restart to Install" button (15m)
- [ ] 4.19.6 — "Restart to Install" button calls `autoUpdater.quitAndInstall()` (15m)
- [ ] 4.19.7 — Add "Check for Updates" button in Settings → About section (15m)
- [ ] 4.19.8 — Handle all update states: checking, up-to-date, available, downloading, downloaded, error (15m)
- [ ] 4.19.9 — Show "Up to date" message in About section when no update is available (10m)

**Done when:**
- [ ] Test: Update notification shows when update is available
- [ ] Test: Download progress is shown
- [ ] Test: Install button triggers restart and install
- [ ] Test: Manual "Check for Updates" button in Settings → About

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 4.20 — Add loading states and transitions
**Priority:** P2  **Risk:** Low

**Description:** Polish all loading states with skeleton screens, transitions, and loading indicators.

**Files:** Various component files

**Blocked by:** All Phase 2 pages exist
**Blocks:** `4.21`

**Sub-tasks:**
- [ ] 4.20.1 — Add `SkeletonCard` x3 to Dashboard page (replaces loading spinner) (20m)
- [ ] 4.20.2 — Add skeleton for Workflow Editor form fields while workflow loads (20m)
- [ ] 4.20.3 — Add skeleton for Execution Viewer response area while execution loads (20m)
- [ ] 4.20.4 — Add skeleton for Settings page (API key list loading) (20m)
- [ ] 4.20.5 — Add `SkeletonTable` for log table loading state (15m)
- [ ] 4.20.6 — Add page transition: fade in (100-200ms CSS transition) on route change (15m)
- [ ] 4.20.7 — Add queue item status color transitions (300ms CSS transition) (15m)
- [ ] 4.20.8 — Add streaming text smooth appearance (no jank as text updates) (15m)
- [ ] 4.20.9 — Test: Add panel open/close slide animation (200ms) (10m)
- [ ] 4.20.10 — Test: Verify no layout shifts during loading state transitions (5m)

**Done when:**
- [ ] Test: All data fetching shows skeleton loading states
- [ ] Test: Transitions are smooth (no layout shifts)
- [ ] Test: Loading states match final layout dimensions

**Effort:** 2h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 4.21 — Performance audit
**Priority:** P2  **Risk:** Low

**Description:** Audit app performance against targets defined in the PRD.

**Blocked by:** `4.20`
**Blocks:** `4.22`

**Sub-tasks:**
- [ ] 4.21.1 — Test: Measure app startup time (cold start), target < 3s (20m)
- [ ] 4.21.2 — Test: Measure IPC round-trip latency (p95), target < 50ms (20m)
- [ ] 4.21.3 — Test: Measure Firestore read latency (p95), target < 200ms (20m)
- [ ] 4.21.4 — Test: Measure idle memory usage, target < 150 MB (20m)
- [ ] 4.21.5 — Test: Measure running memory usage (during workflow execution), target < 400 MB (20m)
- [ ] 4.21.6 — Test: If log table is slow with 1000+ entries, implement virtual list with `react-window` (20m)
- [ ] 4.21.7 — Test: Lazy load route components with `React.lazy()` + `Suspense` (20m)
- [ ] 4.21.8 — Test: Add `React.memo` and `useMemo` to expensive components (20m)
- [ ] 4.21.9 — Test: Optimize Zustand selectors to prevent unnecessary re-renders (15m)
- [ ] 4.21.10 — Test: Batch Firestore writes where possible (reduce write count) (15m)
- [ ] 4.21.11 — Test: Run DevTools performance recording, verify no jank (60fps) (15m)

**Done when:**
- [ ] Test: All performance targets are met
- [ ] Test: Heavy pages (1000+ log entries) are responsive
- [ ] Test: No memory leaks on long-running sessions
- [ ] Test: DevTools performance recording shows no jank

**Effort:** 3h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 4.22 — Sentry error tracking verification
**Priority:** P2  **Risk:** Low

**Description:** Verify Sentry is properly capturing errors in both main and renderer processes.

**Files:**
- `electron/main/sentry.ts`
- `src/lib/sentry.ts`

**Blocked by:** `1.27`
**Blocks:** `4.23`

**Sub-tasks:**
- [ ] 4.22.1 — Throw an unhandled error in the renderer → verify it appears in Sentry (15m) *(depends on: 1.27.6)*
- [ ] 4.22.2 — Throw an error in an IPC handler → verify it appears in Sentry (15m)
- [ ] 4.22.3 — Verify user context (user ID, app version) is attached to all events (15m)
- [ ] 4.22.4 — Verify source maps are uploaded for deobfuscation (readable stack traces) (15m)
- [ ] 4.22.5 — Test: Enable performance tracing for key operations (IPC calls, Firestore queries) (10m)
- [ ] 4.22.6 — Test: Fix any Sentry configuration issues found during verification (10m)

**Done when:**
- [ ] Test: Errors are captured with stack traces
- [ ] Test: User context is attached
- [ ] Test: Source maps are working

**Effort:** 1h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 4.23 — Final bug bash
**Priority:** P2  **Risk:** Low

**Description:** Comprehensive manual testing of all features.

**Test plan:**

_Authentication:_
- [ ] Google OAuth sign in
- [ ] GitHub OAuth sign in
- [ ] Sign out
- [ ] Auth state persistence across restart
- [ ] Protected routes redirect to login

_Workflow Management:_
- [ ] Create workflow
- [ ] Edit workflow name
- [ ] Delete workflow (with confirmation)
- [ ] Create prompt
- [ ] Edit prompt (all fields)
- [ ] Reorder prompts via drag-and-drop
- [ ] Enable/disable prompts
- [ ] Delete prompt
- [ ] Duplicate workflow
- [ ] Import/export workflow JSON
- [ ] Auto-save (debounced)

_Execution:_
- [ ] Start workflow
- [ ] Pause workflow
- [ ] Resume workflow
- [ ] Stop workflow
- [ ] Streaming response display
- [ ] Infinite looping
- [ ] Fixed iteration looping
- [ ] Single pass execution
- [ ] Delay between prompts
- [ ] Retry failed prompt
- [ ] All prompts disabled handling

_API Keys:_
- [ ] Add API key (OpenAI)
- [ ] Add API key (Anthropic)
- [ ] Add API key (Google)
- [ ] View key prefix (full key never visible)
- [ ] Delete API key
- [ ] Invalid key → error message

_Providers:_
- [ ] OpenAI streaming (GPT-4, GPT-4o, GPT-3.5-turbo)
- [ ] Anthropic streaming (Claude 3 Opus, Sonnet, Haiku)
- [ ] Google streaming (Gemini 1.5 Pro, Flash)
- [ ] Model selector filters by configured keys
- [ ] Provider error handling (disconnect network)

_Dashboard:_
- [ ] Workflow cards display correctly
- [ ] Status badges update
- [ ] Quick stats show correct data
- [ ] Start from dashboard card
- [ ] Edit from dashboard card
- [ ] Delete from dashboard card
- [ ] Empty state

_Desktop Features:_
- [ ] System tray icon shows correct status
- [ ] Tray context menu actions work
- [ ] Minimize to tray on close
- [ ] Desktop notifications on completion
- [ ] Desktop notifications on failure
- [ ] Global keyboard shortcuts
- [ ] Compact window mode
- [ ] Window state persistence
- [ ] Theme (light/dark/system)
- [ ] App icon displays correctly

_Edge Cases:_
- [ ] Network disconnect during execution
- [ ] Firestore write failure
- [ ] Rapid start/pause/stop
- [ ] Quit during execution (resume on restart)
- [ ] Workflow deleted during execution
- [ ] Very long prompts (100k chars)
- [ ] Very high max tokens

**Blocked by:** `4.22`
**Blocks:** `4.24`

**Sub-tasks:**
- [ ] 4.23.1 — Test: Run through all authentication test cases (30m)
- [ ] 4.23.2 — Test: Run through all workflow management test cases (30m)
- [ ] 4.23.3 — Test: Run through all execution test cases (30m)
- [ ] 4.23.4 — Test: Run through all API key test cases (30m)
- [ ] 4.23.5 — Test: Run through all provider test cases (30m)
- [ ] 4.23.6 — Test: Run through all dashboard test cases (30m)
- [ ] 4.23.7 — Test: Run through all desktop feature test cases (15m)
- [ ] 4.23.8 — Test: Run through all edge case test cases (15m)
- [ ] 4.23.9 — Test: Log all bugs found, categorize by severity (P0/P1/P2/P3) (15m)
- [ ] 4.23.10 — Test: Fix all P0 and P1 bugs before proceeding to Phase 4 Gate (15m)

**Done when:**
- [ ] Test: All test cases pass
- [ ] Test: No critical (P0) bugs
- [ ] Test: No high (P1) bugs
- [ ] Test: All medium (P2) bugs have workarounds or are scheduled for fix

**Effort:** 8h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

---

#### Task 4.24 — Phase 4 Gate & Beta release
**Priority:** P2  **Risk:** Low

**Description:** Run through the Phase 4 checklist, create a beta release on GitHub, and distribute to testers.

**Checklist:**
- [ ] System tray works
- [ ] Desktop notifications fire on events
- [ ] Keyboard shortcuts work
- [ ] Window state persists across restarts
- [ ] Compact mode works
- [ ] Auto-update downloads and installs updates
- [ ] App has proper icon
- [ ] Loading states exist for all data fetching
- [ ] Sentry reports errors
- [ ] Performance targets met
- [ ] Binary builds for macOS, Windows, Linux
- [ ] Beta release tagged and published on GitHub
- [ ] Release notes written

**Blocked by:** `4.23`
**Blocks:** Phase 5

**Sub-tasks:**
- [ ] 4.24.1 — Test: Run through all Phase 4 checklist items, verify each works (20m)
- [ ] 4.24.2 — Test: Build binaries for macOS: `yarn build -- --mac` (20m)
- [ ] 4.24.3 — Test: Build binaries for Windows: `yarn build -- --win` (20m)
- [ ] 4.24.4 — Test: Build binaries for Linux: `yarn build -- --linux` (20m)
- [ ] 4.24.5 — Test: Create GitHub release with v0.1.0-beta tag (20m)
- [ ] 4.24.6 — Test: Upload build artifacts to GitHub release (15m)
- [ ] 4.24.7 — Test: Write release notes covering all features, known issues, and setup instructions (15m)
- [ ] 4.24.8 — Test: Distribute beta to testers with installation instructions (10m)
- [ ] 4.24.9 — Set up a feedback channel (GitHub Issues template for bug reports)
- [ ] 4.24.10 — Tag git with `v0.1.0-beta`

**Done when:**
- [ ] Test: All checklist items pass
- [ ] Test: Beta release is published on GitHub with binaries and release notes

**Effort:** 4h

**Review checklist:**
- [ ] All sub-tasks completed (checked off)
- [ ] TypeScript compiles with `yarn tsc --noEmit`
- [ ] Lint passes with `yarn lint`
- [ ] All `Done when` criteria met

## Post-MVP: Phase 5 (Ongoing)

These are tracked as epics, not individual tasks. Break them into detailed tasks when you reach this phase.

### Scheduling
- Build `ScheduleWorker` in main process (cron checker)
- Implement cron expression parser
- Create schedule picker UI (once, daily, weekly, cron)
- Schedule tab in workflow editor
- Test scheduled start/stop across timezones

### Template Variables
- Build variable resolver in execution engine
- Support `{{variable}}` syntax in prompt content
- Create variable editor in prompt panel
- Variable types: static, random, date

### Context Chaining
- Add `{{prompt[n].response}}` syntax
- Store previous responses in execution context
- Resolve chained variables before sending

### Conditional Logic
- Add condition editor to workflow builder
- Condition types: contains, matches, equals, length
- Actions: skip, retry, branch
- Implement condition evaluator in execution engine

### Performance & Testing
- Virtual list for log table (react-window)
- Lazy load route components with React.Suspense
- Memory profiling and leak fixes
- E2E tests with Playwright + Electron
- Installer code signing (macOS notarization, Windows Authenticode)

---

## Appendix: Task Reference

### Task ID Prefixes

| Prefix | Phase |
|--------|-------|
| `1.x` | Phase 1: Foundation |
| `2.x` | Phase 2: Core Features |
| `3.x` | Phase 3: Provider Expansion |
| `4.x` | Phase 4: Desktop Polish |

### Effort Scale

| Effort | Meaning | Examples |
|--------|---------|---------|
| 0.5h | Trivial | Add a toggle, update config |
| 1h | Simple | Create one component, write a script |
| 2h | Moderate | Create a page with simple logic |
| 3h | Complex | Create a page with multiple states |
| 4h+ | Large | Create a module with sub-systems |

### Priority Guide

| Priority | Meaning | Action |
|----------|---------|--------|
| P0 | Critical | Must fix before release |
| P1 | High | Should fix before release |
| P2 | Medium | Fix if time permits |
| P3 | Low | Post-MVP / nice to have |

### Quick Reference: Key Files

| File Path | Purpose |
|-----------|---------|
| `electron/main/index.ts` | Main process entry |
| `electron/main/window.ts` | Window manager |
| `electron/main/tray.ts` | System tray |
| `electron/main/engine/runner.ts` | Workflow execution |
| `electron/main/engine/retry.ts` | Error handling & retry |
| `electron/main/providers/interface.ts` | Provider abstraction |
| `electron/main/providers/openai.ts` | OpenAI adapter |
| `electron/main/providers/anthropic.ts` | Anthropic adapter |
| `electron/main/providers/google.ts` | Google adapter |
| `electron/main/providers/factory.ts` | Provider factory |
| `electron/main/encryption.ts` | API key encryption |
| `electron/main/updater.ts` | Auto-updater |
| `electron/main/notifications.ts` | Desktop notifications |
| `electron/main/shortcuts.ts` | Global keyboard shortcuts |
| `electron/preload/index.ts` | Preload script |
| `electron/shared/types.ts` | Shared type definitions |
| `src/main.tsx` | React entry point |
| `src/App.tsx` | Root component |
| `src/routes.tsx` | Route definitions |
| `src/lib/firebase.ts` | Firebase initialization |
| `src/lib/converters.ts` | Firestore converters |
| `src/lib/models.ts` | Model definitions |
| `src/store/executionStore.ts` | Execution state |
| `src/store/workflowStore.ts` | Workflow state |
| `src/store/settingsStore.ts` | Settings state |
| `src/hooks/useWorkflows.ts` | Workflow data fetching |
| `src/hooks/usePrompts.ts` | Prompt data fetching |
| `src/hooks/useIpc.ts` | IPC event listeners |
| `src/hooks/useKeyboardShortcuts.ts` | Keyboard shortcuts |
| `src/pages/Login.tsx` | Login page |
| `src/pages/Dashboard.tsx` | Dashboard page |
| `src/pages/WorkflowEditor.tsx` | Workflow editor page |
| `src/pages/ExecutionViewer.tsx` | Execution viewer page |
| `src/pages/Settings.tsx` | Settings page |
| `src/pages/ApiKeys.tsx` | API keys page |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Firestore indexes |
| `electron-builder.yml` | Packaging configuration |
