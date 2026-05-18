# Abstraction Rules: Pages & App Entry

**Files:** `src/pages/Dashboard.tsx`, `WorkflowEditor.tsx`, `ExecutionViewer.tsx`, `Onboarding.tsx`, `Settings.tsx`, `ApiKeys.tsx`, `Login.tsx`, `src/routes.tsx`, `src/App.tsx`, `src/main.tsx`

---

## `src/pages/Dashboard.tsx`

### Current Layer Mix

- Dashboard stats computation (business logic), workflow CRUD (data access), and page layout (UI) all mixed.
- Firestore data fetched via custom hooks, but delete logic inline.
- `statColor` function (presentation logic) mixed with page component.

### Extraction Opportunities

- Extract `statColor` into `src/lib/dashboard-utils.ts`.
- Extract stats computation into `useDashboardStats(workflows, executions)` hook.
- Extract stat card rendering into a `StatCard` component.

### Interface Suggestions

- `DashboardStats` interface for the stats array shape.

### Dependency Direction

- ✅ Uses `useWorkflows`, `useExecutions`, `useDeleteWorkflow` — correct delegation to hooks.
- ⚠️ Inline `window.electronAPI.stopWorkflow(wf.id)` — should go through `useWorkflowControl`.

### Duplication

- Delete confirmation pattern duplicates `PromptCard`, `ApiKeyCard`.
- `toast.success`/`toast.error` pattern repeated.
- Loading skeleton grid duplicated across pages.

### Constants/Magic Values

- `80`, `50` (stat thresholds), stat labels and colors, `'Workflow deleted'`, `'Failed to delete workflow'`.

---

## `src/pages/WorkflowEditor.tsx`

### Current Layer Mix

- **Heaviest page** — form state (name, loopMode, maxIterations, localPrompts), Firestore CRUD (7+ mutations), drag-reorder, auto-save, import/export, dialog management, and navigation all in one file.

### Extraction Opportunities

- Extract workflow form state into `useWorkflowForm(workflow)` hook.
- Extract import logic into `useWorkflowImport()` hook.
- Extract the auto-save wiring is already in `useAutoSave` — good. ✅
- Extract prompt management callbacks into `usePromptManager(workflowId, localPrompts, setLocalPrompts)`.

### Interface Suggestions

- `WorkflowFormState` interface: `{ name, loopMode, maxIterations, localPrompts, selectedPromptId, editorOpen }`.
- `PromptManagerActions` interface: `{ createPrompt, updatePrompt, deletePrompt, reorderPrompts }`.

### Dependency Direction

- ✅ Delegates data access to hooks (`useWorkflow`, `usePrompts`, `useCreateWorkflow`, etc.) — correct.
- ⚠️ `useAutoSave` runs on `workflowData` but doesn't save prompts — prompts are only saved on explicit toggle/reorder.

### Duplication

- `name: name.trim()` / `loopMode` / `maxIterations` mapping repeated in both `handleSave` and `handleAutoSave`.
- `createPrompt.mutateAsync` called with same shape in both `handleCreatePrompt` and `handleImport`.
- `SkeletonCard` loading state duplicated across all pages.

### Constants/Magic Values

- `'new'` (magic workflow ID), `'Workflow'` (fallback name), `'single'` (default loop mode), `1` (default maxIterations), `3000` (auto-save delay), `'New Prompt'`, `'gpt-4o'`, `1.0`, `1024`, `' (imported)'` suffix.

---

## `src/pages/ExecutionViewer.tsx`

### Current Layer Mix

- Execution control flow (start/pause/stop/retry), IPC listener setup, prompt status tracking, and UI rendering all mixed.

### Extraction Opportunities

- Extract execution control state into `useExecutionControls(workflowId)` hook.
- Extract prompt status tracking into `usePromptStatuses(enabledPrompts)` hook.
- Extract custom `PromptConfig` construction into a `usePromptConfigs(enabledPrompts)` hook.

### Interface Suggestions

- `PromptConfigBuilder` interface: `toPromptConfig(prompt): PromptConfig`.

### Dependency Direction

- ✅ Uses `useExecutionStore`, `useIpc`, `useWorkflow`, `usePrompts` — correct.
- ✅ UI rendering separated from logic for the most part.

### Duplication

- `setLoading(true)` / `await control.xxx()` / `setLoading(false)` pattern repeated in all 4 handlers — extract `withLoading(fn)` wrapper.
- `useExecutionStore.getState().setExecutionStatus(...)` called inline in handlers — should use store's actions directly.

### Constants/Magic Values

- `'single'`, `'gpt-4o'`, `1.0`, `1024`, `0` (default delay), `'Execution Viewer'`, log prompt ID truncation (`slice(0, 8)`).

---

## `src/pages/Onboarding.tsx`

### Current Layer Mix

- Firestore data access (`getDoc`, `updateDoc`), navigation logic, and form UI all mixed.

### Extraction Opportunities

- Extract Firestore user doc operations into `useUserDocument(user)` hook.
- Extract loading spinner into shared component.

### Interface Suggestions

- `OnboardingService` interface: `getProfile(uid): Promise<UserProfile>`, `completeOnboarding(uid, name): Promise<void>`.

### Dependency Direction

- ⚠️ Direct Firestore `getDoc`/`updateDoc` calls — should delegate to a user service hook.
- ✅ Uses `useAuth`.

### Duplication

- Loading spinner duplicated.
- `toast.success`/`toast.error` pattern.
- `if (!loaded) return <LoadingScreen />` pattern.

### Constants/Magic Values

- `'users'` collection, `onboardingComplete` field, `'Welcome to PromptLoop!'`, `'Failed to save profile'`, `'Profile'`, `'Your name'`.

---

## `src/pages/Settings.tsx`

### Current Layer Mix

- Theme selection (UI) mixed with window behavior toggle and `isElectron` checks.

### Extraction Opportunities

- Extract `themes` config into `src/lib/theme-config.ts`.
- Extract the window behavior section into a `WindowSettingsCard` component.

### Interface Suggestions

- None — component is reasonably small.

### Dependency Direction

- ✅ Uses `useSettingsStore` — correct.
- ⚠️ Inline `isElectron` check (`typeof window !== 'undefined' && 'electronAPI' in window`) — should use shared `env.ts` utility.

### Duplication

- `isElectron` check duplicated from `AuthProvider`.
- Theme toggle button pattern duplicated from `Sidebar.tsx`.

### Constants/Magic Values

- `'light'`/`'dark'`/`'system'`, theme labels, `'Settings'`, `'Theme'`, `'Window'`.

---

## `src/pages/ApiKeys.tsx`

### Current Layer Mix

- Key list state management, CRUD operations, and page layout all mixed.

### Extraction Opportunities

- Extract key management state into `useApiKeys()` hook.
- Extract `handleSave`/`handleDelete` into the hook.

### Interface Suggestions

- `ApiKeyManager` interface: `loadKeys(): void`, `handleSave(provider, key): Promise<void>`, `handleDelete(id): Promise<void>`.

### Dependency Direction

- ✅ Direct `window.electronAPI` calls — acceptable for this page, but could be wrapped in a service.

### Duplication

- `setLoading(true)` / `try` / `catch` / `finally` pattern duplicated for `loadKeys` and could be extracted.

### Constants/Magic Values

- `'API Keys'`, `'Add Key'`, `'No API keys configured'`, `'Add API Key'` (action label).

---

## `src/pages/Login.tsx`

### Current Layer Mix

- Auth redirect logic and OAuth button wrapper — well-separated.

### Extraction Opportunities

- None.

### Interface Suggestions

- None.

### Dependency Direction

- ✅ Uses `useAuth` and `OAuthButtons` — correct.

### Duplication

- Loading spinner.
- `toast.error` pattern.

### Constants/Magic Values

- `'Failed to sign in with Google'`, `'Failed to sign in with GitHub'`, `'PromptLoop'`, `'Sign in'`.

---

## `src/routes.tsx`

### Current Layer Mix

- Route configuration with lazy loading — well-separated.

### Extraction Opportunities

- Extract `SuspenseWrapper` into a shared component.
- Extract `NotFoundPage` into a shared component.

### Interface Suggestions

- None — router configuration is clean.

### Dependency Direction

- ✅ Correctly lazy-loads page components.

### Duplication

- `SuspenseWrapper` wrapping each route element repeated — could use `React Router`'s `element` handling or a layout route.

### Constants/Magic Values

- Route paths, page component chunks.

---

## `src/App.tsx`

### Current Layer Mix

- Error boundary class component, theme initialization, provider nesting — well-separated.

### Extraction Opportunities

- Extract `ErrorBoundary` into `src/components/shared/ErrorBoundary.tsx`.

### Interface Suggestions

- Already well-typed with error info and state.

### Dependency Direction

- ✅ Correctly composes `TooltipProvider`, `Toaster`, and router.

### Duplication

- N/A.

### Constants/Magic Values

- `'Something went wrong'`, `'Reload'`, `'bottom-right'` (toast position).

---

## `src/main.tsx`

### Current Layer Mix

- Entry point — React root render, `QueryClient` setup, `AuthProvider` wrapping, Sentry init, and Electron mock injection.

### Extraction Opportunities

- Extract `queryClient` config into `src/lib/query-client.ts`.
- Extract `createQueryClient()` function for test reuse.

### Interface Suggestions

- None — entry point is appropriately minimal.

### Dependency Direction

- ✅ Correctly composes `AuthProvider` → `App` inside `StrictMode` and `QueryClientProvider`.

### Duplication

- Retry/config duplication if query client is recreated elsewhere.

### Constants/Magic Values

- `30_000` (staleTime), `1` (retry), `'An unexpected error occurred'`.
