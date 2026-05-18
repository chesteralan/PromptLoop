# Pages, Routes, App, Main — Testing Rules

## 1. `src/pages/ApiKeys.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - On mount: loads API keys via `window.electronAPI.listApiKeys()`
  - Loading state: shows `SkeletonCard` placeholders
  - Empty state: shows `EmptyState` with "Add API Key" action
  - Keys present: renders `ApiKeyCard` for each key
  - "Add Key" button opens `AddApiKeyDialog`
  - `handleSave`: calls `encryptApiKey` then reloads keys
  - `handleDelete`: calls `deleteApiKey` then optimistically removes from local state
  - Load error caught with error toast
- **Mocking requirements:** `window.electronAPI.listApiKeys`, `encryptApiKey`, `deleteApiKey`; `sonner` toast; PageHeader, EmptyState, SkeletonCard, AddApiKeyDialog, ApiKeyCard components
- **Coverage targets:** Loading → empty → keys states; save then reload; optimistic delete; load error
- **Suggested test file location:** `src/test/pages/ApiKeys.test.tsx`

## 2. `src/pages/ExecutionViewer.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - Extracts `workflowId` from URL params
  - Loads workflow and prompts via hooks
  - Loading state: shows `SkeletonCard` placeholders
  - `handleStart`: builds `PromptConfig[]` from enabled prompts; calls `control.startWorkflow`; sets execution status to 'running'
  - `handlePause`: calls `control.pauseWorkflow`; sets status to 'paused'
  - `handleStop`: calls `control.stopWorkflow`; sets status to 'stopped'
  - `handleRetry`: calls `control.retryWorkflow`; resets status to 'idle', clears prompt statuses and response
  - `useExecutionListener()` subscribes to chunk/completed/failed events
  - Shows PromptProgressBar, Queue, StreamingText, Logs when execution is not idle
  - Shows "No enabled prompts" when idle and no enabled prompts
  - Loop iteration badge shown when > 0
  - Logs show latest 50 entries with scroll
  - "Clear" button calls `resetExecution`
- **Mocking requirements:** `react-router-dom` useParams/useNavigate; all hooks (useWorkflow, usePrompts, useExecutionStore, useIpc); all sub-components
- **Coverage targets:** All 4 control actions; idle vs active state; empty prompts; logs rendering
- **Suggested test file location:** `src/test/pages/ExecutionViewer.test.tsx`

## 3. `src/pages/Login.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - Loading state: shows spinner
  - User already authenticated: navigates to `/dashboard` via `useEffect`
  - Unauthenticated: shows sign-in card with OAuth buttons
  - Google sign-in: calls `signInWithGoogle`; shows error toast on failure
  - GitHub sign-in: calls `signInWithGitHub`; shows error toast on failure
- **Mocking requirements:** `react-router-dom` useNavigate; `../../hooks/useAuth`; OAuthButtons, Card components; `sonner` toast
- **Coverage targets:** Loading → unauthenticated → redirect; both sign-in handlers with error
- **Suggested test file location:** `src/test/pages/Login.test.tsx`

## 4. `src/pages/Onboarding.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - No user: early return (no render, no navigation)
  - Loading: fetches user doc from Firestore; shows spinner during fetch
  - `onboardingComplete === true`: redirects to `/dashboard`
  - Form loaded: shows name input (pre-filled from user.displayName or doc.name), disabled email
  - `handleComplete`: updates Firestore doc with name and `onboardingComplete: true`; navigates to `/dashboard`; shows welcome toast
  - Save error: shows error toast
  - "Get Started" button disabled when name empty or saving
- **Mocking requirements:** `react-router-dom` useNavigate; `firebase/firestore` (doc, getDoc, updateDoc); `../../lib/firebase` (db); `../../hooks/useAuth`; Button, Input, Card, toast components
- **Coverage targets:** No user; loading; onboarding complete redirect; form submit success/error; cancellation via `cancelled` flag
- **Suggested test file location:** `src/test/pages/Onboarding.test.tsx`

## 5. `src/pages/Settings.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Theme section: shows 3 buttons (Light, Dark, System); active theme gets `variant='default'`
  - Theme button click calls `setTheme`
  - Window section (Electron only): shows "Minimize to tray" checkbox
  - Browser (`electronAPI` not in window): Window section not rendered
  - Checkbox toggles `minimizeToTrayOnClose`
- **Mocking requirements:** `../../store/settingsStore`; PageHeader, Card, Button components
- **Coverage targets:** All 3 theme buttons; Electron vs browser; checkbox toggle
- **Suggested test file location:** `src/test/pages/Settings.test.tsx`

## 6. `src/pages/WorkflowEditor.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - New workflow (`workflowId === 'new'`): shows "Create Workflow" title; no ImportExportButtons or Delete; save creates new workflow and navigates
  - Existing workflow: loads workflow and prompts from Firestore; syncs local state after initial load
  - Loading state: shows SkeletonCard
  - Workflow not found: shows EmptyState with "Back to Dashboard"
  - Save: calls create or update mutation; resets dirty flag
  - Delete: shows ConfirmDialog; confirms navigates to `/dashboard`
  - Auto-save (useAutoSave): saves workflow name/loopMode/maxIterations after 3s debounce (skipped for new workflows)
  - Create prompt: calls `createPrompt` mutation with defaults; opens editor
  - Prompt changes update local state (optimistic)
  - Toggle enabled: updates local state + calls `updatePrompt`
  - Delete prompt: calls `deletePrompt`
  - Reorder: updates local positions + calls `reorderPrompts`
  - Import: creates new workflow + prompts from imported data; navigates to new workflow
  - beforeunload handler shows confirm dialog when dirty
  - `setIsDirty` on any field change; reset on save
- **Mocking requirements:** `react-router-dom` useParams/useNavigate; all workflow/prompt hooks; AutoSave hook; all sub-components; `beforeunload` event
- **Coverage targets:** New vs existing; save/delete/create/import; dirty flag lifecycle; beforeunload; not found state
- **Suggested test file location:** `src/test/pages/WorkflowEditor.test.tsx`

## 7. `src/pages/Dashboard.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - Loading state: shows SkeletonCard grid
  - Empty workflows: shows EmptyState with "Create Workflow" action
  - Workflows present: renders WorkflowCard grid
  - Stats computed correctly: totalRuns, successRate (0-100%), activeWorkflows, failedToday
  - `statColor()`: >80% green, >50% yellow, <=50% red
  - Delete triggers ConfirmDialog; confirm calls `deleteWorkflow`; shows success/error toast
  - WorkflowCard onStart/onStop/onEdit/onDelete fire correctly
- **Mocking requirements:** `react-router-dom` useNavigate; `../../hooks/useWorkflows`; `../../hooks/useExecutions`; WorkflowCard, SkeletonCard, ConfirmDialog, EmptyState components; `sonner` toast
- **Coverage targets:** All 4 stat values; statColor boundaries; empty vs populated; delete confirm
- **Suggested test file location:** `src/test/pages/Dashboard.test.tsx`

## 8. `src/routes.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - Creates `createHashRouter` with all routes
  - `/login` renders `LoginPage` (lazy loaded)
  - `/onboarding` renders `OnboardingPage` (lazy loaded)
  - `/` and `/dashboard` render `DashboardPage` inside `AppLayout`
  - `/workflows/:workflowId` renders `WorkflowEditorPage`
  - `/workflows/:workflowId/execute` renders `ExecutionViewerPage`
  - `/settings` renders `SettingsPage`
  - `/settings/api-keys` renders `ApiKeysPage`
  - Catch-all `*` redirects to `/`
  - All lazy-loaded routes wrapped in `Suspense` with spinner fallback
- **Mocking requirements:** All page components; `react-router-dom` createHashRouter
- **Coverage targets:** All route paths; catch-all redirect; Suspense fallback
- **Suggested test file location:** `src/test/routes.test.tsx` (extend existing)

## 9. `src/App.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - ErrorBoundary catches render errors; shows error UI with "Reload" button
  - Reload button calls `window.location.reload()`
  - `AppContent` calls `useTheme()` and renders `RouterProvider`
  - App wraps content in ErrorBoundary > TooltipProvider > AppContent
  - Renders `Toaster` from sonner with `richColors` and `bottom-right` position
- **Mocking requirements:** `react-router-dom` RouterProvider; `../../hooks/useTheme`; TooltipProvider, Toaster components
- **Coverage targets:** ErrorBoundary normal vs error state; ErrorBoundary reset via state change
- **Suggested test file location:** `src/test/App.test.tsx`

## 10. `src/main.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - Calls `injectElectronMock()` on startup (catches errors silently)
  - Calls `initRendererSentry()` on startup
  - Creates `QueryClient` with staleTime=30s, retry=1, refetchOnWindowFocus=false
  - Mutation `onError` shows error toast
  - Renders React.StrictMode > QueryClientProvider > AuthProvider > App into `#root`
  - Styles imported from `globals.css`
- **Mocking requirements:** ReactDOM.createRoot; `../../lib/electron-mock`; `../../lib/sentry`; AuthProvider, App, QueryClient
- **Coverage targets:** Electron mock inject success/failure
- **Suggested test file location:** `src/test/main.test.tsx`

---

## Global Rule

All test files must be placed under `src/test/`. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `src/test/components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/test/hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `src/test/electron/main/encryption.test.ts`

This keeps all tests colocated under a single `src/test/` root regardless of whether the source is in `src/` or `electron/`.
