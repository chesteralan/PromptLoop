# Refactor Plan

> Track refactoring progress for all `.ts` / `.tsx` source files.
> Check off each file once its companion rule file has been reviewed and applied.

## Electron Main Process

- [x] `electron/main/index.ts` → `refactor/electron_main_index.md`
- [x] `electron/main/window.ts` → `refactor/electron_main_window.md`
- [x] `electron/main/encryption.ts` → `refactor/electron_main_encryption.md`
- [ ] `electron/main/sentry.ts` → `refactor/electron_main_sentry.md`
- [x] `electron/main/tray.ts` → `refactor/electron_main_tray.md`
- [x] `electron/main/shortcuts.ts` → `refactor/electron_main_shortcuts.md`
- [x] `electron/main/notifications.ts` → `refactor/electron_main_notifications.md`
- [ ] `electron/main/updater.ts` → `refactor/electron_main_updater.md`

## Engine

- [x] `electron/main/engine/runner.ts` → `refactor/electron_main_engine_runner.md`
- [x] `electron/main/engine/queue.ts` → `refactor/electron_main_engine_queue.md`
- [x] `electron/main/engine/retry.ts` → `refactor/electron_main_engine_retry.md`
- [x] `electron/main/engine/scheduler.ts` → `refactor/electron_main_engine_scheduler.md`
- [x] `electron/main/engine/events.ts` → `refactor/electron_main_engine_events.md`
- [x] `electron/main/engine/types.ts` → `refactor/electron_main_engine_types.md`

## Providers

- [x] `electron/main/providers/interface.ts` → `refactor/electron_main_providers_interface.md`
- [x] `electron/main/providers/factory.ts` → `refactor/electron_main_providers_factory.md`
- [x] `electron/main/providers/openai.ts` → `refactor/electron_main_providers_openai.md`
- [x] `electron/main/providers/anthropic.ts` → `refactor/electron_main_providers_anthropic.md`
- [x] `electron/main/providers/google.ts` → `refactor/electron_main_providers_google.md`

## IPC Handlers

- [x] `electron/main/ipc/workflow.ts` → `refactor/electron_main_ipc_workflow.md`
- [x] `electron/main/ipc/execution.ts` → `refactor/electron_main_ipc_execution.md`
- [x] `electron/main/ipc/api-keys.ts` → `refactor/electron_main_ipc_api-keys.md`
- [x] `electron/main/ipc/app.ts` → `refactor/electron_main_ipc_app.md`

## Preload & Shared

- [x] `electron/preload/index.ts` → `refactor/electron_preload_index.md`
- [x] `electron/shared/types.ts` → `refactor/electron_shared_types.md`

## React — Auth

- [x] `src/components/auth/AuthProvider.tsx` → `refactor/src_components_auth_AuthProvider.md`
- [x] `src/components/auth/OAuthButtons.tsx` → `refactor/src_components_auth_OAuthButtons.md`

## React — Layout

- [x] `src/components/layout/AppLayout.tsx` → `refactor/src_components_layout_AppLayout.md`
- [x] `src/components/layout/ProtectedRoute.tsx` → `refactor/src_components_layout_ProtectedRoute.md`
- [x] `src/components/layout/Sidebar.tsx` → `refactor/src_components_layout_Sidebar.md`
- [x] `src/components/layout/StatusBar.tsx` → `refactor/src_components_layout_StatusBar.md`

## React — Execution

- [x] `src/components/execution/ExecutionControls.tsx` → `refactor/src_components_execution_ExecutionControls.md`
- [x] `src/components/execution/StreamingText.tsx` → `refactor/src_components_execution_StreamingText.md`
- [x] `src/components/execution/ErrorDisplay.tsx` → `refactor/src_components_execution_ErrorDisplay.md`

## React — Workflow

- [x] `src/components/workflow/WorkflowSettings.tsx` → `refactor/src_components_workflow_WorkflowSettings.md`
- [x] `src/components/workflow/PromptCard.tsx` → `refactor/src_components_workflow_PromptCard.md`
- [x] `src/components/workflow/PromptList.tsx` → `refactor/src_components_workflow_PromptList.md`
- [x] `src/components/workflow/PromptEditorPanel.tsx` → `refactor/src_components_workflow_PromptEditorPanel.md`
- [x] `src/components/workflow/PromptProgressBar.tsx` → `refactor/src_components_workflow_PromptProgressBar.md`
- [x] `src/components/workflow/QueueItem.tsx` → `refactor/src_components_workflow_QueueItem.md`
- [x] `src/components/workflow/AddPromptButton.tsx` → `refactor/src_components_workflow_AddPromptButton.md`
- [x] `src/components/workflow/SaveButton.tsx` → `refactor/src_components_workflow_SaveButton.md`
- [x] `src/components/workflow/ImportExportButtons.tsx` → `refactor/src_components_workflow_ImportExportButtons.md`
- [x] `src/components/workflow/ModelSelector.tsx` → `refactor/src_components_workflow_ModelSelector.md`
- [x] `src/components/workflow/WorkflowStatusBadge.tsx` → `refactor/src_components_workflow_WorkflowStatusBadge.md`
- [x] `src/components/workflow/WorkflowCard.tsx` → `refactor/src_components_workflow_WorkflowCard.md`

## React — Settings / Shared / UI

- [x] `src/components/settings/AddApiKeyDialog.tsx` → `refactor/src_components_settings_AddApiKeyDialog.md`
- [x] `src/components/settings/ApiKeyCard.tsx` → `refactor/src_components_settings_ApiKeyCard.md`
- [x] `src/components/shared/ConfirmDialog.tsx` → `refactor/src_components_shared_ConfirmDialog.md`
- [x] `src/components/shared/EmptyState.tsx` → `refactor/src_components_shared_EmptyState.md`
- [x] `src/components/shared/PageHeader.tsx` → `refactor/src_components_shared_PageHeader.md`
- [x] `src/components/shared/SkeletonCard.tsx` → `refactor/src_components_shared_SkeletonCard.md`
- [x] `src/components/shared/SkeletonTable.tsx` → `refactor/src_components_shared_SkeletonTable.md`
- [x] (UI primitives — reviewed & applied)

## Pages

- [x] `src/pages/Login.tsx` → `refactor/src_pages_Login.md`
- [x] `src/pages/Dashboard.tsx` → `refactor/src_pages_Dashboard.md`
- [x] `src/pages/WorkflowEditor.tsx` → `refactor/src_pages_WorkflowEditor.md`
- [x] `src/pages/ExecutionViewer.tsx` → `refactor/src_pages_ExecutionViewer.md`
- [x] `src/pages/Settings.tsx` → `refactor/src_pages_Settings.md`
- [x] `src/pages/ApiKeys.tsx` → `refactor/src_pages_ApiKeys.md`
- [x] `src/pages/Onboarding.tsx` → `refactor/src_pages_Onboarding.md`
- [x] `src/routes.tsx` → `refactor/src_routes.md`
- [x] `src/App.tsx` → `refactor/src_App.md`
- [x] `src/main.tsx` → `refactor/src_main.md`

## Hooks

- [x] `src/hooks/useAuth.ts` → `refactor/src_hooks_useAuth.md`
- [x] `src/hooks/useTheme.ts` → `refactor/src_hooks_useTheme.md`
- [x] `src/hooks/useWorkflows.ts` → `refactor/src_hooks_useWorkflows.md`
- [x] `src/hooks/usePrompts.ts` → `refactor/src_hooks_usePrompts.md`
- [x] `src/hooks/useExecutions.ts` → `refactor/src_hooks_useExecutions.md`
- [x] `src/hooks/useWorkflowSnapshot.ts` → `refactor/src_hooks_useWorkflowSnapshot.md`
- [x] `src/hooks/useIpc.ts` → `refactor/src_hooks_useIpc.md`
- [x] `src/hooks/useAutoSave.ts` → `refactor/src_hooks_useAutoSave.md`
- [x] `src/hooks/useConfiguredProviders.ts` → `refactor/src_hooks_useConfiguredProviders.md`
- [x] `src/hooks/useKeyboardShortcuts.ts` → `refactor/src_hooks_useKeyboardShortcuts.md`

## Lib

- [x] `src/lib/firebase.ts` → `refactor/src_lib_firebase.md`
- [x] `src/lib/converters.ts` → `refactor/src_lib_converters.md`
- [x] `src/lib/firestore-helpers.ts` → `refactor/src_lib_firestore-helpers.md` _(removed — dead code)_
- [x] `src/lib/ipc.ts` → `refactor/src_lib_ipc.md`
- [x] `src/lib/models.ts` → `refactor/src_lib_models.md`
- [x] `src/lib/utils.ts` → `refactor/src_lib_utils.md`
- [x] `src/lib/sentry.ts` → `refactor/src_lib_sentry.md`
- [x] `src/lib/electron-mock.ts` → `refactor/src_lib_electron-mock.md`

## Stores

- [x] `src/store/executionStore.ts` → `refactor/src_store_executionStore.md`
- [x] `src/store/workflowStore.ts` → `refactor/src_store_workflowStore.md`
- [x] `src/store/settingsStore.ts` → `refactor/src_store_settingsStore.md`
- [x] `src/store/index.ts` → `refactor/src_store_index.md`

## Tests

- [x] `src/test/setup.ts` → `refactor/src_test_setup.md`
- [x] `src/test/example.test.ts` → `refactor/src_test_example_test.md`
- [x] `src/test/auth.test.tsx` → `refactor/src_test_auth_test.md`
- [x] `src/test/routes.test.tsx` → `refactor/src_test_routes_test.md`
- [x] `src/test/stores.test.ts` → `refactor/src_test_stores_test.md`

---

**Total: 91 files**
