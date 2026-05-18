# Abstraction & Layer Separation — Overview

This directory documents abstraction, layer separation, and architecture improvement opportunities across all source files in the PromptLoop project.

## How to use this guide

Each file documents:

- **Current Layer Mix** — what concerns are entangled
- **Extraction Opportunities** — what could be split into separate modules
- **Interface Suggestions** — where interfaces would improve testability
- **Dependency Direction** — whether dependencies flow correctly (UI → Logic → Data)
- **Duplication** — repeated patterns that could be consolidated
- **Constants/Magic Values** — hardcoded strings/numbers to extract

---

## Source File Checklist

### `electron/main/` (8 files)

- [x] `electron/main/index.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/window.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/encryption.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/sentry.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/tray.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/shortcuts.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/notifications.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)
- [x] `electron/main/updater.ts` → [`docs/abstraction/electron_main_process.md`](electron_main_process.md)

### `electron/main/engine/` (6 files)

- [x] `electron/main/engine/runner.ts` → [`docs/abstraction/electron_engine.md`](electron_engine.md)
- [x] `electron/main/engine/queue.ts` → [`docs/abstraction/electron_engine.md`](electron_engine.md)
- [x] `electron/main/engine/retry.ts` → [`docs/abstraction/electron_engine.md`](electron_engine.md)
- [x] `electron/main/engine/scheduler.ts` → [`docs/abstraction/electron_engine.md`](electron_engine.md)
- [x] `electron/main/engine/events.ts` → [`docs/abstraction/electron_engine.md`](electron_engine.md)
- [x] `electron/main/engine/types.ts` → [`docs/abstraction/electron_engine.md`](electron_engine.md)

### `electron/main/providers/` (5 files)

- [x] `electron/main/providers/interface.ts` → [`docs/abstraction/electron_providers.md`](electron_providers.md)
- [x] `electron/main/providers/factory.ts` → [`docs/abstraction/electron_providers.md`](electron_providers.md)
- [x] `electron/main/providers/openai.ts` → [`docs/abstraction/electron_providers.md`](electron_providers.md)
- [x] `electron/main/providers/anthropic.ts` → [`docs/abstraction/electron_providers.md`](electron_providers.md)
- [x] `electron/main/providers/google.ts` → [`docs/abstraction/electron_providers.md`](electron_providers.md)

### `electron/main/ipc/` (4 files)

- [x] `electron/main/ipc/workflow.ts` → [`docs/abstraction/electron_ipc.md`](electron_ipc.md)
- [x] `electron/main/ipc/execution.ts` → [`docs/abstraction/electron_ipc.md`](electron_ipc.md)
- [x] `electron/main/ipc/api-keys.ts` → [`docs/abstraction/electron_ipc.md`](electron_ipc.md)
- [x] `electron/main/ipc/app.ts` → [`docs/abstraction/electron_ipc.md`](electron_ipc.md)

### `electron/preload/` + `electron/shared/` (2 files)

- [x] `electron/preload/index.ts` → [`docs/abstraction/electron_preload_shared.md`](electron_preload_shared.md)
- [x] `electron/shared/types.ts` → [`docs/abstraction/electron_preload_shared.md`](electron_preload_shared.md)

### `src/components/auth/` (2 files)

- [x] `src/components/auth/AuthProvider.tsx` → [`docs/abstraction/src_components_auth.md`](src_components_auth.md)
- [x] `src/components/auth/OAuthButtons.tsx` → [`docs/abstraction/src_components_auth.md`](src_components_auth.md)

### `src/components/layout/` (4 files)

- [x] `src/components/layout/AppLayout.tsx` → [`docs/abstraction/src_components_layout.md`](src_components_layout.md)
- [x] `src/components/layout/ProtectedRoute.tsx` → [`docs/abstraction/src_components_layout.md`](src_components_layout.md)
- [x] `src/components/layout/Sidebar.tsx` → [`docs/abstraction/src_components_layout.md`](src_components_layout.md)
- [x] `src/components/layout/StatusBar.tsx` → [`docs/abstraction/src_components_layout.md`](src_components_layout.md)

### `src/components/execution/` (3 files)

- [x] `src/components/execution/ExecutionControls.tsx` → [`docs/abstraction/src_components_execution.md`](src_components_execution.md)
- [x] `src/components/execution/StreamingText.tsx` → [`docs/abstraction/src_components_execution.md`](src_components_execution.md)
- [x] `src/components/execution/ErrorDisplay.tsx` → [`docs/abstraction/src_components_execution.md`](src_components_execution.md)

### `src/components/workflow/` (12 files)

- [x] `src/components/workflow/WorkflowSettings.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/PromptCard.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/ImportExportButtons.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/WorkflowStatusBadge.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/WorkflowCard.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/ModelSelector.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/SaveButton.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/QueueItem.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/PromptProgressBar.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/AddPromptButton.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/PromptEditorPanel.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)
- [x] `src/components/workflow/PromptList.tsx` → [`docs/abstraction/src_components_workflow.md`](src_components_workflow.md)

### `src/components/settings/` + `src/components/shared/` (7 files)

- [x] `src/components/settings/AddApiKeyDialog.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)
- [x] `src/components/settings/ApiKeyCard.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)
- [x] `src/components/shared/ConfirmDialog.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)
- [x] `src/components/shared/SkeletonTable.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)
- [x] `src/components/shared/PageHeader.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)
- [x] `src/components/shared/EmptyState.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)
- [x] `src/components/shared/SkeletonCard.tsx` → [`docs/abstraction/src_components_settings_shared.md`](src_components_settings_shared.md)

### `src/components/ui/` (19 files)

- [x] `src/components/ui/input.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/button.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/table.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/card.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/input-group.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/dropdown-menu.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/select.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/textarea.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/tooltip.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/tabs.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/switch.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/skeleton.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/sheet.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/separator.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/scroll-area.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/progress.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/label.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/dialog.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/badge.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/avatar.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)
- [x] `src/components/ui/command.tsx` → [`docs/abstraction/src_components_ui.md`](src_components_ui.md)

### `src/pages/` + `src/routes.tsx` + `src/App.tsx` + `src/main.tsx` (10 files)

- [x] `src/pages/Dashboard.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/pages/WorkflowEditor.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/pages/ExecutionViewer.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/pages/Onboarding.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/pages/Settings.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/pages/ApiKeys.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/pages/Login.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/routes.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/App.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)
- [x] `src/main.tsx` → [`docs/abstraction/src_pages.md`](src_pages.md)

### `src/hooks/` (10 files)

- [x] `src/hooks/useAuth.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useWorkflows.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/usePrompts.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useExecutions.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useConfiguredProviders.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useAutoSave.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useKeyboardShortcuts.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useIpc.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useTheme.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)
- [x] `src/hooks/useWorkflowSnapshot.ts` → [`docs/abstraction/src_hooks.md`](src_hooks.md)

### `src/lib/` (7 files)

- [x] `src/lib/utils.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)
- [x] `src/lib/converters.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)
- [x] `src/lib/firebase.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)
- [x] `src/lib/ipc.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)
- [x] `src/lib/models.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)
- [x] `src/lib/sentry.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)
- [x] `src/lib/electron-mock.ts` → [`docs/abstraction/src_lib.md`](src_lib.md)

### `src/store/` (4 files)

- [x] `src/store/workflowStore.ts` → [`docs/abstraction/src_stores.md`](src_stores.md)
- [x] `src/store/executionStore.ts` → [`docs/abstraction/src_stores.md`](src_stores.md)
- [x] `src/store/settingsStore.ts` → [`docs/abstraction/src_stores.md`](src_stores.md)
- [x] `src/store/index.ts` → [`docs/abstraction/src_stores.md`](src_stores.md)

### `src/test/` (5 files)

- [x] `src/test/stores.test.ts` → [`docs/abstraction/src_test.md`](src_test.md)
- [x] `src/test/example.test.ts` → [`docs/abstraction/src_test.md`](src_test.md)
- [x] `src/test/setup.ts` → [`docs/abstraction/src_test.md`](src_test.md)
- [x] `src/test/routes.test.tsx` → [`docs/abstraction/src_test.md`](src_test.md)
- [x] `src/test/auth.test.tsx` → [`docs/abstraction/src_test.md`](src_test.md)

---

## Cross-Cutting Findings

### Top Layer Violations

| Violation                            | Location           | Impact                                                  |
| ------------------------------------ | ------------------ | ------------------------------------------------------- |
| Firestore data access in layout      | `AppLayout.tsx:21` | UI reads Firestore directly for onboarding check        |
| IPC call in layout                   | `StatusBar.tsx:11` | Status bar fuses Electron API with presentation         |
| Electron mock in entry               | `main.tsx:13`      | Dev-only concern injected at production entry           |
| Inline `window.electronAPI` calls    | Multiple pages     | No abstraction layer over IPC — hard to test            |
| Firebase Auth + Firestore in context | `AuthProvider.tsx` | Auth provider mixes auth state, user CRUD, OAuth config |

### Most Duplicated Patterns

1. **Firestore CRUD hooks** — `useWorkflows.ts` and `usePrompts.ts` share ~80% identical code (query/mutation pattern, ref builders, error handling, invalidation).
2. **Loading/Error/Empty state** — Every page repeats `isLoading ? <Skeleton /> : data.length === 0 ? <EmptyState /> : <Content />`.
3. **Delete confirmation** — `PromptCard`, `ApiKeyCard`, `DashboardPage` all repeat the same `showDelete`/`ConfirmDialog` state machine.
4. **Status → Color/Label maps** — `StatusBar`, `WorkflowStatusBadge`, `tray.ts`, `QueueItem`, `PromptProgressBar`, `ErrorDisplay` all define status-to-display mappings independently.
5. **Provider models** — Model definitions in `src/lib/models.ts` duplicate `electron/main/providers/*.ts` model lists.
6. **Firebase mock setup** — `routes.test.tsx` and `auth.test.tsx` have identical `vi.mock` blocks.

### Suggested Shared Modules to Create

| Module                                    | Contents                                          | Source Files That Need It                                    |
| ----------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `src/lib/env.ts`                          | `isElectron`, `isBrowser`, platform detection     | `AuthProvider`, `SettingsPage`, `main.tsx`                   |
| `src/lib/firestore-refs.ts`               | `workflowsRef(uid)`, `promptsRef(uid, wid)`, etc. | `useWorkflows`, `usePrompts`, `useWorkflowSnapshot`          |
| `src/lib/query-keys.ts`                   | Key factory functions                             | `useWorkflows`, `usePrompts`, `useExecutions`                |
| `src/lib/status-config.ts`                | Unified status → color/label/icon maps            | `StatusBar`, `WorkflowStatusBadge`, `QueueItem`, etc.        |
| `src/lib/workflow-config.ts`              | Loop mode labels, default values                  | `WorkflowSettings`, `WorkflowEditorPage`                     |
| `src/lib/api-key-utils.ts`                | `isValidProvider`, `KEY_PREFIXES`, validation     | `AddApiKeyDialog`, `api-keys.ts` IPC                         |
| `src/lib/provider-config.ts`              | Provider colors, labels, model lists              | `ApiKeyCard`, `ModelSelector`, `AddApiKeyDialog`             |
| `src/lib/file-service.ts`                 | Wrapper around `electronAPI` file dialogs         | `ImportExportButtons`, future file operations                |
| `src/components/shared/LoadingScreen.tsx` | Spinner component                                 | `AppLayout`, `ProtectedRoute`, `OnboardingPage`, `LoginPage` |
| `src/test/test-utils.tsx`                 | `renderWithProviders`, `simulateAuth` helpers     | `routes.test.tsx`, `auth.test.tsx`                           |

### Dependency Direction Guidelines

```
Browser (React)
    ↓
Pages (src/pages/)          ← composition only, no business logic
    ↓
Components (src/components/) ← mostly presentational; store access OK
    ↓
Hooks (src/hooks/)           ← data access + business logic via hooks
    ↓
Lib (src/lib/)               ← pure utilities, type defs, Firebase init
    ↓
Stores (src/store/)          ← local UI state (Zustand)
```

```
Electron Main Process
    ↓
IPC Handlers (ipc/*.ts)      ← thin marshalling layer
    ↓
Engine (engine/*.ts)         ← business logic (runner, retry, queue)
    ↓
Providers (providers/*.ts)   ← AI provider adapters
    ↓
Platform (encryption, tray, etc.)
```

### Current Violations

- **Stores mix UI state with data that should be in React Query** — `workflowStore` is updated by `useWorkflowSnapshot` (Firestore realtime listener) while React Query already caches the same data. Two sources of truth.
- **Pages call `window.electronAPI` directly** — no service layer between page components and Electron IPC.
- **Hooks access Firestore directly** — `useWorkflows`, `usePrompts`, `useExecutions` embed Firestore query logic inside React hooks rather than behind a repository interface.
- **Engine types duplicated in frontend** — `PromptConfig`, `RunnerState`, `ExecutionStatus` are defined in both `electron/main/engine/types.ts` and `src/store/executionStore.ts`/`src/lib/converters.ts`.
