# Electron Preload / Shared — Testing Rules

## 1. `electron/preload/index.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `assertSuccess()` throws on `{ success: false }` with error message; returns rest without `success`/`error` keys on success
  - `api` object exposes all expected methods via `contextBridge.exposeInMainWorld('electronAPI', api)`
  - `startWorkflow`, `pauseWorkflow`, `stopWorkflow`, `retryWorkflow`: call `ipcRenderer.invoke` with correct channel and payload
  - `onExecutionChunk`, `onExecutionCompleted`, `onExecutionFailed`, `onWorkflowCompleted`: register IPC listeners; returned cleanup functions remove listeners
  - `encryptApiKey`: invokes `api-key:encrypt`, calls `assertSuccess`, validates response has `id` and `keyPrefix`
  - `decryptApiKey`: invokes `api-key:decrypt`, calls `assertSuccess`, validates `key` present
  - `deleteApiKey`, `listApiKeys`: invoke correct channels with correct parameters
  - `minimizeToTray`: sends event (not invoke)
  - `getAppVersion`: invokes `app:get-version`
  - `showSaveDialog`, `showOpenDialog`: invoke correct dialog channels
  - `writeFile`, `readFile`: invoke correct file channels with correct args
- **Mocking requirements:** `ipcRenderer` and `contextBridge` from electron
- **Coverage targets:** `assertSuccess` success/error; all 4 listener cleanup functions; encrypt/decrypt missing fields validation
- **Suggested test file location:** `src/test/electron/preload/index.test.ts`

## 2. `electron/shared/types.ts`

- **Test type:** Unit (type-only)
- **Key scenarios:**
  - `WorkflowStatus` is one of 6 string literals
  - `ExecutionStatus` is one of 4 string literals
  - `LoopMode` is one of 4 string literals
  - All interfaces (`WorkflowStartPayload`, `ExecutionChunk`, `ExecutionResult`, `ExecutionError`, `WorkflowComplete`, `ApiKeyInfo`, `ExecutionLog`, `AppUpdateEvent`, `WindowState`) have correct field types
- **Mocking requirements:** None
- **Coverage targets:** N/A
- **Suggested test file location:** `src/test/electron/shared/types.test.ts`

---

## Global Rule

All test files must be placed under `src/test/`. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `src/test/components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/test/hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `src/test/electron/main/encryption.test.ts`

This keeps all tests colocated under a single `src/test/` root regardless of whether the source is in `src/` or `electron/`.
