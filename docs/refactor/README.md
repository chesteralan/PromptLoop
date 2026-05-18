# Frontend Refactor Rules

This directory contains per-group refactor analysis for every TypeScript/TSX source file in the project, aligned to the [Frontend Refactor Standards](../planning/FRONTEND_REFACTOR_STANDARDS.md).

## Priority Summary

| Priority   | Count | Description                                                                                                         |
| ---------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| **High**   | 5     | Duplicate provider adapters, massive WorkflowEditor component, duplicate CRUD hooks, duplicate Firestore converters |
| **Medium** | 12    | Module-level mutable state, silent error handling, unsafe casts, import ordering, excessive effects                 |
| **Low**    | 8     | Stub code, console.log, minor accessibility, trivial tests                                                          |

## Files by Group

### Electron

- [x] `electron/main/index.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/window.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/updater.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/sentry.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/tray.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/notifications.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/shortcuts.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/encryption.ts` — [electron_main_process.md](electron_main_process.md)
- [x] `electron/main/engine/runner.ts` — [electron_engine.md](electron_engine.md)
- [x] `electron/main/engine/queue.ts` — [electron_engine.md](electron_engine.md)
- [x] `electron/main/engine/scheduler.ts` — [electron_engine.md](electron_engine.md)
- [x] `electron/main/engine/retry.ts` — [electron_engine.md](electron_engine.md)
- [x] `electron/main/engine/types.ts` — [electron_engine.md](electron_engine.md)
- [x] `electron/main/engine/events.ts` — [electron_engine.md](electron_engine.md)
- [x] `electron/main/providers/interface.ts` — [electron_providers.md](electron_providers.md)
- [x] `electron/main/providers/factory.ts` — [electron_providers.md](electron_providers.md)
- [x] `electron/main/providers/openai.ts` — [electron_providers.md](electron_providers.md)
- [x] `electron/main/providers/anthropic.ts` — [electron_providers.md](electron_providers.md)
- [x] `electron/main/providers/google.ts` — [electron_providers.md](electron_providers.md)
- [x] `electron/main/ipc/workflow.ts` — [electron_ipc.md](electron_ipc.md)
- [x] `electron/main/ipc/execution.ts` — [electron_ipc.md](electron_ipc.md)
- [x] `electron/main/ipc/api-keys.ts` — [electron_ipc.md](electron_ipc.md)
- [x] `electron/main/ipc/app.ts` — [electron_ipc.md](electron_ipc.md)
- [x] `electron/preload/index.ts` — [electron_preload_shared.md](electron_preload_shared.md)
- [x] `electron/shared/types.ts` — [electron_preload_shared.md](electron_preload_shared.md)
- [x] `electron/electron-env.d.ts` — No violations

### Auth

- [x] `src/components/auth/AuthProvider.tsx` — [src_components_auth.md](src_components_auth.md)
- [x] `src/components/auth/OAuthButtons.tsx` — [src_components_auth.md](src_components_auth.md)

### Layout

- [x] `src/components/layout/Sidebar.tsx` — [src_components_layout.md](src_components_layout.md)
- [x] `src/components/layout/AppLayout.tsx` — [src_components_layout.md](src_components_layout.md)
- [x] `src/components/layout/ProtectedRoute.tsx` — [src_components_layout.md](src_components_layout.md)
- [x] `src/components/layout/StatusBar.tsx` — [src_components_layout.md](src_components_layout.md)

### Execution

- [x] `src/components/execution/ErrorDisplay.tsx` — [src_components_execution.md](src_components_execution.md)
- [x] `src/components/execution/StreamingText.tsx` — [src_components_execution.md](src_components_execution.md)
- [x] `src/components/execution/ExecutionControls.tsx` — [src_components_execution.md](src_components_execution.md)

### Workflow

- [x] `src/components/workflow/WorkflowSettings.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/PromptCard.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/WorkflowStatusBadge.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/WorkflowCard.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/ImportExportButtons.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/ModelSelector.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/SaveButton.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/QueueItem.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/PromptProgressBar.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/AddPromptButton.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/PromptEditorPanel.tsx` — [src_components_workflow.md](src_components_workflow.md)
- [x] `src/components/workflow/PromptList.tsx` — [src_components_workflow.md](src_components_workflow.md)

### Settings & Shared

- [x] `src/components/settings/AddApiKeyDialog.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)
- [x] `src/components/settings/ApiKeyCard.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)
- [x] `src/components/shared/ConfirmDialog.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)
- [x] `src/components/shared/SkeletonTable.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)
- [x] `src/components/shared/SkeletonCard.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)
- [x] `src/components/shared/PageHeader.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)
- [x] `src/components/shared/EmptyState.tsx` — [src_components_settings_shared.md](src_components_settings_shared.md)

### UI Primitives

- [x] `src/components/ui/button.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/input.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/textarea.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/select.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/card.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/dialog.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/dropdown-menu.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/badge.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/avatar.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/switch.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/label.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/progress.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/scroll-area.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/separator.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/sheet.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/skeleton.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/table.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/tabs.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/tooltip.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/command.tsx` — [src_components_ui.md](src_components_ui.md)
- [x] `src/components/ui/input-group.tsx` — [src_components_ui.md](src_components_ui.md)

### Pages & Routes

- [x] `src/pages/Dashboard.tsx` — [src_pages.md](src_pages.md)
- [x] `src/pages/WorkflowEditor.tsx` — [src_pages.md](src_pages.md)
- [x] `src/pages/ExecutionViewer.tsx` — [src_pages.md](src_pages.md)
- [x] `src/pages/Login.tsx` — [src_pages.md](src_pages.md)
- [x] `src/pages/Onboarding.tsx` — [src_pages.md](src_pages.md)
- [x] `src/pages/Settings.tsx` — [src_pages.md](src_pages.md)
- [x] `src/pages/ApiKeys.tsx` — [src_pages.md](src_pages.md)
- [x] `src/routes.tsx` — [src_pages.md](src_pages.md)
- [x] `src/App.tsx` — [src_pages.md](src_pages.md)
- [x] `src/main.tsx` — [src_pages.md](src_pages.md)

### Hooks

- [x] `src/hooks/useAuth.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useWorkflows.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/usePrompts.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useExecutions.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useIpc.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useAutoSave.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useConfiguredProviders.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useTheme.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useWorkflowSnapshot.ts` — [src_hooks.md](src_hooks.md)
- [x] `src/hooks/useKeyboardShortcuts.ts` — [src_hooks.md](src_hooks.md)

### Lib

- [x] `src/lib/utils.ts` — [src_lib.md](src_lib.md)
- [x] `src/lib/firebase.ts` — [src_lib.md](src_lib.md)
- [x] `src/lib/ipc.ts` — [src_lib.md](src_lib.md)
- [x] `src/lib/converters.ts` — [src_lib.md](src_lib.md)
- [x] `src/lib/models.ts` — [src_lib.md](src_lib.md)
- [x] `src/lib/electron-mock.ts` — [src_lib.md](src_lib.md)
- [x] `src/lib/sentry.ts` — [src_lib.md](src_lib.md)

### Stores

- [x] `src/store/index.ts` — [src_stores.md](src_stores.md)
- [x] `src/store/workflowStore.ts` — [src_stores.md](src_stores.md)
- [x] `src/store/settingsStore.ts` — [src_stores.md](src_stores.md)
- [x] `src/store/executionStore.ts` — [src_stores.md](src_stores.md)

### Test

- [x] `src/test/stores.test.ts` — [src_test.md](src_test.md)
- [x] `src/test/auth.test.tsx` — [src_test.md](src_test.md)
- [x] `src/test/routes.test.tsx` — [src_test.md](src_test.md)
- [x] `src/test/example.test.ts` — [src_test.md](src_test.md)
- [x] `src/test/setup.ts` — [src_test.md](src_test.md)

## Top 5 Most Impactful Refactors

| Rank | Area                                                                       | Impact                                      | Effort |
| ---- | -------------------------------------------------------------------------- | ------------------------------------------- | ------ |
| 1    | **Duplicate provider adapters** (`openai.ts`, `anthropic.ts`, `google.ts`) | Eliminates ~80% duplicate code in providers | Medium |
| 2    | **Massive WorkflowEditorPage** (378 lines)                                 | Improves maintainability, enables testing   | Large  |
| 3    | **Duplicate CRUD hooks** (`useWorkflows.ts`, `usePrompts.ts`)              | Eliminates ~50% duplicate code across hooks | Medium |
| 4    | **Duplicate Firestore converters** (`converters.ts`)                       | Eliminates ~60% converter boilerplate       | Small  |
| 5    | **Module-level mutable state** (`window.ts`, `encryption.ts`)              | Reduces bugs from shared mutable state      | Small  |
