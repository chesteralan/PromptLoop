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

**Blocked by:** Nothing
**Blocks:** `1.2`, `1.4`

**Done when:**
- [ ] `npm run dev` starts Vite dev server and opens Electron window
- [ ] HMR works — editing a React component hot-reloads in the Electron window
- [ ] Tailwind classes render correctly in the component
- [ ] `npm run build` produces a production build

**Effort:** 4h

---

#### Task 1.2 — Create project directory structure

**Description:** Create the full directory tree matching the project structure defined in `planning/TECH_STACK.md`.

**Files:**
```
electron/
├── main/
│   ├── index.ts              # Main process entry point
│   ├── window.ts             # Window manager (placeholder)
│   ├── tray.ts               # Tray manager (placeholder)
│   ├── ipc/
│   │   ├── workflow.ts
│   │   ├── execution.ts
│   │   ├── api-keys.ts
│   │   └── app.ts
│   ├── engine/
│   │   ├── runner.ts
│   │   ├── queue.ts
│   │   ├── retry.ts
│   │   └── scheduler.ts
│   ├── providers/
│   │   ├── interface.ts
│   │   ├── openai.ts
│   │   ├── anthropic.ts
│   │   └── google.ts
│   ├── encryption.ts
│   ├── updater.ts
│   └── sentry.ts
├── preload/
│   └── index.ts               # Preload script with contextBridge
└── shared/
    └── types.ts               # Shared IPC type definitions
src/
├── main.tsx                   # React entry point
├── App.tsx                    # Root component
├── routes.tsx                 # Route definitions
├── components/
│   ├── ui/                    # shadcn/ui primitives (empty stubs)
│   ├── layout/                # Layout components (empty stubs)
│   ├── workflow/              # Workflow components (empty stubs)
│   ├── execution/             # Execution components (empty stubs)
│   ├── auth/                  # Auth components (empty stubs)
│   ├── settings/              # Settings components (empty stubs)
│   └── shared/                # Shared components (empty stubs)
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── WorkflowEditor.tsx
│   ├── ExecutionViewer.tsx
│   ├── Settings.tsx
│   └── ApiKeys.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkflows.ts
│   ├── usePrompts.ts
│   ├── useExecutions.ts
│   ├── useIpc.ts
│   └── index.ts
├── store/
│   ├── executionStore.ts
│   ├── workflowStore.ts
│   ├── settingsStore.ts
│   └── index.ts
├── lib/
│   ├── firebase.ts
│   ├── ipc.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

**Blocked by:** `1.1`
**Blocks:** `1.14`, `1.23`, all Phase 2 tasks

**Done when:**
- [ ] All directories and stub files exist (each file has a minimal export or comment)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)

**Effort:** 1h

---

#### Task 1.3 — Configure ESLint + Prettier

**Description:** Set up consistent code formatting and linting for both main and renderer processes.

**Files:**
- `.eslintrc.cjs` — ESLint config with TypeScript and React rules
- `.prettierrc` — Prettier config
- `.eslintignore`
- `.prettierignore`
- `.husky/pre-commit` — Husky hook for lint-staged
- `lint-staged.config.js`

**Dependencies:** `eslint`, `prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `husky`, `lint-staged`

**Blocked by:** `1.1`
**Blocks:** Nothing

**Done when:**
- [ ] `npm run lint` passes on all existing files
- [ ] `npm run format` formats code consistently
- [ ] Pre-commit hook runs linter on staged files

**Effort:** 1h

---

#### Task 1.4 — Set up basic Electron main process

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

**Done when:**
- [ ] `npm run dev` opens a native window with the React app rendered inside
- [ ] Window closes cleanly on Cmd+Q
- [ ] `contextIsolation` is enabled (verify in devtools)
- [ ] Window title is set to "PromptLoop"

**Effort:** 2h

---

#### Task 1.5 — Set up preload script with contextBridge

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

**Done when:**
- [ ] `window.electronAPI` is accessible in the renderer context
- [ ] TypeScript declarations for `ElectronAPI` exist and type-check
- [ ] Calling `window.electronAPI.getAppVersion()` returns the app version string

**Effort:** 1.5h

---

#### Task 1.6 — Verify dev workflow end-to-end

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
  "typecheck": "tsc --noEmit"
}
```

**Blocked by:** `1.4`, `1.5`
**Blocks:** Phase 1 Gate

**Done when:**
- [ ] `npm run dev` → window opens, HMR works for React changes
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` produces a working production build

**Effort:** 1h

---

### Week 2: Firebase Integration

---

#### Task 1.7 — Create Firebase project and configure

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
3. Enable Authentication (Email/Password, Google, GitHub)
4. Enable Firestore (test mode initially, then apply rules)
5. Register Web app to get config values
6. Save config to `.env`

**Blocked by:** `1.1`
**Blocks:** `1.8`

**Done when:**
- [ ] Firebase project exists
- [ ] `.env` contains valid Firebase config values
- [ ] `firebase init` has been run locally
- [ ] Firestore is enabled with initial security rules

**Effort:** 1h

---

#### Task 1.8 — Install and initialize Firebase SDK

**Description:** Install the Firebase Web SDK and initialize it in the renderer process.

**Dependencies:** `firebase`

**Files:**
- `src/lib/firebase.ts` — Firebase app init, auth + firestore exports
- `.env` — ensure `VITE_FIREBASE_*` variables are used

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

**Blocked by:** `1.7`
**Blocks:** `1.9`, `1.10`

**Done when:**
- [ ] Firebase initializes without errors in the renderer
- [ ] `auth` and `db` exports are usable
- [ ] Emulator connection works in dev mode

**Effort:** 1h

---

#### Task 1.9 — Set up Firebase Emulator Suite

**Description:** Install and configure the Firebase Emulator Suite for local development of Auth and Firestore.

**Dependencies:** `firebase-tools`

**Files:**
- `firebase.json` — emulator configuration
- Package.json script: `"emulators": "firebase emulators:start"`

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

**Blocked by:** `1.8`
**Blocks:** `1.10`

**Done when:**
- [ ] `npm run emulators` starts Auth (9099), Firestore (8080), and Emulator UI (4000)
- [ ] The renderer connects to emulators (verified by emulator UI showing connections)
- [ ] Emulator data persists across restarts

**Effort:** 1h

---

#### Task 1.10 — Implement AuthProvider context

**Description:** Create a React context that wraps `onAuthStateChanged` and provides the current user to the entire app.

**Files:**
- `src/components/auth/AuthProvider.tsx`
- `src/hooks/useAuth.ts` — hook wrapping the context

```typescript
// AuthProvider provides:
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Blocked by:** `1.8`, `1.9`
**Blocks:** `1.11`, `1.12`

**Done when:**
- [ ] `useAuth()` returns the current authenticated user or null
- [ ] `isLoading` is true while auth state is being determined
- [ ] `signIn`, `signUp`, `signOut` functions work correctly
- [ ] Auth state persists across app restarts

**Effort:** 2h

---

#### Task 1.11 — Build LoginPage with email/password form

**Description:** Create the login page with email/password authentication form. Handle all states: loading, error, already-authenticated redirect.

**Files:**
- `src/pages/Login.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/OAuthButtons.tsx`

**States:**
| State | Display |
|-------|---------|
| Loading auth state | Spinner overlay |
| Already authenticated | Redirect to `/dashboard` |
| Ready | Login form + OAuth buttons |
| Signing in | Button spinner, inputs disabled |
| Error | Inline error message |

**Blocked by:** `1.10`
**Blocks:** `1.14`

**Done when:**
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] Google sign-in works (opens popup)
- [ ] GitHub sign-in works
- [ ] Error messages display inline (not toast)
- [ ] Authenticated users are redirected to dashboard
- [ ] Route: `/#/login`

**Effort:** 3h

---

#### Task 1.12 — Implement ProtectedRoute component

**Description:** Create a route guard that redirects unauthenticated users to the login page.

**Files:**
- `src/components/layout/ProtectedRoute.tsx`

```typescript
// Logic:
// - If auth is loading, show a full-screen spinner
// - If user is null, redirect to /login
// - If user exists, render children
```

**Blocked by:** `1.10`
**Blocks:** `1.14`

**Done when:**
- [ ] Visiting `/dashboard` without auth → redirects to `/login`
- [ ] Visiting `/login` while authenticated → redirects to `/dashboard`
- [ ] Loading state shows spinner until auth resolves

**Effort:** 0.5h

---

#### Task 1.13 — Wire auth state to Zustand store

**Description:** Sync Firebase auth state into the Zustand settings store for components that need it outside the React tree (e.g., for IPC event handlers).

**Files:**
- `src/store/settingsStore.ts` — add `user`, `isAuthenticated` fields
- `src/components/auth/AuthProvider.tsx` — update store on auth state change

**Blocked by:** `1.10`
**Blocks:** `1.23`

**Done when:**
- [ ] `useSettingsStore(state => state.user)` returns the current user
- [ ] `useSettingsStore(state => state.isAuthenticated)` is true when signed in
- [ ] Store updates when auth state changes

**Effort:** 0.5h

---

### Week 3: Design System & Layout

---

#### Task 1.14 — Install and configure shadcn/ui primitives

**Description:** Initialize shadcn/ui in the project and add the UI primitives needed for the app shell.

**Files:** Created by `npx shadcn@latest init` and `npx shadcn@latest add`:
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

**Done when:**
- [ ] `npx shadcn@latest init` completes without errors
- [ ] All listed primitives are added and compile
- [ ] `cn()` utility works for merging Tailwind classes
- [ ] Components render correctly in isolation

**Effort:** 1h

---

#### Task 1.15 — Build AppLayout with sidebar navigation

**Description:** Create the main application layout with a sidebar for navigation between pages.

**Files:**
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/StatusBar.tsx`
- `src/App.tsx` — wire up router with layout

**Sidebar items:**
- Dashboard (LayoutDashboard icon)
- New Workflow (PlusCircle icon)
- Settings (Settings icon)
- User menu at bottom (Avatar + name + sign out)

**StatusBar (bottom):**
- Execution status indicator (colored dot)
- App version

**Blocked by:** `1.14`, `1.11`
**Blocks:** `1.18`

**Done when:**
- [ ] Sidebar renders with navigation items
- [ ] Clicking nav items changes the route
- [ ] Active route is highlighted in sidebar
- [ ] User menu shows avatar and name
- [ ] Sign out works from the user menu
- [ ] StatusBar shows app version

**Effort:** 3h

---

#### Task 1.16 — Set up React Router with HashRouter

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

**Done when:**
- [ ] All routes render the correct page component
- [ ] Navigating between routes works (no full page reloads)
- [ ] Protected routes redirect to `/login` when unauthenticated
- [ ] Unknown routes redirect to `/dashboard`

**Effort:** 1h

---

#### Task 1.17 — Implement dark/light theme

**Description:** Add theme switching (light, dark, system) that persists across restarts.

**Files:**
- `src/store/settingsStore.ts` — `theme` field with persist
- `src/hooks/useTheme.ts` — applies theme class to `<html>`
- `src/styles/globals.css` — Tailwind dark mode variants

**Blocked by:** `1.14`
**Blocks:** `1.18`

**Done when:**
- [ ] Theme toggle switches between light/dark/system
- [ ] Theme persists across app restarts
- [ ] System theme detection works (follows OS preference)
- [ ] All shadcn components respect the theme

**Effort:** 1h

---

#### Task 1.18 — Build shared app components

**Description:** Create the reusable shared components used across multiple pages.

**Files:**
- `src/components/shared/EmptyState.tsx` — Empty state with icon, title, description, CTA button
- `src/components/shared/ConfirmDialog.tsx` — Generic confirmation dialog (title, message, confirm/cancel)
- `src/components/shared/PageHeader.tsx` — Page title with optional action buttons
- `src/components/shared/SkeletonCard.tsx` — Loading skeleton for cards
- `src/components/shared/SkeletonTable.tsx` — Loading skeleton for tables

**Blocked by:** `1.15`, `1.17`
**Blocks:** Phase 2 tasks

**Done when:**
- [ ] Each component renders correctly in light and dark mode
- [ ] Components are typed with TypeScript
- [ ] Storybook-style test: components render with various props

**Effort:** 2h

---

#### Task 1.19 — Set up toast notifications

**Description:** Install and configure Sonner for toast notifications.

**Files:**
- `src/App.tsx` — add `<Toaster />` component
- `src/components/shared/Toast.tsx` — if wrapping needed

**Dependencies:** `sonner`

**Blocked by:** `1.14`
**Blocks:** Phase 2 tasks

**Done when:**
- [ ] `toast.success('Workflow started')` shows a green toast
- [ ] `toast.error('Something went wrong')` shows a red toast
- [ ] Toasts auto-dismiss after 4 seconds
- [ ] Toasts respect dark/light theme

**Effort:** 0.5h

---

#### Task 1.20 — Build Login page OAuth flow for Electron

**Description:** Handle Firebase OAuth in Electron where popups behave differently. Implement the redirect flow using a separate BrowserWindow.

**Files:**
- `electron/main/auth.ts` — OAuth handler that opens a BrowserWindow for sign-in
- `electron/preload/index.ts` — expose `signInWithGoogle`, `signInWithGitHub`
- `src/components/auth/OAuthButtons.tsx` — use IPC instead of direct Firebase calls

**Implementation approach:**
```typescript
// 1. Renderer calls IPC: invoke('auth:signin-google')
// 2. Main process opens a BrowserWindow with the OAuth URL
// 3. Firebase redirects to the callback URL
// 4. Main process intercepts the redirect, extracts the OAuth code
// 5. Main process exchanges the code for an ID token
// 6. Main process sends the token back to the renderer
// 7. Renderer uses signInWithCustomToken() to complete auth
```

**Blocked by:** `1.10`, `1.5`
**Blocks:** `1.21`

**Done when:**
- [ ] Google sign-in opens a separate window
- [ ] On success, the window closes and user is authenticated
- [ ] GitHub sign-in works the same way
- [ ] Error cases (user closes window, network failure) are handled

**Effort:** 3h

---

#### Task 1.21 — Add password reset flow

**Description:** Implement "Forgot password" functionality that sends a password reset email.

**Files:**
- `src/components/auth/PasswordResetDialog.tsx`
- `src/pages/Login.tsx` — add "Forgot password?" link

**Blocked by:** `1.20`
**Blocks:** Phase 1 Gate

**Done when:**
- [ ] Clicking "Forgot password?" opens a dialog with email input
- [ ] Submitting sends a password reset email via Firebase
- [ ] Confirmation toast shown on success
- [ ] Error messages shown on failure

**Effort:** 1h

---

### Week 4: IPC & State Management

---

#### Task 1.22 — Design and document shared types

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

**Done when:**
- [ ] All IPC message types are defined
- [ ] Types compile with `tsc --noEmit`
- [ ] Types are documented with JSDoc comments

**Effort:** 1.5h

---

#### Task 1.23 — Create Zustand stores

**Description:** Implement all three Zustand stores (execution, workflow, settings) with typed state and actions.

**Files:**
- `src/store/executionStore.ts`
- `src/store/workflowStore.ts`
- `src/store/settingsStore.ts`
- `src/store/index.ts` — re-exports

**ExecutionStore state:**
```typescript
interface ExecutionState {
  activeWorkflowId: string | null;
  executionStatus: 'idle' | 'running' | 'paused' | 'stopped' | 'error';
  currentPromptIndex: number;
  currentPrompt: Prompt | null;
  responseBuffer: string;
  loopIteration: number;
  recentLogs: ExecutionLog[];
}
```

**WorkflowStore state:**
```typescript
interface WorkflowState {
  workflows: Workflow[];
  activeWorkflowId: string | null;
  prompts: Map<string, Prompt[]>;
  isLoadingWorkflows: boolean;
  isLoadingPrompts: boolean;
  error: string | null;
}
```

**SettingsStore state:**
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  minimizeToTrayOnClose: boolean;
  notificationsEnabled: boolean;
  apiKeys: ApiKeyInfo[];
}
```

**Blocked by:** `1.22`
**Blocks:** `1.25`, all Phase 2 tasks

**Done when:**
- [ ] All three stores compile without errors
- [ ] Store actions update state correctly
- [ ] Components can subscribe to store slices with selectors

**Effort:** 2h

---

#### Task 1.24 — Implement main process IPC handlers (skeleton)

**Description:** Create the skeleton for all IPC handlers in the main process. Each handler does minimal work (returns a placeholder response) but establishes the communication channel.

**Files:**
- `electron/main/ipc/workflow.ts` — `workflow:start/pause/stop/retry`
- `electron/main/ipc/execution.ts` — execution event emitters
- `electron/main/ipc/api-keys.ts` — `api-key:encrypt/decrypt/list/delete`
- `electron/main/ipc/app.ts` — `app:get-version/minimize-to-tray/check-updates`
- `electron/main/index.ts` — register all IPC handlers on app ready

**Blocked by:** `1.22`
**Blocks:** `1.25`

**Done when:**
- [ ] All IPC handlers are registered in `electron/main/index.ts`
- [ ] Each handler returns a typed response (even if placeholder)
- [ ] App doesn't crash on IPC calls from renderer

**Effort:** 1.5h

---

#### Task 1.25 — Create preload API wrapper

**Description:** Implement the complete preload API with type-safe methods for all IPC channels.

**Files:**
- `electron/preload/index.ts` — full preload implementation
- `electron/shared/types.ts` — `ElectronAPI` interface definition

```typescript
const api: ElectronAPI = {
  startWorkflow: (workflowId) =>
    ipcRenderer.invoke('workflow:start', { workflowId }),
  pauseWorkflow: (workflowId) =>
    ipcRenderer.invoke('workflow:pause', { workflowId }),
  // ... all channels

  onExecutionChunk: (callback) => {
    const handler = (_event: any, data: ExecutionChunkEvent) => callback(data);
    ipcRenderer.on('execution:chunk', handler);
    return () => ipcRenderer.removeListener('execution:chunk', handler);
  },
  // ... all event listeners
};
```

**Blocked by:** `1.23`, `1.24`
**Blocks:** `1.26`

**Done when:**
- [ ] All IPC methods are exposed via `contextBridge`
- [ ] Event listeners return cleanup functions
- [ ] TypeScript declarations match the runtime API

**Effort:** 1.5h

---

#### Task 1.26 — Create useIpc hook

**Description:** Create a React hook that wires IPC events into the Zustand execution store.

**Files:**
- `src/hooks/useIpc.ts`

```typescript
function useExecutionListener() {
  const appendChunk = useExecutionStore(s => s.appendResponseChunk);
  const addLog = useExecutionStore(s => s.addLog);
  const setStatus = useExecutionStore(s => s.setExecutionStatus);

  useEffect(() => {
    const cleanupChunk = window.electronAPI.onExecutionChunk(data => {
      appendChunk(data.chunk);
    });
    const cleanupCompleted = window.electronAPI.onExecutionCompleted(data => {
      addLog({ status: 'completed', ...data });
    });
    const cleanupFailed = window.electronAPI.onExecutionFailed(data => {
      addLog({ status: 'failed', ...data });
      setStatus('error');
    });

    return () => {
      cleanupChunk();
      cleanupCompleted();
      cleanupFailed();
    };
  }, []);
}
```

**Blocked by:** `1.25`
**Blocks:** Phase 2 execution viewer tasks

**Done when:**
- [ ] Hook registers all execution event listeners
- [ ] Store is updated when events fire
- [ ] Event listeners are cleaned up on unmount

**Effort:** 1h

---

#### Task 1.27 — Set up Sentry error tracking

**Description:** Install and configure Sentry for both the main process and renderer process.

**Dependencies:** `@sentry/electron`

**Files:**
- `electron/main/sentry.ts` — Sentry init for main process
- `src/lib/sentry.ts` — Sentry init for renderer
- `electron/main/index.ts` — call Sentry init
- `src/main.tsx` — call Sentry init

**Blocked by:** `1.1`
**Blocks:** Phase 1 Gate

**Done when:**
- [ ] Uncaught errors in renderer are reported to Sentry
- [ ] Uncaught errors in main process are reported to Sentry
- [ ] App version and user context are attached to events
- [ ] `SENTRY_DSN` is configured via environment variable

**Effort:** 1h

---

#### Task 1.28 — Set up Zustand persist with electron-store

**Description:** Wire up Zustand's persist middleware with `electron-store` so settings survive app restarts.

**Dependencies:** `electron-store`

**Files:**
- `src/store/settingsStore.ts` — add persist middleware
- `electron/preload/index.ts` — expose electron-store via IPC? No — settings store uses a separate electron-store instance in the main process? Actually, the renderer can't access `electron-store` directly.

**Approach:** Store persisted settings in the main process, and use IPC to read/write them. Or, we can use Zustand's `persist` middleware with a custom storage adapter that communicates via IPC.

**Better approach:** Use a Zustand persist middleware that serializes to `localStorage` (which works in Electron's renderer). Settings persist as long as the user data directory isn't cleared.

```typescript
// Simpler: use localStorage
import { persist } from 'zustand/middleware';

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({ ... }),
    { name: 'promptloop-settings' }
  )
);
```

**Blocked by:** `1.23`
**Blocks:** Phase 1 Gate

**Done when:**
- [ ] Theme preference persists across restarts
- [ ] Sidebar state persists across restarts
- [ ] All settings survive app quit and relaunch

**Effort:** 0.5h

---

#### Task 1.29 — Phase 1 integration test

**Description:** Write integration tests that verify Phase 1 deliverables end-to-end.

**Files:**
- `src/__tests__/auth.test.ts` — auth flow test
- `src/__tests__/routes.test.ts` — route protection test
- `src/__tests__/stores.test.ts` — state management test

**Blocked by:** `1.26`, `1.28`
**Blocks:** Phase 1 Gate

**Done when:**
- [ ] Auth flow tests pass (login, logout, protected routes)
- [ ] Store tests pass (state updates correctly)
- [ ] Route tests pass (redirects work)

**Effort:** 2h

---

#### Task 1.30 — Phase 1 Gate Review

**Description:** Run through the Phase 1 checklist and fix any issues.

**Checklist:**
- [ ] `npm run dev` launches the app
- [ ] User can sign up / sign in / sign out
- [ ] User sees sidebar navigation with all routes
- [ ] Dark/light theme toggle works
- [ ] IPC communication works (renderer ↔ main)
- [ ] Zustand stores persist settings
- [ ] Firebase Emulator works locally
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] Sentry is connected

**Blocked by:** `1.29`
**Blocks:** Phase 2

**Effort:** 2h

---

## Phase 2 — Core Features

**Goal:** Complete workflow/prompt CRUD with Firestore sync, execution engine, and execution viewer.
**Duration:** 5 weeks

---

### Week 5: Firestore Data Layer

---

#### Task 2.1 — Write Firestore security rules

**Description:** Implement Firestore security rules that restrict access to a user's own data.

**Files:**
- `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /workflows/{workflowId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        match /prompts/{promptId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }

      match /executions/{executionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /apiKeys/{keyId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId
          && request.resource.data.keyPrefix.size() <= 20;
      }
    }
  }
}
```

**Blocked by:** `1.9`
**Blocks:** `2.2`, `2.3`

**Done when:**
- [ ] Rules are deployed to Firebase project
- [ ] Rules are tested with Firebase Emulator
- [ ] Unauthenticated reads are rejected
- [ ] Cross-user reads are rejected

**Effort:** 1h

---

#### Task 2.2 — Create Firestore indexes

**Description:** Configure composite indexes for Firestore queries.

**Files:**
- `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "executions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "workflowId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "executions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**Blocked by:** `1.9`
**Blocks:** `2.5`

**Done when:**
- [ ] Indexes are deployed to Firebase project
- [ ] Queries using the indexes work in Emulator

**Effort:** 0.5h

---

#### Task 2.3 — Write Firestore data converters

**Description:** Implement Firestore converters that automatically serialize/deserialize Date ↔ Timestamp and handle schema migration.

**Files:**
- `src/lib/converters.ts` — converters for Workflow, Prompt, Execution, ApiKey

```typescript
const workflowConverter: FirestoreDataConverter<Workflow> = {
  toFirestore(workflow) {
    return {
      ...workflow,
      updatedAt: Timestamp.now(),
      createdAt: workflow.createdAt
        ? Timestamp.fromDate(workflow.createdAt)
        : Timestamp.now(),
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)!;
    return migrateDocument<Workflow>('workflow', {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    });
  },
};
```

**Blocked by:** `2.1`
**Blocks:** `2.4`

**Done when:**
- [ ] All converters are implemented and typed
- [ ] Dates are correctly converted to/from Firestore Timestamps
- [ ] Migration functions are applied at read time

**Effort:** 1.5h

---

#### Task 2.4 — Implement useWorkflows hook

**Description:** Create a TanStack Query hook for fetching and mutating workflows.

**Dependencies:** `@tanstack/react-query`

**Files:**
- `src/hooks/useWorkflows.ts`
- `src/lib/firebase.ts` — add `db` export if not already
- `src/main.tsx` — wrap app with `QueryClientProvider`

```typescript
function useWorkflows() {
  return useQuery({
    queryKey: ['workflows', user?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, 'users', user!.uid, 'workflows'),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q.withConverter(workflowConverter));
      return snapshot.docs.map(doc => doc.data());
    },
    enabled: !!user,
  });
}

function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Workflow, 'id'>) => {
      const docRef = await addDoc(
        collection(db, 'users', user!.uid, 'workflows').withConverter(workflowConverter),
        data
      );
      return { id: docRef.id, ...data };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });
}
```

**Blocked by:** `2.3`
**Blocks:** `2.8`, `2.9`

**Done when:**
- [ ] Workflows are fetched and cached
- [ ] Creating a workflow invalidates the cache
- [ ] Updating a workflow invalidates the cache
- [ ] Deleting a workflow invalidates the cache
- [ ] Loading state is exposed
- [ ] Error state is exposed

**Effort:** 2h

---

#### Task 2.5 — Implement usePrompts hook

**Description:** Create a TanStack Query hook for fetching and mutating prompts within a workflow.

**Files:**
- `src/hooks/usePrompts.ts`

```typescript
function usePrompts(workflowId: string) {
  return useQuery({
    queryKey: ['prompts', user?.uid, workflowId],
    queryFn: async () => {
      const q = query(
        collection(db, 'users', user!.uid, 'workflows', workflowId, 'prompts'),
        orderBy('position', 'asc')
      );
      const snapshot = await getDocs(q.withConverter(promptConverter));
      return snapshot.docs.map(doc => doc.data());
    },
    enabled: !!user && !!workflowId,
  });
}
```

**Blocked by:** `2.3`
**Blocks:** `2.8`, `2.9`

**Done when:**
- [ ] Prompts are fetched and ordered by position
- [ ] CRUD mutations invalidate the cache
- [ ] Loading and error states are exposed

**Effort:** 1.5h

---

#### Task 2.6 — Add real-time onSnapshot listener for active workflow

**Description:** Add a Firestore `onSnapshot` listener that provides real-time updates for the currently active workflow (used by the execution viewer).

**Files:**
- `src/hooks/useWorkflowSnapshot.ts`

```typescript
function useWorkflowSnapshot(workflowId: string | null) {
  const setWorkflow = useWorkflowStore(s => s.updateWorkflow);

  useEffect(() => {
    if (!workflowId) return;

    const unsub = onSnapshot(
      doc(db, 'users', user!.uid, 'workflows', workflowId),
      (snapshot) => {
        if (snapshot.exists()) {
          setWorkflow(workflowId, snapshot.data() as Partial<Workflow>);
        }
      }
    );

    return unsub;
  }, [workflowId]);
}
```

**Blocked by:** `2.4`
**Blocks:** `2.30` (execution viewer)

**Done when:**
- [ ] Workflow document updates in real-time
- [ ] Listener is cleaned up when component unmounts
- [ ] Listener handles permission errors gracefully

**Effort:** 1h

---

#### Task 2.7 — Set up Firestore write helpers with optimistic updates

**Description:** Create utility functions for Firestore writes with optimistic UI updates for common operations.

**Files:**
- `src/lib/firestore-helpers.ts`

**Helpers:**
```typescript
function createWorkflow(data: NewWorkflow): Promise<Workflow>;
function updateWorkflow(id: string, data: Partial<Workflow>): Promise<void>;
function deleteWorkflow(id: string): Promise<void>;
function createPrompt(workflowId: string, data: NewPrompt): Promise<Prompt>;
function updatePrompt(workflowId: string, id: string, data: Partial<Prompt>): Promise<void>;
function deletePrompt(workflowId: string, id: string): Promise<void>;
function reorderPrompts(workflowId: string, promptIds: string[]): Promise<void>;
function createExecution(data: NewExecution): Promise<Execution>;
```

**Blocked by:** `2.4`, `2.5`
**Blocks:** `2.9`, `2.12`

**Done when:**
- [ ] All helpers compile and handle errors
- [ ] Optimistic updates restore previous state on failure
- [ ] Firestore security rules are respected

**Effort:** 2h

---

### Week 6: Workflow Editor

---

#### Task 2.8 — Build WorkflowEditorPage layout

**Description:** Create the workflow editor page layout with the workflow name header, settings section, prompt list, and prompt editor panel.

**Files:**
- `src/pages/WorkflowEditor.tsx`
- `src/components/workflow/WorkflowSettings.tsx`

**Layout structure:**
```
┌──────────────────────────────────────┐
│ [Workflow Name Input]    [Save][Del] │  ← PageHeader
├──────────────────────────┬───────────┤
│                          │           │
│  Prompt 1  [↑][↓][✕]    │  Prompt   │
│  Prompt 2  [↑][↓][✕]    │  Editor   │
│  Prompt 3  [↑][↓][✕]    │  Panel    │
│                          │  (slide-  │
│  [+ Add Prompt]          │   over)   │
│                          │           │
│  Loop Mode: [Infinite ▼] │           │
│  Max: [___]              │           │
├──────────────────────────┴───────────┤
│ [Import] [Export]                    │
└──────────────────────────────────────┘
```

**States:**
| State | Display |
|-------|---------|
| Creating new workflow | Default name "Untitled Workflow", no prompts |
| Editing existing workflow | Load data, populate fields |
| Loading (edit mode) | Skeleton |
| Not found | Error state with back button |
| Saving | Save button shows spinner |
| Dirty | Unsaved indicator in header |

**Blocked by:** `2.4`, `2.5`
**Blocks:** `2.9`, `2.10`

**Done when:**
- [ ] Page renders with correct layout
- [ ] Creating vs editing mode is handled
- [ ] Workflow name can be edited
- [ ] Loop mode selector works (infinite, fixed, single, scheduled)
- [ ] Max iterations input shows/hides based on loop mode

**Effort:** 3h

---

#### Task 2.9 — Build PromptCard component (draggable)

**Description:** Create the draggable prompt card that displays in the prompt list.

**Dependencies:** `@hello-pangea/dnd`

**Files:**
- `src/components/workflow/PromptCard.tsx`

```typescript
interface PromptCardProps {
  prompt: Prompt;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}
```

**Card display:**
- Drag handle (6 dots icon)
- Position number
- Title (truncated)
- Model badge (e.g., "GPT-4")
- Enabled/disabled toggle
- Edit button (selects the card)
- Delete button (with confirmation)

**Blocked by:** `2.8`
**Blocks:** `2.10`

**Done when:**
- [ ] Card renders with all fields
- [ ] Drag handle is visible and functional
- [ ] Card is selectable (highlighted when selected)
- [ ] Delete shows confirmation dialog
- [ ] Toggle enables/disables the prompt locally

**Effort:** 2h

---

#### Task 2.10 — Implement drag-and-drop reordering

**Description:** Wire up `@hello-pangea/dnd` (maintained fork of `react-beautiful-dnd`) to allow reordering of prompts in the workflow editor.

**Files:**
- `src/components/workflow/PromptList.tsx`
- `src/components/workflow/PromptCard.tsx` — wrap with Draggable

**Behavior:**
- Drag and drop reorders prompts visually
- On drop, update all prompt positions in Firestore (batch write)
- Positions update optimistically in the UI
- Dropped item animates to new position

**Blocked by:** `2.9`, `2.7`
**Blocks:** `2.11`

**Done when:**
- [ ] Prompts can be reordered by dragging
- [ ] Visual feedback during drag (ghost card, drop indicator)
- [ ] Positions persist to Firestore on drop
- [ ] Reordering doesn't trigger auto-save (only on drop)

**Effort:** 2h

---

#### Task 2.11 — Build PromptEditorPanel (slide-over)

**Description:** Create the slide-over panel for editing prompt details.

**Files:**
- `src/components/workflow/PromptEditorPanel.tsx`

**Fields:**
- Title (text input)
- Prompt content (textarea, ~10 rows)
- System prompt (optional textarea, collapsible)
- Model selector (grouped by provider)
- Temperature (slider, 0-2, step 0.1)
- Max tokens (number input)
- Delay after execution (number input, ms)
- Enabled (switch)

**States:**
| State | Display |
|-------|---------|
| No prompt selected | Empty state: "Select a prompt to edit" |
| Editing | Form populated with prompt data |
| Saving | Save button spinner |
| Dirty | Unsaved indicator |

**Blocked by:** `2.10`
**Blocks:** `2.12`

**Done when:**
- [ ] Panel opens as slide-over from the right
- [ ] All fields render and accept input
- [ ] Changes are auto-saved after 2s debounce
- [ ] Panel closes on Escape or clicking outside
- [ ] Model selector groups by provider

**Effort:** 3h

---

#### Task 2.12 — Implement auto-save with debounce

**Description:** Add debounced auto-save to the workflow editor that writes changes to Firestore after 2 seconds of inactivity.

**Files:**
- `src/hooks/useAutoSave.ts`
- `src/pages/WorkflowEditor.tsx` — use hook

```typescript
function useAutoSave(data: any, saveFn: () => Promise<void>, delayMs = 2000) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debounce: after delayMs of no changes, call saveFn
  // Track dirty state for UI indicator
}
```

**Blocked by:** `2.11`, `2.7`
**Blocks:** `2.13`

**Done when:**
- [ ] Changes are auto-saved after 2 seconds of inactivity
- [ ] Dirty indicator shows when unsaved changes exist
- [ ] Saving indicator shows during Firestore write
- [ ] Manual save also works (Cmd+S)
- [ ] No save on component unmount (Firestore handles writes)

**Effort:** 1.5h

---

#### Task 2.13 — Model selector with provider grouping

**Description:** Build the model selector that groups AI models by provider.

**Files:**
- `src/components/workflow/ModelSelector.tsx`
- `src/lib/models.ts` — model definitions

```typescript
const MODELS: ModelGroup[] = [
  {
    provider: 'OpenAI',
    models: [
      { id: 'gpt-4', name: 'GPT-4', maxTokens: 8192 },
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16384 },
    ],
  },
  {
    provider: 'Anthropic',
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', maxTokens: 200000 },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', maxTokens: 200000 },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', maxTokens: 200000 },
    ],
  },
  {
    provider: 'Google',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1048576 },
    ],
  },
];
```

**Blocked by:** `2.11`
**Blocks:** `2.14`

**Done when:**
- [ ] Models are grouped by provider with provider labels
- [ ] Selecting a model shows its max tokens
- [ ] Search/filter works for long model lists
- [ ] Currently selected model is highlighted

**Effort:** 1.5h

---

#### Task 2.14 — AddPromptButton and create-prompt flow

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

**Done when:**
- [ ] Button creates a prompt with sensible defaults
- [ ] New prompt appears in list without full reload
- [ ] Editor panel opens for the new prompt
- [ ] Multiple rapid clicks don't create duplicates

**Effort:** 1h

---

#### Task 2.15 — Import/export prompts as JSON

**Description:** Add ability to export workflows as JSON files and import them back.

**Files:**
- `src/components/workflow/ImportExportButtons.tsx`

**Export format:**
```json
{
  "version": 1,
  "exportedAt": "2026-05-17T12:00:00Z",
  "workflow": {
    "name": "Content Generation",
    "loopMode": "infinite"
  },
  "prompts": [
    {
      "position": 0,
      "title": "Generate ideas",
      "content": "Generate 10 blog ideas...",
      "model": "gpt-4",
      "temperature": 0.7,
      "maxTokens": 2048,
      "delayMs": 0,
      "enabled": true
    }
  ]
}
```

**Behavior:**
- Export: triggers file download via Electron's `dialog.showSaveDialog`
- Import: opens file picker via `dialog.showOpenDialog`, validates JSON, creates workflow

**Blocked by:** `2.12`
**Blocks:** `2.16`

**Done when:**
- [ ] Export downloads a `.json` file with correct format
- [ ] Import reads a `.json` file and creates a workflow with prompts
- [ ] Validation rejects malformed files with error message
- [ ] Import handles duplicate workflow names by appending " (imported)"

**Effort:** 2h

---

#### Task 2.16 — Handle create vs edit mode in WorkflowEditor

**Description:** Ensure the workflow editor correctly handles routing differences between creating a new workflow and editing an existing one.

**Files:**
- `src/pages/WorkflowEditor.tsx` — route logic
- `src/components/workflow/SaveButton.tsx`

**Behavior:**
- `/workflows/new`: Empty workflow, "Create" button
- `/workflows/:id`: Load existing, "Save" button
- On create: navigate to the new workflow's edit URL on first save
- Unsaved changes warning when navigating away
- Delete button only appears in edit mode

**Blocked by:** `2.8`, `2.12`
**Blocks:** Phase 2 Gate

**Done when:**
- [ ] New workflow redirects to `/workflows/:id` after first save
- [ ] Edit workflow loads existing data
- [ ] Unsaved changes prompt on navigation away
- [ ] Delete only available for existing workflows

**Effort:** 1.5h

---

### Week 7: Execution Engine

---

#### Task 2.17 — Create WorkflowRunner class

**Description:** Implement the core `WorkflowRunner` class that manages sequential prompt execution with pause/resume/stop support.

**Files:**
- `electron/main/engine/runner.ts`

```typescript
class WorkflowRunner {
  private workflow: Workflow;
  private currentIndex: number = 0;
  private loopCount: number = 0;
  private abortController: AbortController;
  private status: WorkflowStatus = 'idle';

  constructor(workflow: Workflow) {}

  async start(): Promise<void> { /* ... */ }
  pause(): void { /* ... */ }
  resume(): void { /* ... */ }
  stop(): void { /* ... */ }
  retry(): Promise<void> { /* ... */ }

  getStatus(): WorkflowStatus { return this.status; }
  getProgress(): { current: number; total: number; iteration: number } { /* ... */ }

  private async executePrompt(prompt: Prompt): Promise<void> { /* ... */ }
  private async callAIProvider(prompt: Prompt): Promise<AsyncIterable<string>> { /* ... */ }
  private async storeExecutionResult(prompt: Prompt, response: string): Promise<void> { /* ... */ }
  private shouldLoop(): boolean { /* ... */ }
  private delay(ms: number): Promise<void> { /* ... */ }
}
```

**State machine:**
```
IDLE ──start()──► RUNNING ──pause()──► PAUSED ──resume()──► RUNNING
                     │                                         │
                     ├──stop()──► STOPPED                       │
                     └──error──► ERROR                          │
                                                                │
                    RUNNING ──complete──► COMPLETED ──► IDLE
```

**Blocked by:** `1.24`, `1.22`
**Blocks:** `2.18`, `2.19`

**Done when:**
- [ ] State transitions work correctly
- [ ] AbortController cancels in-flight AI requests
- [ ] Delays between prompts are respected
- [ ] Loop logic works (infinite, fixed, single)

**Effort:** 4h

---

#### Task 2.18 — Implement QueueManager (in-process promise chain)

**Description:** Create the queue manager that chains prompt execution in sequence using async/await with no external queue system.

**Files:**
- `electron/main/engine/queue.ts`

```typescript
class QueueManager {
  private pending: Prompt[] = [];
  private isProcessing: boolean = false;

  enqueue(prompt: Prompt): void { /* ... */ }
  dequeue(): Prompt | undefined { /* ... */ }
  clear(): void { /* ... */ }
  getQueue(): Prompt[] { /* ... */ }

  async processNext(handler: (prompt: Prompt) => Promise<void>): Promise<void> {
    // Process one prompt, wait for completion, then allow next
  }
}
```

**Blocked by:** `2.17`
**Blocks:** `2.19`

**Done when:**
- [ ] Prompts are processed in FIFO order
- [ ] Each prompt waits for the previous to complete
- [ ] Queue can be cleared on stop
- [ ] Queue state is accessible for UI

**Effort:** 1.5h

---

#### Task 2.19 — Create ProviderAdapter interface

**Description:** Define the abstract interface for AI provider integration.

**Files:**
- `electron/main/providers/interface.ts`

```typescript
interface ProviderAdapter {
  stream(
    prompt: string,
    options: ProviderOptions
  ): AsyncIterable<string>;

  models(): ModelInfo[];
  estimateCost(inputTokens: number, outputTokens: number): number;
  validateApiKey(apiKey: string): Promise<boolean>;
}

interface ProviderOptions {
  apiKey: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  signal?: AbortSignal;
}

interface ModelInfo {
  id: string;
  provider: string;
  displayName: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsSystemPrompt: boolean;
}
```

**Blocked by:** `2.17`
**Blocks:** `2.20`, `3.1`, `3.6`

**Done when:**
- [ ] Interface is defined and exported
- [ ] TypeScript compiles without errors
- [ ] Example implementation compiles

**Effort:** 1h

---

#### Task 2.20 — Implement OpenAI provider adapter

**Description:** Create the OpenAI provider adapter using the Vercel AI SDK.

**Dependencies:** `ai`, `@ai-sdk/openai`

**Files:**
- `electron/main/providers/openai.ts`

```typescript
class OpenAIProvider implements ProviderAdapter {
  async stream(prompt: string, options: ProviderOptions): AsyncIterable<string> {
    const { streamText } = await import('ai');
    const { openai } = await import('@ai-sdk/openai');

    const result = await streamText({
      model: openai(this.mapModel(options.model)),
      prompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      abortSignal: options.signal,
    });

    return result.textStream;
  }

  private mapModel(modelId: string): string {
    const map: Record<string, string> = {
      'gpt-4': 'gpt-4',
      'gpt-4o': 'gpt-4o',
      'gpt-3.5-turbo': 'gpt-3.5-turbo',
    };
    return map[modelId] || 'gpt-4';
  }
}
```

**Blocked by:** `2.19`
**Blocks:** `2.21`

**Done when:**
- [ ] OpenAI streaming works end-to-end
- [ ] AbortSignal cancels in-flight requests
- [ ] All three OpenAI models work
- [ ] API key is passed correctly

**Effort:** 2h

---

#### Task 2.21 — Wire up workflow:start/pause/stop/retry IPC handlers

**Description:** Connect the WorkflowRunner to the IPC layer so the renderer can control execution.

**Files:**
- `electron/main/ipc/execution.ts`
- `electron/main/engine/runner.ts` — ensure methods are callable from IPC

```typescript
// electron/main/ipc/execution.ts
import { ipcMain } from 'electron';
import { WorkflowRunner } from '../engine/runner';

const runners = new Map<string, WorkflowRunner>();

ipcMain.handle('workflow:start', async (_event, { workflowId }) => {
  // Load workflow from Firestore
  // Create WorkflowRunner
  // Start execution
  // Send events back to renderer
});

ipcMain.handle('workflow:pause', async (_event, { workflowId }) => {
  const runner = runners.get(workflowId);
  runner?.pause();
});
```

**Blocked by:** `2.17`, `2.20`
**Blocks:** `2.26`

**Done when:**
- [ ] `workflow:start` creates a runner and begins execution
- [ ] `workflow:pause` pauses at the current prompt
- [ ] `workflow:stop` stops and resets the runner
- [ ] `workflow:retry` re-executes the last failed prompt
- [ ] Multiple workflows can run independently

**Effort:** 2h

---

#### Task 2.22 — Send execution events from main → renderer via IPC

**Description:** Implement the event emitters that notify the renderer of execution progress.

**Files:**
- `electron/main/ipc/execution.ts` — add event emission
- `electron/shared/types.ts` — ensure event types are defined

**Events to emit:**
- `execution:started` — when a prompt starts executing
- `execution:chunk` — streaming response chunk
- `execution:completed` — prompt finished successfully
- `execution:failed` — prompt failed
- `workflow:completed` — entire workflow finished
- `execution:status` — status update (for progress bar)

```typescript
function sendToRenderer(channel: string, data: any) {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(win => win.webContents.send(channel, data));
}
```

**Blocked by:** `2.21`
**Blocks:** `2.27`

**Done when:**
- [ ] All event types are emitted at the correct times
- [ ] Renderer receives events (test with console.log)
- [ ] Streaming chunks are emitted in real-time
- [ ] Events include all required data fields

**Effort:** 1.5h

---

#### Task 2.23 — Implement streaming response handling

**Description:** Process the async iterable from the AI provider and emit chunks to the renderer.

**Files:**
- `electron/main/engine/runner.ts` — `executePrompt` method enhancement

```typescript
private async executePrompt(prompt: Prompt): Promise<void> {
  this.sendEvent('execution:started', { promptId: prompt.id });

  try {
    const adapter = ProviderFactory.getAdapter(prompt.model);
    const stream = await adapter.stream(prompt.content, {
      apiKey: this.apiKeys[this.getProvider(prompt.model)],
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      signal: this.abortController.signal,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      if (this.abortController.signal.aborted) break;
      fullResponse += chunk;
      this.sendEvent('execution:chunk', { promptId: prompt.id, chunk });
    }

    await this.storeExecutionResult(prompt, fullResponse);
    this.sendEvent('execution:completed', { promptId: prompt.id, response: fullResponse });
  } catch (error) {
    this.sendEvent('execution:failed', { promptId: prompt.id, error: error.message });
    throw error; // Let retry logic handle it
  }
}
```

**Blocked by:** `2.20`, `2.22`
**Blocks:** `2.27`

**Done when:**
- [ ] Stream chunks are sent to renderer in real-time
- [ ] Full response is accumulated and stored
- [ ] Abort signal interrupts the stream
- [ ] Errors during streaming are caught and reported

**Effort:** 2h

---

#### Task 2.24 — Add delay timing between prompts

**Description:** Implement the configurable delay between prompt executions.

**Files:**
- `electron/main/engine/runner.ts` — `delay` method
- `electron/main/engine/runner.ts` — integration in execution loop

```typescript
private delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    // Store timer reference for abort
    this.delayTimer = timer;
    const onAbort = () => {
      clearTimeout(timer);
      resolve();
    };
    this.abortController.signal.addEventListener('abort', onAbort, { once: true });
  });
}
```

**Blocked by:** `2.23`
**Blocks:** `2.25`

**Done when:**
- [ ] Delay waits for the configured `delayMs` before next prompt
- [ ] Abort during delay immediately stops the wait
- [ ] Default delay (0ms) proceeds immediately

**Effort:** 0.5h

---

#### Task 2.25 — Implement loop logic

**Description:** Handle the looping behavior when the workflow reaches the last prompt.

**Files:**
- `electron/main/engine/runner.ts` — `shouldLoop()` and loop integration

```typescript
private shouldLoop(): boolean {
  switch (this.workflow.loopMode) {
    case 'infinite':
      return true;
    case 'fixed':
      return this.loopCount < this.workflow.maxIterations!;
    case 'single':
      return false;
    case 'scheduled':
      // Check if current time is within schedule window
      return this.isWithinScheduleWindow();
    default:
      return false;
  }
}
```

**Blocked by:** `2.24`
**Blocks:** `2.30`

**Done when:**
- [ ] Infinite loop continues until manually stopped
- [ ] Fixed loop stops after N iterations
- [ ] Single pass executes once and stops
- [ ] Loop count is tracked and accessible
- [ ] Loop mode can be changed during execution

**Effort:** 1.5h

---

### Week 8: Execution Viewer

---

#### Task 2.26 — Build ExecutionViewerPage layout

**Description:** Create the execution viewer page with header, controls, progress, response display, and logs.

**Files:**
- `src/pages/ExecutionViewer.tsx`

**Layout structure:**
```
┌──────────────────────────────────────┐
│ Workflow Name    [Running ▼] [▶][⏸][■]│  ← Header + Controls
│ Iteration 3 of ∞                     │
├──────────────────────────────────────┤
│ Prompt 1: Generate ideas     [✓]     │  ← Queue progress
│ Prompt 2: Create outline     [▶]     │
│ Prompt 3: Write thread       [ ]     │
├──────────────────────────────────────┤
│                                      │
│  Response from GPT-4 (2.3s, 150/450)│  ← Current response
│  ┌──────────────────────────────────┐│
│  │ Here are 10 blog ideas...       ││
│  │ 1. The Future of AI...          ││
│  │ 2. How Automation...            ││
│  │ 3. ... (streaming in real-time) ││
│  └──────────────────────────────────┘│
│                                      │
├──────────────────────────────────────┤
│ Timestamp  │ Prompt │ Status │ Tokens│  ← Execution logs
│ 12:00:01   │ Idea 1 │  ✓     │ 150   │
│ 12:00:05   │ Outline│  ✓     │ 200   │
│ 12:00:10   │ Thread │  ▶     │ -     │
└──────────────────────────────────────┘
```

**States:**
| State | Display |
|-------|---------|
| Not started | Workflow summary + Start button |
| Running | Live streaming response |
| Paused | "Paused" overlay, Resume button |
| Completed | Final response, summary stats |
| Error | Error message, Retry button |
| No active prompts | Empty state with message |

**Blocked by:** `2.21`
**Blocks:** `2.27`, `2.28`, `2.29`

**Done when:**
- [ ] Page renders all sections correctly
- [ ] All states are handled
- [ ] Navigation to execution viewer works from dashboard

**Effort:** 2h

---

#### Task 2.27 — Build ExecutionControls component

**Description:** Create the Start/Pause/Stop/Retry button group for controlling workflow execution.

**Files:**
- `src/components/execution/ExecutionControls.tsx`

**Button visibility by state:**
| State | Start | Pause | Stop | Retry |
|-------|-------|-------|------|-------|
| idle | ✓ | - | - | - |
| running | - | ✓ | ✓ | - |
| paused | - | ✓ (Resume) | ✓ | - |
| completed | ✓ | - | - | - |
| error | - | - | ✓ | ✓ |

**Blocked by:** `2.26`
**Blocks:** `2.30`

**Done when:**
- [ ] Buttons show/hide based on execution state
- [ ] Start calls IPC `workflow:start`
- [ ] Pause calls IPC `workflow:pause`
- [ ] Stop calls IPC `workflow:stop`
- [ ] Retry calls IPC `workflow:retry`
- [ ] Buttons show loading state during IPC calls

**Effort:** 1.5h

---

#### Task 2.28 — Build PromptProgressBar and QueueItem components

**Description:** Create the visual progress indicator showing which prompts are completed, running, pending, or failed.

**Files:**
- `src/components/workflow/PromptProgressBar.tsx`
- `src/components/workflow/QueueItem.tsx`

**ProgressBar:**
- Horizontal bar divided into segments (one per prompt)
- Each segment colored by status (green=done, blue=running, gray=pending, red=failed)
- Animated pulse on the running segment
- Clicking a segment scrolls to that log entry

**QueueItem:**
- Status icon (checkmark, spinner, circle, X)
- Prompt title
- Duration (if completed)
- Token count (if completed)
- Animated transitions between states

**Blocked by:** `2.26`
**Blocks:** `2.31`

**Done when:**
- [ ] Progress bar updates in real-time as prompts execute
- [ ] Queue items show correct status
- [ ] Animations are smooth (CSS transitions, not JS)
- [ ] Narrow state: scrollable if many prompts

**Effort:** 2h

---

#### Task 2.29 — Create StreamingText component

**Description:** Build the component that displays AI response text as it streams in real-time.

**Files:**
- `src/components/execution/StreamingText.tsx`

```typescript
interface StreamingTextProps {
  text: string;              // accumulated response text
  isStreaming: boolean;      // whether more text is coming
}
```

**Features:**
- Auto-scrolls to bottom as new text arrives
- Typewriter cursor effect during streaming
- Markdown rendering (basic: bold, italic, code, lists, headers)
- Copy button to copy full response
- Supports very long responses (scroll within container)

**Blocked by:** `2.26`
**Blocks:** `2.30`

**Done when:**
- [ ] Text appears as it streams (no waiting for full response)
- [ ] Auto-scroll follows new content
- [ ] Copy button copies the full response
- [ ] Long responses are scrollable
- [ ] Markdown is rendered in a read-only viewer

**Effort:** 2.5h

---

#### Task 2.30 — Wire IPC events to ExecutionViewer

**Description:** Connect the IPC event listeners to the ExecutionViewer so it displays real-time execution data.

**Files:**
- `src/pages/ExecutionViewer.tsx` — use `useIpc` hook
- `src/hooks/useIpc.ts` — enhance if needed

**Data flow:**
1. Mount: register IPC event listeners
2. `execution:started` → highlight queue item, clear response area
3. `execution:chunk` → append to response buffer
4. `execution:completed` → mark queue item done, log the result
5. `execution:failed` → mark queue item failed, show error
6. `workflow:completed` → show completion state
7. Unmount: clean up listeners

**Blocked by:** `2.27`, `2.28`, `2.29`
**Blocks:** `2.31`

**Done when:**
- [ ] All events are handled in the viewer
- [ ] Real-time streaming works end-to-end
- [ ] Status updates are reflected immediately
- [ ] Unmounting cleans up listeners (no memory leaks)

**Effort:** 2h

---

#### Task 2.31 — Build ExecutionLogTable

**Description:** Create the table showing execution history for the current workflow session.

**Files:**
- `src/components/execution/ExecutionLogTable.tsx`

**Table columns:**
| Column | Content |
|--------|---------|
| Time | Formatted timestamp (HH:mm:ss) |
| Prompt | Prompt title |
| Status | Status badge (Completed/Failed/Running) |
| Duration | Formatted duration (2.3s) |
| Tokens | Input/Output token count |
| Model | Model used |
| Error | Error message (tooltip, only for failed) |

**Features:**
- Filter: All | Completed | Failed | Running
- Sort by time (newest first)
- Click row to see full response in the response panel
- Auto-scroll to latest on new log entry
- Clear button to clear logs (local only)

**Blocked by:** `2.30`
**Blocks:** `2.32`

**Done when:**
- [ ] Table renders with all columns
- [ ] Filtering works correctly
- [ ] New logs appear without full re-render
- [ ] Error tooltips show on hover
- [ ] Empty state when no logs

**Effort:** 2h

---

#### Task 2.32 — Display loop iteration counter

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

**Done when:**
- [ ] Iteration counter updates in real-time
- [ ] Display format matches loop mode
- [ ] Counter resets on stop

**Effort:** 0.5h

---

#### Task 2.33 — Handle all ExecutionViewer states

**Description:** Ensure the ExecutionViewer correctly handles all possible states, including edge cases.

**Files:**
- `src/pages/ExecutionViewer.tsx` — state handling

**Edge cases:**
- Workflow has no active prompts → "No active prompts" message
- Workflow was deleted during execution → error state
- Network lost during streaming → "Reconnecting..." state
- All prompts disabled → "No active prompts"
- Rapid start/pause/stop → correct state transitions
- Execution viewer opened while workflow is already running → show current state

**Blocked by:** `2.32`
**Blocks:** Phase 2 Gate

**Done when:**
- [ ] All edge cases display appropriate UI
- [ ] No unhandled states cause blank screens or errors
- [ ] State transitions are smooth

**Effort:** 2h

---

### Week 9: API Key Management + Dashboard

---

#### Task 2.34 — Create KeyEncryptor in main process

**Description:** Implement local API key encryption and storage using Electron's `safeStorage`.

**Files:**
- `electron/main/encryption.ts`

```typescript
import { safeStorage } from 'electron';

class KeyEncryptor {
  private storagePath: string;

  constructor() {
    this.storagePath = path.join(app.getPath('userData'), 'keys.json');
  }

  async encrypt(provider: string, apiKey: string): Promise<string> {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption not available on this platform');
    }
    const encrypted = safeStorage.encryptString(apiKey);
    const keyId = uuid.v4();
    // Store encrypted key with metadata
    await this.storeKey(keyId, {
      provider,
      encrypted: encrypted.toString('base64'),
      keyPrefix: apiKey.substring(0, 8) + '...',
      createdAt: new Date().toISOString(),
    });
    return keyId;
  }

  async decrypt(keyId: string): Promise<string> {
    const key = await this.loadKey(keyId);
    const buffer = Buffer.from(key.encrypted, 'base64');
    return safeStorage.decryptString(buffer);
  }

  async list(): Promise<KeyInfo[]> { /* ... */ }
  async delete(keyId: string): Promise<void> { /* ... */ }
}
```

**Blocked by:** `1.24`
**Blocks:** `2.35`

**Done when:**
- [ ] Encryption works on macOS (Keychain)
- [ ] Decryption returns the original key
- [ ] Keys are stored in the app's userData directory
- [ ] Keys are not accessible without decryption
- [ ] Key listing returns only metadata (prefix, provider), not full keys

**Effort:** 2h

---

#### Task 2.35 — Implement api-key IPC handlers

**Description:** Wire up the IPC handlers for API key management.

**Files:**
- `electron/main/ipc/api-keys.ts`
- `electron/preload/index.ts` — add API key methods

```typescript
// Handlers
ipcMain.handle('api-key:encrypt', async (_event, { provider, key }) => {
  const encryptor = new KeyEncryptor();
  return encryptor.encrypt(provider, key);
});

ipcMain.handle('api-key:decrypt', async (_event, { keyId }) => {
  const encryptor = new KeyEncryptor();
  return { key: encryptor.decrypt(keyId) };
});

ipcMain.handle('api-key:list', async () => {
  const encryptor = new KeyEncryptor();
  return { keys: encryptor.list() };
});

ipcMain.handle('api-key:delete', async (_event, { keyId }) => {
  const encryptor = new KeyEncryptor();
  await encryptor.delete(keyId);
  return { success: true };
});
```

**Blocked by:** `2.34`
**Blocks:** `2.36`

**Done when:**
- [ ] All four IPC handlers work correctly
- [ ] Encrypted keys are never returned in responses
- [ ] Only key prefix + provider are sent to renderer

**Effort:** 1h

---

#### Task 2.36 — Build ApiKeysSettings page

**Description:** Create the settings page for managing AI provider API keys.

**Files:**
- `src/pages/ApiKeys.tsx`
- `src/components/settings/ApiKeyCard.tsx`
- `src/components/settings/AddApiKeyDialog.tsx`

**ApiKeyCard:**
- Provider icon (OpenAI green, Anthropic brown, Google blue)
- Key prefix display ("sk-proj-abcd...")
- Provider name
- Last used timestamp
- Delete button (with confirmation)

**AddApiKeyDialog:**
- Provider selector dropdown
- API key input (password field, show/hide toggle)
- "Paste" button (reads clipboard)
- Validation: key format check per provider
- Save button → calls IPC `api-key:encrypt`

**Blocked by:** `2.35`
**Blocks:** `2.37`

**Done when:**
- [ ] Keys are listed with prefix and provider
- [ ] Adding a key encrypts it via IPC
- [ ] Deleting a key removes it permanently
- [ ] Validation rejects invalid keys
- [ ] Empty state when no keys exist

**Effort:** 2.5h

---

#### Task 2.37 — Build DashboardPage with workflow cards

**Description:** Create the main dashboard page showing all workflows with status and quick actions.

**Files:**
- `src/pages/Dashboard.tsx`
- `src/components/workflow/WorkflowCard.tsx`
- `src/components/workflow/WorkflowStatusBadge.tsx`

**WorkflowCard:**
- Workflow name
- Status badge (colored: green=running, yellow=paused, red=error, gray=idle)
- Prompt count ("3 prompts")
- Last execution info ("Last run: 2 min ago")
- Quick actions: Start, Edit, Delete
- Click card to navigate to execution viewer (if running) or editor

**WorkflowStatusBadge:**
- Colored dot + label
- Animation for running (pulsing)
- Tooltip with more detail

**Data loading:**
- `useWorkflows()` on mount
- Real-time `onSnapshot` for status updates

**States:**
| State | Display |
|-------|---------|
| Loading | 3 skeleton cards |
| Empty | "Create your first workflow" with CTA |
| Data | Grid of workflow cards (2 columns) |
| Error | Error message + retry |

**Blocked by:** `2.4`, `2.35`
**Blocks:** `2.38`

**Done when:**
- [ ] Workflows display in a responsive grid
- [ ] Status badges show correct color and label
- [ ] Start/Edit/Delete actions work
- [ ] Clicking a running workflow navigates to execution viewer
- [ ] Empty state has CTA that navigates to new workflow
- [ ] Loading shows skeleton cards

**Effort:** 3h

---

#### Task 2.38 — Add quick stats to dashboard

**Description:** Display aggregate statistics at the top of the dashboard.

**Files:**
- `src/pages/Dashboard.tsx` — add QuickStats section
- `src/hooks/useExecutions.ts` — hook for execution data

**Stats cards:**
- Total Runs (all-time)
- Success Rate (percentage)
- Active Now (count of running workflows)
- Failed Today (count of failed today)

**Data source:** Query executions collection with aggregation.

**Blocked by:** `2.37`
**Blocks:** `2.39`

**Done when:**
- [ ] Stats display correct values
- [ ] Stats update when data changes
- [ ] Loading state shows skeleton stats
- [ ] Zero state shows "0" (not empty)

**Effort:** 1.5h

---

#### Task 2.39 — Wire dashboard cards to execution controls

**Description:** Connect the dashboard Start/Stop/Edit buttons to the actual IPC handlers.

**Files:**
- `src/pages/Dashboard.tsx` — add IPC calls
- `src/components/workflow/WorkflowCard.tsx` — wire button actions

**Actions:**
- Start button → IPC `workflow:start` → navigate to execution viewer
- Stop button (only for running workflows) → IPC `workflow:stop`
- Edit button → navigate to `/workflows/:id`
- Delete button → confirm dialog → Firestore delete → invalidate cache

**Blocked by:** `2.37`, `2.21`
**Blocks:** `2.40`

**Done when:**
- [ ] Start button starts execution and navigates to viewer
- [ ] Stop button (when running) stops execution
- [ ] Edit button navigates to editor
- [ ] Delete removes workflow and updates UI

**Effort:** 1h

---

#### Task 2.40 — Phase 2 Gate testing and bug fix

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
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes

**Blocked by:** `2.33`, `2.39`
**Blocks:** Phase 3

**Effort:** 3h

---

## Phase 3 — Provider Expansion

**Goal:** Support all three V1 AI providers with consistent error handling.
**Duration:** 3 weeks

---

### Week 10: Anthropic Integration

---

#### Task 3.1 — Install @ai-sdk/anthropic and create adapter

**Description:** Install the Anthropic AI SDK package and implement the provider adapter.

**Dependencies:** `@ai-sdk/anthropic`

**Files:**
- `electron/main/providers/anthropic.ts`

```typescript
class AnthropicProvider implements ProviderAdapter {
  async stream(prompt: string, options: ProviderOptions): AsyncIterable<string> {
    const { streamText } = await import('ai');
    const { anthropic } = await import('@ai-sdk/anthropic');

    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const result = await streamText({
      model: anthropic(this.mapModel(options.model)),
      messages,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      abortSignal: options.signal,
    });

    return result.textStream;
  }

  private mapModel(modelId: string): string {
    const map: Record<string, string> = {
      'claude-3-opus': 'claude-3-opus-20240229',
      'claude-3-sonnet': 'claude-3-sonnet-20240229',
      'claude-3-haiku': 'claude-3-haiku-20240307',
    };
    return map[modelId] || 'claude-3-sonnet-20240229';
  }
}
```

**Blocked by:** `2.19`
**Blocks:** `3.2`

**Done when:**
- [ ] Anthropic streaming works for all three Claude models
- [ ] System prompts are correctly formatted
- [ ] AbortSignal cancels requests
- [ ] API key is passed correctly

**Effort:** 2h

---

#### Task 3.2 — Add Anthropic models to ModelSelector

**Description:** Update the model selector UI to include Anthropic models.

**Files:**
- `src/lib/models.ts` — add Anthropic models
- `src/components/workflow/ModelSelector.tsx` — ensure Anthropic group renders

**Blocked by:** `3.1`, `2.13`
**Blocks:** `3.3`

**Done when:**
- [ ] Anthropic models appear in the model selector
- [ ] Models are grouped under "Anthropic" header
- [ ] Selecting a Claude model shows correct max tokens

**Effort:** 0.5h

---

#### Task 3.3 — Test Anthropic streaming end-to-end

**Description:** Test the full execution pipeline with Anthropic models.

**Files:** Test scripts or manual test plan

**Test cases:**
- [ ] Short prompt (10 words) → completes quickly
- [ ] Long prompt (1000 words) → streams correctly
- [ ] System prompt is included in the request
- [ ] Temperature setting affects output
- [ ] Max tokens limit works
- [ ] Abort during streaming stops the request

**Blocked by:** `3.1`
**Blocks:** `3.4`

**Done when:**
- [ ] All test cases pass
- [ ] Streaming performance is comparable to OpenAI
- [ ] No errors in the main process

**Effort:** 1.5h

---

#### Task 3.4 — Register Anthropic in ProviderFactory

**Description:** Create a provider factory that maps model IDs to the correct provider adapter.

**Files:**
- `electron/main/providers/interface.ts` — export factory type
- `electron/main/providers/factory.ts` — central factory

```typescript
class ProviderFactory {
  private static adapters: Map<string, ProviderAdapter> = new Map();

  static register(provider: string, adapter: ProviderAdapter): void {
    this.adapters.set(provider, adapter);
  }

  static getAdapter(model: string): ProviderAdapter {
    if (model.startsWith('gpt')) return this.adapters.get('openai')!;
    if (model.startsWith('claude')) return this.adapters.get('anthropic')!;
    if (model.startsWith('gemini')) return this.adapters.get('google')!;
    throw new Error(`Unknown model: ${model}`);
  }
}

// Register at startup
ProviderFactory.register('openai', new OpenAIProvider());
ProviderFactory.register('anthropic', new AnthropicProvider());
ProviderFactory.register('google', new GoogleProvider());
```

**Blocked by:** `3.1`
**Blocks:** `3.5`

**Done when:**
- [ ] Factory correctly maps all model IDs to providers
- [ ] Unknown models throw a clear error
- [ ] Adapters can be registered at startup

**Effort:** 0.5h

---

#### Task 3.5 — Anthropic integration tests

**Description:** Write unit and integration tests for the Anthropic provider.

**Files:**
- `src/__tests__/providers/anthropic.test.ts`

**Blocked by:** `3.4`
**Blocks:** Phase 3 Gate

**Done when:**
- [ ] Provider adapter unit tests pass
- [ ] Factory routing tests pass
- [ ] Mock tests verify API key passing

**Effort:** 1h

---

### Week 11: Google Gemini Integration

---

#### Task 3.6 — Install @ai-sdk/google and create adapter

**Description:** Install the Google AI SDK package and implement the provider adapter.

**Dependencies:** `@ai-sdk/google`

**Files:**
- `electron/main/providers/google.ts`

```typescript
class GoogleProvider implements ProviderAdapter {
  async stream(prompt: string, options: ProviderOptions): AsyncIterable<string> {
    const { streamText } = await import('ai');
    const { google } = await import('@ai-sdk/google');

    const result = await streamText({
      model: google(this.mapModel(options.model)),
      prompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      abortSignal: options.signal,
    });

    return result.textStream;
  }

  private mapModel(modelId: string): string {
    const map: Record<string, string> = {
      'gemini-1.5-pro': 'gemini-1.5-pro',
      'gemini-1.5-flash': 'gemini-1.5-flash',
    };
    return map[modelId] || 'gemini-1.5-flash';
  }
}
```

**Blocked by:** `2.19`
**Blocks:** `3.7`

**Done when:**
- [ ] Gemini streaming works for Pro and Flash
- [ ] AbortSignal cancels requests
- [ ] API key is passed correctly

**Effort:** 1.5h

---

#### Task 3.7 — Add Google models to ModelSelector

**Description:** Update the model selector UI to include Google models.

**Files:**
- `src/lib/models.ts` — add Google models
- `src/components/workflow/ModelSelector.tsx` — ensure Google group renders

**Blocked by:** `3.6`, `2.13`
**Blocks:** `3.8`

**Done when:**
- [ ] Google models appear in the model selector
- [ ] Models are grouped under "Google" header
- [ ] max tokens for Gemini models is displayed correctly (1M+ tokens)

**Effort:** 0.5h

---

#### Task 3.8 — Test Google streaming end-to-end

**Description:** Test the full execution pipeline with Google models.

**Test cases:**
- [ ] Short prompt → completes quickly
- [ ] Very long prompt (Gemini supports 1M+ tokens)
- [ ] Temperature setting affects output
- [ ] Max tokens limit works
- [ ] Abort during streaming stops the request

**Blocked by:** `3.6`
**Blocks:** `3.9`

**Done when:**
- [ ] All test cases pass
- [ ] Streaming works for both models
- [ ] No errors in main process

**Effort:** 1.5h

---

#### Task 3.9 — Register Google in ProviderFactory

**Description:** Add the Google provider to the ProviderFactory.

**Files:**
- `electron/main/providers/factory.ts` — register Google provider

**Blocked by:** `3.6`
**Blocks:** `3.10`

**Done when:**
- [ ] `ProviderFactory.getAdapter('gemini-1.5-pro')` returns the Google adapter
- [ ] Error handling for missing API keys works

**Effort:** 0.5h

---

#### Task 3.10 — Prevent model/provider mismatches in the UI

**Description:** Ensure the UI only shows models for which the user has configured an API key.

**Files:**
- `src/components/workflow/ModelSelector.tsx` — filter based on configured keys
- `src/hooks/useConfiguredProviders.ts` — hook to get configured providers

```typescript
function useConfiguredProviders(): string[] {
  const apiKeys = useSettingsStore(s => s.apiKeys);
  return apiKeys.filter(k => k.isActive).map(k => k.provider);
}

// In ModelSelector: only show groups where provider has a configured key
const configuredProviders = useConfiguredProviders();
const visibleGroups = MODEL_GROUPS.filter(g =>
  configuredProviders.includes(g.provider)
);
```

**Blocked by:** `3.8`, `2.36`
**Blocks:** `3.11`

**Done when:**
- [ ] Model selector only shows providers with configured API keys
- [ ] If no API keys are configured, show "Add API key" prompt
- [ ] Adding a key in Settings dynamically updates the model selector

**Effort:** 1.5h

---

### Week 12: Provider Error Handling

---

#### Task 3.11 — Implement unified error handling

**Description:** Create a centralized error handling system that categorizes errors and determines recovery strategies.

**Files:**
- `electron/main/engine/retry.ts`

```typescript
interface ErrorClassification {
  category: 'rate_limit' | 'auth' | 'server_error' | 'timeout' | 'network' | 'unknown';
  recoverable: boolean;
  retryable: boolean;
  message: string;
}

function classifyError(error: any): ErrorClassification {
  if (error?.status === 429) {
    return { category: 'rate_limit', recoverable: true, retryable: true,
             message: 'Rate limited. Retrying with backoff...' };
  }
  if (error?.status === 401) {
    return { category: 'auth', recoverable: true, retryable: false,
             message: 'Invalid API key. Please check your key.' };
  }
  if (error?.status >= 500) {
    return { category: 'server_error', recoverable: true, retryable: true,
             message: 'Provider server error. Retrying...' };
  }
  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNABORTED') {
    return { category: 'timeout', recoverable: true, retryable: true,
             message: 'Request timed out. Retrying...' };
  }
  if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
    return { category: 'network', recoverable: true, retryable: true,
             message: 'Network error. Check your connection.' };
  }
  return { category: 'unknown', recoverable: false, retryable: false,
           message: error?.message || 'Unknown error' };
}
```

**Blocked by:** `2.23`
**Blocks:** `3.12`

**Done when:**
- [ ] All provider error types are classified
- [ ] Classification includes recovery strategy
- [ ] Error messages are user-friendly

**Effort:** 1.5h

---

#### Task 3.12 — Implement exponential backoff retry

**Description:** Add an exponential backoff retry mechanism to the execution engine.

**Files:**
- `electron/main/engine/retry.ts` — retry function
- `electron/main/engine/runner.ts` — integrate retry

```typescript
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, baseDelayMs: 2000, maxDelayMs: 30000 }
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const classification = classifyError(error);

      if (!classification.retryable || attempt === config.maxRetries) {
        throw error;
      }

      const delay = Math.min(
        config.baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000,
        config.maxDelayMs
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

**Blocked by:** `3.11`
**Blocks:** `3.13`

**Done when:**
- [ ] Rate limits trigger exponential backoff
- [ ] Timeout errors retry with backoff
- [ ] Auth errors are not retried
- [ ] Max retries limit is respected
- [ ] Jitter is added to prevent thundering herd

**Effort:** 2h

---

#### Task 3.13 — Handle provider-specific errors in UI

**Description:** Display provider-specific error messages in the execution viewer with actionable guidance.

**Files:**
- `src/components/execution/ErrorDisplay.tsx`

```typescript
interface ErrorDisplayProps {
  error: {
    code: string;
    message: string;
    recoverable: boolean;
    provider: string;
  };
  onRetry: () => void;
  onConfigureKey: () => void;
}
```

**Error behaviors by type:**
| Error | Display | Action |
|-------|---------|--------|
| Rate limited | "OpenAI is rate limiting. Waiting 15s..." | Auto-retry countdown |
| Invalid key | "Anthropic API key is invalid" | "Configure API Key" button |
| Server error | "Gemini is experiencing issues" | Retry button |
| Timeout | "Request timed out after 120s" | Retry button |
| Network | "No internet connection" | "Check connection" button |

**Blocked by:** `3.12`
**Blocks:** `3.14`

**Done when:**
- [ ] Error messages are provider-specific
- [ ] Actionable buttons are provided where possible
- [ ] Auto-retry shows countdown or progress
- [ ] Non-recoverable errors show clear next steps

**Effort:** 2h

---

#### Task 3.14 — Rate limit detection and throttling

**Description:** Implement per-provider rate limit tracking to avoid hitting limits.

**Files:**
- `electron/main/engine/rate-limiter.ts`

```typescript
class RateLimiter {
  private limits: Map<string, { requests: number; resetTime: number }> = new Map();

  async throttle(provider: string): Promise<void> {
    // Track requests per minute per provider
    // If approaching limit, add artificial delay
  }

  recordRequest(provider: string): void { /* ... */ }
  recordRateLimit(provider: string, retryAfterMs: number): void { /* ... */ }
  getWaitTime(provider: string): number { /* ... */ }
}
```

**Blocked by:** `3.12`
**Blocks:** `3.15`

**Done when:**
- [ ] Rate limits are tracked per provider
- [ ] Throttling adds delays before requests if approaching limits
- [ ] `retry-after` headers from provider responses are respected
- [ ] Rate limit state resets after the window

**Effort:** 2h

---

#### Task 3.15 — Provider-specific config UI

**Description:** Add provider-specific configuration options (custom base URLs, etc.).

**Files:**
- `src/components/settings/ProviderConfig.tsx`

**Config options:**
- Custom base URL (for OpenAI-compatible APIs like Together, Groq)
- Connection timeout (per provider)
- Max retries (per provider)
- Rate limit threshold (requests per minute)

**Blocked by:** `3.14`
**Blocks:** `3.16`

**Done when:**
- [ ] Custom base URL can be configured per provider
- [ ] Timeout and retry settings are per-provider
- [ ] Config is stored and persisted

**Effort:** 2h

---

#### Task 3.16 — Phase 3 Gate testing

**Description:** Run through the Phase 3 checklist and ensure all providers work consistently.

**Checklist:**
- [ ] OpenAI models work with streaming
- [ ] Anthropic models work with streaming
- [ ] Google models work with streaming
- [ ] Model selector shows only configured providers
- [ ] Rate limits handled with backoff
- [ ] Provider errors display actionable messages
- [ ] Retry mechanism recovers from transient failures
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes

**Blocked by:** `3.13`, `3.15`
**Blocks:** Phase 4

**Effort:** 3h

---

## Phase 4 — Desktop Polish

**Goal:** Desktop-native experience — tray, notifications, auto-update, keyboard shortcuts.
**Duration:** 4 weeks

---

### Week 13: System Tray

---

#### Task 4.1 — Create TrayManager class

**Description:** Implement the system tray manager that creates and manages the tray icon.

**Files:**
- `electron/main/tray.ts`

```typescript
class TrayManager {
  private tray: Tray | null = null;
  private status: 'idle' | 'running' | 'paused' | 'error' = 'idle';

  create(): void {
    this.tray = new Tray(this.getIconPath());
    this.tray.setToolTip('PromptLoop');
    this.updateContextMenu();
    this.tray.on('click', () => this.toggleWindow());
  }

  setStatus(status: WorkflowStatus): void {
    this.status = status;
    this.tray?.setImage(this.getIconPath());
    this.updateContextMenu();
  }

  private getIconPath(): string {
    // Return different icon based on status
    const icons = {
      idle: 'tray-idle.png',
      running: 'tray-running.png',
      paused: 'tray-paused.png',
      error: 'tray-error.png',
    };
    return path.join(__dirname, '../../resources', icons[this.status]);
  }

  private updateContextMenu(): void {
    const menu = Menu.buildFromTemplate([
      { label: 'Open PromptLoop', click: () => this.showWindow() },
      { type: 'separator' },
      { label: 'Start', click: () => this.sendAction('start'), enabled: this.status === 'idle' },
      { label: 'Pause', click: () => this.sendAction('pause'), enabled: this.status === 'running' },
      { label: 'Stop', click: () => this.sendAction('stop'), enabled: this.status === 'running' || this.status === 'paused' },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]);
    this.tray?.setContextMenu(menu);
  }
}
```

**Blocked by:** `2.21` (needs execution engine)
**Blocks:** `4.2`

**Done when:**
- [ ] Tray icon appears in the system tray
- [ ] Icon changes based on workflow status
- [ ] Context menu shows correct options based on state
- [ ] Actions work (Start/Pause/Stop)
- [ ] Clicking tray toggles window visibility

**Effort:** 3h

---

#### Task 4.2 — Create tray icons

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

**Design guidelines:**
- Template-based (PromptLoop logo or simple circle indicator)
- Recognizable at small sizes (16x16)
- Color-blind friendly (use shapes in addition to colors)
- macOS: template images (black and white, OS tints)
- Windows: full color

**Blocked by:** `4.1`
**Blocks:** `4.3`

**Done when:**
- [ ] Icons exist for all states
- [ ] Retina versions exist
- [ ] Icons are recognizable at 16x16
- [ ] Icons look correct on both light and dark menu bars

**Effort:** 2h

---

#### Task 4.3 — Implement minimize-to-tray behavior

**Description:** When the user closes the window, minimize to tray instead of quitting.

**Files:**
- `electron/main/window.ts` — handle close event
- `electron/main/tray.ts` — show/hide window
- `src/store/settingsStore.ts` — `minimizeToTrayOnClose` option

```typescript
// In window creation:
mainWindow.on('close', (event) => {
  if (settingsStore.get('minimizeToTrayOnClose')) {
    event.preventDefault();
    mainWindow.hide();
  }
});
```

**Blocked by:** `4.1`
**Blocks:** `4.4`

**Done when:**
- [ ] Closing window minimizes to tray (if setting is enabled)
- [ ] Clicking tray icon shows the window
- [ ] Cmd+Q still quits the app
- [ ] Setting can disable minimize-to-tray (window closes normally)

**Effort:** 1.5h

---

#### Task 4.4 — Add tray tooltip with workflow info

**Description:** Update the tray tooltip to show the active workflow name and status.

**Files:**
- `electron/main/tray.ts` — update tooltip on status change

```typescript
updateTooltip(workflowName?: string): void {
  const statusLabels = {
    idle: 'Idle',
    running: 'Running',
    paused: 'Paused',
    error: 'Error',
  };
  const name = workflowName ? ` - ${workflowName}` : '';
  this.tray?.setToolTip(`PromptLoop: ${statusLabels[this.status]}${name}`);
}
```

**Blocked by:** `4.3`
**Blocks:** `4.5`

**Done when:**
- [ ] Tooltip shows "PromptLoop: Running - Content Generator"
- [ ] Tooltip updates when workflow state changes
- [ ] Tooltip shows "PromptLoop: Idle" when no workflow is active

**Effort:** 0.5h

---

#### Task 4.5 — Wire tray actions to execution engine

**Description:** Connect the tray context menu actions (Start/Pause/Stop) to the execution engine.

**Files:**
- `electron/main/tray.ts` — emit IPC-like events
- `electron/main/index.ts` — wire tray events to engine

```typescript
// Tray action callbacks
private sendAction(action: 'start' | 'pause' | 'stop'): void {
  const activeId = getActiveWorkflowId();
  if (!activeId) return;

  switch (action) {
    case 'start':
      this.executionEngine.start(activeId);
      break;
    case 'pause':
      this.executionEngine.pause(activeId);
      break;
    case 'stop':
      this.executionEngine.stop(activeId);
      break;
  }
}
```

**Blocked by:** `4.4`, `2.21`
**Blocks:** `4.6`

**Done when:**
- [ ] Tray "Start" starts the active workflow
- [ ] Tray "Pause" pauses the running workflow
- [ ] Tray "Stop" stops the workflow
- [ ] Menu items enable/disable based on state

**Effort:** 1h

---

#### Task 4.6 — System tray cross-platform testing

**Description:** Test system tray functionality on all target platforms.

**Test plan:**
- [ ] macOS: menu bar extra, template images, dark mode support
- [ ] Windows: system tray notification area, balloon tooltips
- [ ] Linux: indicator area (AppIndicator or GtkStatusIcon)

**Blocked by:** `4.5`
**Blocks:** Phase 4 Gate

**Done when:**
- [ ] Tray works on the primary development platform (macOS)
- [ ] Known platform differences are documented
- [ ] Fallback behavior for platforms without tray support

**Effort:** 1h

---

### Week 14: Desktop Notifications

---

#### Task 4.7 — Implement NotificationManager

**Description:** Create a notification manager that sends desktop notifications for workflow events.

**Files:**
- `electron/main/notifications.ts`

```typescript
class NotificationManager {
  sendWorkflowCompleted(workflowName: string, stats: ExecutionStats): void {
    new Notification({
      title: 'Workflow Complete',
      body: `${workflowName} finished ${stats.totalExecutions} prompts in ${stats.totalDuration}`,
      silent: false,
    }).show();
  }

  sendWorkflowFailed(workflowName: string, error: string): void {
    new Notification({
      title: 'Workflow Failed',
      body: `${workflowName}: ${error}`,
      silent: false,
    }).show();
  }

  sendRateLimitWarning(provider: string, retryAfter: number): void {
    // Less intrusive — maybe just tray balloon
  }
}
```

**Blocked by:** `4.1`
**Blocks:** `4.8`

**Done when:**
- [ ] Notifications appear on workflow completion
- [ ] Notifications appear on workflow failure
- [ ] Clicking notification brings app to foreground
- [ ] Notifications respect "do not disturb" mode

**Effort:** 2h

---

#### Task 4.8 — Wire notifications to execution events

**Description:** Connect the NotificationManager to the execution engine's completion/failure events.

**Files:**
- `electron/main/index.ts` — listen to execution events
- `electron/main/notifications.ts` — event handlers

```typescript
// In main process setup:
executionEngine.on('workflow:completed', (data) => {
  notificationManager.sendWorkflowCompleted(data.workflowName, data.stats);
});

executionEngine.on('workflow:failed', (data) => {
  notificationManager.sendWorkflowFailed(data.workflowName, data.error);
});
```

**Blocked by:** `4.7`
**Blocks:** `4.9`

**Done when:**
- [ ] Completion triggers a desktop notification
- [ ] Failure triggers a desktop notification
- [ ] Notifications include workflow name and relevant info

**Effort:** 0.5h

---

#### Task 4.9 — Make notifications configurable in settings

**Description:** Add notification preferences to the Settings page.

**Files:**
- `src/pages/Settings.tsx` — notification toggles
- `src/store/settingsStore.ts` — notification preferences
- `electron/main/notifications.ts` — check preferences before showing

**Settings:**
- Enable/disable all notifications
- Enable/disable completion notifications
- Enable/disable failure notifications
- Enable/disable error/warning notifications

**Blocked by:** `4.8`
**Blocks:** `4.10`

**Done when:**
- [ ] Notifications can be toggled on/off in Settings
- [ ] Preferences persist across restarts
- [ ] Disabled notifications don't fire

**Effort:** 1h

---

#### Task 4.10 — Add error/rate limit notifications

**Description:** Send less intrusive notifications for recoverable errors like rate limits.

**Files:**
- `electron/main/notifications.ts` — add rate limit notification

**Rate limit behavior:**
- First occurrence: silent notification (tray balloon on Windows, banner on macOS)
- Repeated occurrences within 5 minutes: suppress (don't spam)
- Show again after 5 minutes of no rate limits

**Blocked by:** `4.9`
**Blocks:** `4.11`

**Done when:**
- [ ] Rate limit notifications show on first occurrence
- [ ] Notifications are suppressed if repeated quickly
- [ ] Notifications resume after quiet period

**Effort:** 1h

---

#### Task 4.11 — Notification cross-platform testing

**Description:** Test notification behavior on all platforms.

**Test cases:**
- [ ] macOS: Notification Center banners
- [ ] macOS: Notification grouping
- [ ] Windows: Toast notifications (Action Center)
- [ ] Windows: Balloon tips for tray
- [ ] Linux: libnotify/DBus notifications
- [ ] Click-to-focus behavior on all platforms

**Blocked by:** `4.10`
**Blocks:** Phase 4 Gate

**Done when:**
- [ ] Notifications work on the primary development platform
- [ ] Known platform differences are documented

**Effort:** 1h

---

### Week 15: Keyboard Shortcuts + Window Management

---

#### Task 4.12 — Register global keyboard shortcuts

**Description:** Register global keyboard shortcuts in the main process that work even when the app is minimized.

**Files:**
- `electron/main/shortcuts.ts`

```typescript
import { globalShortcut } from 'electron';

class ShortcutManager {
  register(): void {
    globalShortcut.register('CommandOrControl+Return', () => {
      // Start/resume workflow
      this.executionEngine.start(getActiveWorkflowId());
    });

    globalShortcut.register('CommandOrControl+Shift+Return', () => {
      // Pause workflow
      this.executionEngine.pause(getActiveWorkflowId());
    });

    globalShortcut.register('CommandOrControl+.', () => {
      // Stop workflow
      this.executionEngine.stop(getActiveWorkflowId());
    });
  }

  unregister(): void {
    globalShortcut.unregisterAll();
  }
}
```

**Blocked by:** `2.21` (needs execution engine)
**Blocks:** `4.13`

**Done when:**
- [ ] Cmd+Enter starts the active workflow
- [ ] Cmd+Shift+Enter pauses/resumes
- [ ] Cmd+. stops the workflow
- [ ] Shortcuts work when app is in background
- [ ] Shortcuts are unregistered on quit

**Effort:** 1.5h

---

#### Task 4.13 — Add renderer-side keyboard shortcuts

**Description:** Register keyboard shortcuts within the renderer that only work when the app is focused.

**Files:**
- `src/hooks/useKeyboardShortcuts.ts`

```typescript
function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (e.target as HTMLElement)?.tagName
      );

      if (isInput) return; // Don't intercept when editing

      if (isCmd && e.key === 'n') {
        e.preventDefault();
        navigate('/workflows/new');
      }
      if (isCmd && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (isCmd && e.key === ',') {
        e.preventDefault();
        navigate('/settings');
      }
      if (e.key === 'Escape') {
        closePanel();
      }
      if (e.key === ' ') {
        // Space toggles play/pause when execution viewer is focused
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
```

**Shortcuts (same as COMPONENT_TREE.md):**

| Shortcut | Action |
|----------|--------|
| Cmd+Enter | Start workflow execution |
| Cmd+Shift+Enter | Pause/resume workflow |
| Cmd+. | Stop workflow |
| Cmd+N | New workflow |
| Cmd+S | Save workflow |
| Cmd+, | Open settings |
| Cmd+W | Close window (minimize to tray if enabled) |
| Cmd+Q | Quit app |
| Escape | Close panel / dialog |
| Space | Toggle play/pause (execution viewer focused) |

**Blocked by:** `4.12`
**Blocks:** `4.14`

**Done when:**
- [ ] All renderer shortcuts work when the app is focused
- [ ] Shortcuts are disabled when editing text inputs
- [ ] No conflicts with Electron's built-in shortcuts

**Effort:** 2h

---

#### Task 4.14 — Build compact window mode

**Description:** Create a compact/mini window mode for the execution viewer that shows just the essentials.

**Files:**
- `electron/main/window.ts` — handle mode switching
- `src/pages/ExecutionViewer.tsx` — compact mode variant

**Compact mode layout:**
```
┌────────────────────────────────┐
│ Status: Running  [▶][⏸][■]    │
│ Iteration 3 of 10             │
├────────────────────────────────┤
│ Prompt: Generate blog ideas   │
│ ┌────────────────────────────┐│
│ │ Here are 10 blog ideas... ││
│ │ ...streaming...           ││
│ └────────────────────────────┘│
│ ██████████░░░░░░░░░░ 3/10    │
└────────────────────────────────┘
```

**Window size:** 400×400 (configurable)

**Behavior:**
- Full mode: 1200×800, all features
- Compact mode: 400×400, execution viewer only
- Mode switchable from View menu or shortcut

**Blocked by:** `2.30` (execution viewer complete)
**Blocks:** `4.15`

**Done when:**
- [ ] Compact window opens with correct size
- [ ] Execution viewer works in compact mode
- [ ] Mode can be toggled
- [ ] Window position is maintained when switching modes

**Effort:** 2.5h

---

#### Task 4.15 — Persist window position, size, and mode

**Description:** Save and restore window state (position, size, mode) across app restarts.

**Files:**
- `electron/main/window.ts` — state persistence
- `electron/shared/types.ts` — WindowState type

```typescript
interface PersistedWindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  mode: 'full' | 'compact';
}

// Save on resize/move
mainWindow.on('resize', debounce(saveWindowState, 500));
mainWindow.on('move', debounce(saveWindowState, 500));

// Restore on create
const savedState = electronStore.get('windowState') as PersistedWindowState;
if (savedState) {
  mainWindow.setBounds({
    x: savedState.x, y: savedState.y,
    width: savedState.width, height: savedState.height,
  });
  if (savedState.isMaximized) mainWindow.maximize();
}
```

**Blocked by:** `4.14`
**Blocks:** `4.16`

**Done when:**
- [ ] Window position persists across restarts
- [ ] Window size persists across restarts
- [ ] Maximized state persists
- [ ] Window mode persists
- [ ] Multi-monitor: position is clamped to available displays

**Effort:** 1.5h

---

#### Task 4.16 — Add app icon

**Description:** Create the application icon in all required sizes and formats.

**Files:**
- `build/icon.icns` — macOS icon (512×512, all sizes)
- `build/icon.ico` — Windows icon (256×256, all sizes)
- `build/icon.png` — Linux icon (512×512)
- `build/icon@2x.png` — Retina Linux icon

**Requirements:**
- macOS: `icon.icns` (or `icon.png` converted automatically)
- Windows: `icon.ico` (or `icon.png` with .ico extension)
- Linux: `icon.png`
- All sizes: 16, 32, 48, 128, 256, 512

**Blocked by:** Nothing
**Blocks:** `4.17`

**Done when:**
- [ ] App icon shows in the dock/taskbar
- [ ] App icon shows in the application switcher
- [ ] App icon shows in About panel
- [ ] App icon shows in the file manager

**Effort:** 2h (design) or 0.5h (asset creation if design exists)

---

#### Task 4.17 — Window mode persistence testing

**Description:** Verify window state persistence works correctly across various scenarios.

**Test cases:**
- [ ] Normal close and reopen → state restored
- [ ] Quit and relaunch → state restored
- [ ] Maximized → close → reopen → still maximized
- [ ] Compact mode → close → reopen → compact mode
- [ ] Move to external monitor → close → reconnect monitor → reopen → position valid
- [ ] Minimize to tray → reopen → state matches

**Blocked by:** `4.15`
**Blocks:** Phase 4 Gate

**Done when:**
- [ ] All test cases pass
- [ ] No "invisible window" scenarios (window off-screen)
- [ ] Fallback position if saved position is off-screen

**Effort:** 1h

---

### Week 16: Auto-Update + Final Polish

---

#### Task 4.18 — Configure electron-updater

**Description:** Set up `electron-updater` with GitHub Releases for automatic app updates.

**Dependencies:** `electron-updater`

**Files:**
- `electron/main/updater.ts`
- `electron-builder.yml` — publish configuration

```yaml
# electron-builder.yml
appId: com.promptloop.app
productName: PromptLoop
directories:
  output: dist
  buildResources: build
mac:
  category: public.app-category.developer-tools
  target:
    - dmg
    - zip
  icon: build/icon.icns
  hardenedRuntime: true
  gatekeeperAssess: false
win:
  target:
    - nsis
    - portable
  icon: build/icon.ico
linux:
  target:
    - AppImage
    - deb
  icon: build/icon.png
  category: Development
publish:
  provider: github
  owner: your-username
  repo: promptloop
  private: false
```

```typescript
// electron/main/updater.ts
import { autoUpdater } from 'electron-updater';

export function setupAutoUpdater(): void {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('app:update-available', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('app:update-progress', {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
    });
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('app:update-downloaded');
  });
}
```

**Blocked by:** `1.1`, GitHub repo setup
**Blocks:** `4.19`

**Done when:**
- [ ] `electron-builder.yml` is configured with GitHub publish
- [ ] Auto-updater checks for updates on startup
- [ ] Update events are sent to the renderer

**Effort:** 2h

---

#### Task 4.19 — Build update UI

**Description:** Create the UI for notifying users about available updates.

**Files:**
- `src/components/settings/UpdateNotification.tsx`
- `src/components/settings/UpdateProgress.tsx`

**Update flow:**
1. App starts → check for updates (silent)
2. Update available → show notification banner
3. User clicks "Download" → download starts
4. Show progress bar during download
5. Download complete → "Restart to Install" button
6. User clicks → app restarts and installs

**States:**
| State | Display |
|-------|---------|
| Checking | "Checking for updates..." |
| Up to date | No notification (or "Up to date" in About) |
| Available | "v2.0.0 available — Download" |
| Downloading | Progress bar with percentage |
| Downloaded | "Restart to install v2.0.0" |
| Error | "Update check failed" |

**Blocked by:** `4.18`
**Blocks:** `4.20`

**Done when:**
- [ ] Update notification shows when update is available
- [ ] Download progress is shown
- [ ] Install button triggers restart and install
- [ ] Manual "Check for Updates" button in Settings → About

**Effort:** 2h

---

#### Task 4.20 — Add loading states and transitions

**Description:** Polish all loading states with skeleton screens, transitions, and loading indicators.

**Files:** Various component files

**Screens to add skeletons:**
- Dashboard: `SkeletonCard` × 3
- Workflow Editor: `Skeleton` for form fields
- Execution Viewer: `Skeleton` for response area
- Settings: `Skeleton` for key list
- Log table: `SkeletonTable` × 5 rows

**Transitions:**
- Page transitions: fade in (100-200ms)
- Queue item status changes: color transition (300ms)
- Streaming text: smooth appearance
- Panel open/close: slide animation (200ms)

**Blocked by:** All Phase 2 pages exist
**Blocks:** `4.21`

**Done when:**
- [ ] All data fetching shows skeleton loading states
- [ ] Transitions are smooth (no layout shifts)
- [ ] Loading states match final layout dimensions

**Effort:** 2h

---

#### Task 4.21 — Performance audit

**Description:** Audit app performance against targets defined in the PRD.

**Metrics to measure:**
- [ ] App startup time < 3s
- [ ] IPC latency (p95) < 50ms
- [ ] Firestore read latency (p95) < 200ms
- [ ] Idle memory < 150 MB
- [ ] Running memory < 400 MB

**Optimizations if needed:**
- Virtual list for large log tables (`react-window`)
- Lazy load route components (`React.Suspense` + `lazy()`)
- Memoize expensive computations (`useMemo`)
- Reduce re-renders with Zustand selectors
- Batch Firestore writes

**Blocked by:** `4.20`
**Blocks:** `4.22`

**Done when:**
- [ ] All performance targets are met
- [ ] Heavy pages (1000+ log entries) are responsive
- [ ] No memory leaks on long-running sessions
- [ ] DevTools performance recording shows no jank

**Effort:** 3h

---

#### Task 4.22 — Sentry error tracking verification

**Description:** Verify Sentry is properly capturing errors in both main and renderer processes.

**Files:**
- `electron/main/sentry.ts`
- `src/lib/sentry.ts`

**Test plan:**
- [ ] Throw an unhandled error in the renderer → appears in Sentry
- [ ] Throw an error in an IPC handler → appears in Sentry
- [ ] User context (user ID, app version) is attached to events
- [ ] Source maps are uploaded for deobfuscation
- [ ] Performance tracing is enabled for key operations

**Blocked by:** `1.27`
**Blocks:** `4.23`

**Done when:**
- [ ] Errors are captured with stack traces
- [ ] User context is attached
- [ ] Source maps are working

**Effort:** 1h

---

#### Task 4.23 — Final bug bash

**Description:** Comprehensive manual testing of all features.

**Test plan:**

_Authentication:_
- [ ] Email/password sign up
- [ ] Email/password sign in
- [ ] Google OAuth sign in
- [ ] GitHub OAuth sign in
- [ ] Sign out
- [ ] Password reset
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
- [ ] All prompts disabled → proper handling

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
- [ ] Provider error handling (disconnect network → error)

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

**Done when:**
- [ ] All test cases pass
- [ ] No critical (P0) bugs
- [ ] No high (P1) bugs
- [ ] All medium (P2) bugs have workarounds or are scheduled for fix

**Effort:** 8h

---

#### Task 4.24 — Phase 4 Gate & Beta release

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

**Effort:** 4h

---

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
