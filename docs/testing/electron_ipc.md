# Electron IPC — Testing Rules

## 1. `electron/main/ipc/workflow.ts`

- **Test type:** Integration
- **Key scenarios:**
  - `registerWorkflowIpc()` registers 5 IPC handlers: `workflow:start`, `workflow:pause`, `workflow:stop`, `workflow:retry`, `workflow:status`
  - `workflow:start`: returns error if workflow already running; creates `WorkflowRunner`; starts it async; cleanup on completion or failure; returns `{ success: true, workflowId }`
  - `workflow:pause`: returns error if runner not found; calls `runner.pause()`
  - `workflow:stop`: calls `cleanupRunner()` which stops and deletes runner
  - `workflow:retry`: returns error if runner not found; stops runner and deletes it
  - `workflow:status`: returns error if runner not found; returns `runner.getStatus()`
  - `cleanupRunner()` is safe for missing runner; cleans up after completion/failure
- **Mocking requirements:** `ipcMain` from electron; `WorkflowRunner` constructor and instance methods
- **Coverage targets:** All IPC handler resolved/rejected states; runner already running; runner not found (all 4 handlers)
- **Suggested test file location:** `electron/main/ipc/__tests__/workflow.test.ts`

## 2. `electron/main/ipc/execution.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `registerExecutionIpc()` is a placeholder with no-op body
  - Confirms no handlers are registered
- **Mocking requirements:** None
- **Coverage targets:** N/A (placeholder)
- **Suggested test file location:** `electron/main/ipc/__tests__/execution.test.ts`

## 3. `electron/main/ipc/api-keys.ts`

- **Test type:** Integration
- **Key scenarios:**
  - `registerApiKeysIpc()` registers 4 IPC handlers
  - `api-key:encrypt`: returns error for invalid provider (not in `VALID_PROVIDERS`); validates provider via `isValidProvider()`; delegates to `encryptApiKey()`; returns `{ success, id, keyPrefix }` on OK; returns `{ success, error }` on failure
  - `api-key:decrypt`: delegates to `decryptApiKey()`; returns `{ success, key }` on OK
  - `api-key:list`: returns `{ success, keys }` from `listApiKeys()`
  - `api-key:delete`: delegates to `deleteApiKey()`; returns `{ success }` on OK; returns error on failure
  - `isValidProvider()` returns true only for `'openai' | 'anthropic' | 'google'`
- **Mocking requirements:** `ipcMain` from electron; `encryptApiKey`, `decryptApiKey`, `listApiKeys`, `deleteApiKey` from '../encryption'
- **Coverage targets:** All 4 provider validation paths; each handler's success/error branches
- **Suggested test file location:** `electron/main/ipc/__tests__/api-keys.test.ts`

## 4. `electron/main/ipc/app.ts`

- **Test type:** Integration
- **Key scenarios:**
  - `registerAppIpc()` registers 5 handlers/events
  - `app:get-version`: returns `app.getVersion()`
  - `app:minimize-to-tray`: hides focused window; safe when no window focused
  - `dialog:show-save-dialog`: returns canceled result when no focused window; returns dialog result otherwise
  - `dialog:show-open-dialog`: same pattern as save dialog
  - `file:write`: writes file, returns `{ success: true }`; catches error returns `{ success: false, error }`
  - `file:read`: reads file, returns `{ success: true, content }`; catches error returns `{ success: false, error }`
- **Mocking requirements:** `ipcMain`, `app`, `BrowserWindow`, `dialog` from electron; `readFile`/`writeFile` from `fs/promises`
- **Coverage targets:** All dialog paths (no window, with window); file read/write success/error
- **Suggested test file location:** `electron/main/ipc/__tests__/app.test.ts`

---

---

## Global Rule

All test files must be placed in a `__tests__` directory within the same folder as the source file:

- `src/components/auth/AuthProvider.tsx` → `src/components/auth/__tests__/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/hooks/__tests__/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `electron/main/__tests__/encryption.test.ts`

This keeps tests co-located with their source, making it easy to find and maintain related tests.
All test files must be placed under ``. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `electron/main/encryption.test.ts`

This keeps all tests colocated under a single ``root regardless of whether the source is in`src/`or`electron/`.
