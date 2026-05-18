# Refactor Plan

> Track refactoring progress for all `.ts` / `.tsx` source files.
> Check off each file once its companion rule file has been reviewed and applied.

## Electron Main Process

- [ ] `electron/main/index.ts` → `refactor/electron_main_index.md`
- [ ] `electron/main/window.ts` → `refactor/electron_main_window.md`
- [ ] `electron/main/encryption.ts` → `refactor/electron_main_encryption.md`
- [ ] `electron/main/sentry.ts` → `refactor/electron_main_sentry.md`
- [ ] `electron/main/tray.ts` → `refactor/electron_main_tray.md`
- [ ] `electron/main/shortcuts.ts` → `refactor/electron_main_shortcuts.md`
- [ ] `electron/main/notifications.ts` → `refactor/electron_main_notifications.md`
- [ ] `electron/main/updater.ts` → `refactor/electron_main_updater.md`

## Engine

- [ ] `electron/main/engine/runner.ts` → `refactor/electron_main_engine_runner.md`
- [ ] `electron/main/engine/queue.ts` → `refactor/electron_main_engine_queue.md`
- [ ] `electron/main/engine/retry.ts` → `refactor/electron_main_engine_retry.md`
- [ ] `electron/main/engine/scheduler.ts` → `refactor/electron_main_engine_scheduler.md`
- [ ] `electron/main/engine/events.ts` → `refactor/electron_main_engine_events.md`
- [ ] `electron/main/engine/types.ts` → `refactor/electron_main_engine_types.md`

## Providers

- [ ] `electron/main/providers/interface.ts` → `refactor/electron_main_providers_interface.md`
- [ ] `electron/main/providers/factory.ts` → `refactor/electron_main_providers_factory.md`
- [ ] `electron/main/providers/openai.ts` → `refactor/electron_main_providers_openai.md`
- [ ] `electron/main/providers/anthropic.ts` → `refactor/electron_main_providers_anthropic.md`
- [ ] `electron/main/providers/google.ts` → `refactor/electron_main_providers_google.md`

## IPC Handlers

- [ ] `electron/main/ipc/workflow.ts` → `refactor/electron_main_ipc_workflow.md`
- [ ] `electron/main/ipc/execution.ts` → `refactor/electron_main_ipc_execution.md`
- [ ] `electron/main/ipc/api-keys.ts` → `refactor/electron_main_ipc_api-keys.md`
- [ ] `electron/main/ipc/app.ts` → `refactor/electron_main_ipc_app.md`

## Preload & Shared

- [ ] `electron/preload/index.ts` → `refactor/electron_preload_index.md`
- [ ] `electron/shared/types.ts` → `refactor/electron_shared_types.md`

## React — Auth

- [ ] `src/components/auth/AuthProvider.tsx` → `refactor/src_components_auth_AuthProvider.md`
- [ ] `src/components/auth/OAuthButtons.tsx` → `refactor/src_components_auth_OAuthButtons.md`

## React — Layout

- [ ] `src/components/layout/AppLayout.tsx` → `refactor/src_components_layout_AppLayout.md`
- [ ] `src/components/layout/ProtectedRoute.tsx` → `refactor/src_components_layout_ProtectedRoute.md`
- [ ] `src/components/layout/Sidebar.tsx` → `refactor/src_components_layout_Sidebar.md`
- [ ] `src/components/layout/StatusBar.tsx` → `refactor/src_components_layout_StatusBar.md`

## React — Execution

- [ ] `src/components/execution/ExecutionControls.tsx` → `refactor/src_components_execution_ExecutionControls.md`
- [ ] `src/components/execution/StreamingText.tsx` → `refactor/src_components_execution_StreamingText.md`
- [ ] `src/components/execution/ErrorDisplay.tsx` → `refactor/src_components_execution_ErrorDisplay.md`

## React — Workflow

- [ ] `src/components/workflow/WorkflowSettings.tsx` → `refactor/src_components_workflow_WorkflowSettings.md`
- [ ] `src/components/workflow/PromptCard.tsx` → `refactor/src_components_workflow_PromptCard.md`
- [ ] `src/components/workflow/PromptList.tsx` → `refactor/src_components_workflow_PromptList.md`
- [ ] `src/components/workflow/PromptEditorPanel.tsx` → `refactor/src_components_workflow_PromptEditorPanel.md`
- [ ] `src/components/workflow/PromptProgressBar.tsx` → `refactor/src_components_workflow_PromptProgressBar.md`
- [ ] `src/components/workflow/QueueItem.tsx` → `refactor/src_components_workflow_QueueItem.md`
- [ ] `src/components/workflow/AddPromptButton.tsx` → `refactor/src_components_workflow_AddPromptButton.md`
- [ ] `src/components/workflow/SaveButton.tsx` → `refactor/src_components_workflow_SaveButton.md`
- [ ] `src/components/workflow/ImportExportButtons.tsx` → `refactor/src_components_workflow_ImportExportButtons.md`
- [ ] `src/components/workflow/ModelSelector.tsx` → `refactor/src_components_workflow_ModelSelector.md`
- [ ] `src/components/workflow/WorkflowStatusBadge.tsx` → `refactor/src_components_workflow_WorkflowStatusBadge.md`
- [ ] `src/components/workflow/WorkflowCard.tsx` → `refactor/src_components_workflow_WorkflowCard.md`

## React — Settings / Shared / UI

- [ ] `src/components/settings/AddApiKeyDialog.tsx` → `refactor/src_components_settings_AddApiKeyDialog.md`
- [ ] `src/components/settings/ApiKeyCard.tsx` → `refactor/src_components_settings_ApiKeyCard.md`
- [ ] `src/components/shared/ConfirmDialog.tsx` → `refactor/src_components_shared_ConfirmDialog.md`
- [ ] `src/components/shared/EmptyState.tsx` → `refactor/src_components_shared_EmptyState.md`
- [ ] `src/components/shared/PageHeader.tsx` → `refactor/src_components_shared_PageHeader.md`
- [ ] `src/components/shared/SkeletonCard.tsx` → `refactor/src_components_shared_SkeletonCard.md`
- [ ] `src/components/shared/SkeletonTable.tsx` → `refactor/src_components_shared_SkeletonTable.md`
- [ ] (UI primitives — keep as-is, shadcn managed)

## Pages

- [ ] `src/pages/Login.tsx` → `refactor/src_pages_Login.md`
- [ ] `src/pages/Dashboard.tsx` → `refactor/src_pages_Dashboard.md`
- [ ] `src/pages/WorkflowEditor.tsx` → `refactor/src_pages_WorkflowEditor.md`
- [ ] `src/pages/ExecutionViewer.tsx` → `refactor/src_pages_ExecutionViewer.md`
- [ ] `src/pages/Settings.tsx` → `refactor/src_pages_Settings.md`
- [ ] `src/pages/ApiKeys.tsx` → `refactor/src_pages_ApiKeys.md`
- [ ] `src/pages/Onboarding.tsx` → `refactor/src_pages_Onboarding.md`
- [ ] `src/routes.tsx` → `refactor/src_routes.md`
- [ ] `src/App.tsx` → `refactor/src_App.md`
- [ ] `src/main.tsx` → `refactor/src_main.md`

## Hooks

- [ ] `src/hooks/useAuth.ts` → `refactor/src_hooks_useAuth.md`
- [ ] `src/hooks/useTheme.ts` → `refactor/src_hooks_useTheme.md`
- [ ] `src/hooks/useWorkflows.ts` → `refactor/src_hooks_useWorkflows.md`
- [ ] `src/hooks/usePrompts.ts` → `refactor/src_hooks_usePrompts.md`
- [ ] `src/hooks/useExecutions.ts` → `refactor/src_hooks_useExecutions.md`
- [ ] `src/hooks/useWorkflowSnapshot.ts` → `refactor/src_hooks_useWorkflowSnapshot.md`
- [ ] `src/hooks/useIpc.ts` → `refactor/src_hooks_useIpc.md`
- [ ] `src/hooks/useAutoSave.ts` → `refactor/src_hooks_useAutoSave.md`
- [ ] `src/hooks/useConfiguredProviders.ts` → `refactor/src_hooks_useConfiguredProviders.md`
- [ ] `src/hooks/useKeyboardShortcuts.ts` → `refactor/src_hooks_useKeyboardShortcuts.md`

## Lib

- [x] `src/lib/firebase.ts` → `refactor/src_lib_firebase.md`
- [x] `src/lib/converters.ts` → `refactor/src_lib_converters.md`
- [ ] `src/lib/firestore-helpers.ts` → `refactor/src_lib_firestore-helpers.md`
- [ ] `src/lib/ipc.ts` → `refactor/src_lib_ipc.md`
- [ ] `src/lib/models.ts` → `refactor/src_lib_models.md`
- [ ] `src/lib/utils.ts` → `refactor/src_lib_utils.md`
- [x] `src/lib/sentry.ts` → `refactor/src_lib_sentry.md`
- [x] `src/lib/electron-mock.ts` → `refactor/src_lib_electron-mock.md`

## Stores

- [x] `src/store/executionStore.ts` → `refactor/src_store_executionStore.md`
- [ ] `src/store/workflowStore.ts` → `refactor/src_store_workflowStore.md`
- [ ] `src/store/settingsStore.ts` → `refactor/src_store_settingsStore.md`
- [ ] `src/store/index.ts` → `refactor/src_store_index.md`

## Tests

- [ ] `src/test/setup.ts` → `refactor/src_test_setup.md`
- [ ] `src/test/example.test.ts` → `refactor/src_test_example_test.md`
- [ ] `src/test/auth.test.tsx` → `refactor/src_test_auth_test.md`
- [ ] `src/test/routes.test.tsx` → `refactor/src_test_routes_test.md`
- [ ] `src/test/stores.test.ts` → `refactor/src_test_stores_test.md`

---

**Total: 91 files**
