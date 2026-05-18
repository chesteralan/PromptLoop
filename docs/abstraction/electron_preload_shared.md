# Abstraction Rules: Electron Preload & Shared Types

**Files:** `electron/preload/index.ts`, `electron/shared/types.ts`

---

## `electron/preload/index.ts`

### Current Layer Mix

- IPC invocation wrappers, event listener registration, response parsing (`assertSuccess`), and `contextBridge.exposeInMainWorld` all in one file.
- Workflow control, execution event listening, API key management, dialog/file operations all mixed in a single `api` object.

### Extraction Opportunities

- Split the `api` object into domain-specific modules: `workflowApi`, `executionApi`, `apiKeyApi`, `appApi`, `dialogApi`, `fileApi`.
- Extract `assertSuccess` into a shared utility (duplicated pattern with `electron/main/ipc/` response format).
- Extract event listener creator helpers: `createListener(channel, callback): () => void`.

### Interface Suggestions

- The `ElectronAPI` interface in `src/lib/ipc.ts` should be the single source of truth — `preload/index.ts` should implement against it.
- Type the `api` object as `ElectronAPI` for compile-time safety.

### Dependency Direction

- ✅ Depends only on `electron/shared/types.ts` — correct.
- ⚠️ Direct `ipcRenderer.invoke` calls — consider a thin `IpcClient` abstraction.

### Duplication

- `ipcRenderer.on` / `removeListener` pattern repeated for all 4 event channels — extract `createEventChannel<T>(channel, callback): () => void`.
- `assertSuccess` manually deletes `success`/`error` fields — consider a generic `unwrap<T>(r): T` utility.

### Constants/Magic Values

- `'workflow:start'`, `'workflow:pause'`, `'workflow:stop'`, `'workflow:retry'`, `'execution:chunk'`, `'execution:completed'`, `'execution:failed'`, `'workflow:completed'`, `'api-key:encrypt'`, `'api-key:decrypt'`, `'api-key:list'`, `'api-key:delete'`, `'app:minimize-to-tray'`, `'app:get-version'`, `'dialog:show-save-dialog'`, `'dialog:show-open-dialog'`, `'file:write'`, `'file:read'`.

---

## `electron/shared/types.ts`

### Current Layer Mix

- All shared types in a single file — well-organized but could be split as it grows.

### Extraction Opportunities

- Split into domain-specific type files: `shared/workflow-types.ts`, `shared/execution-types.ts`, `shared/api-key-types.ts`, `shared/app-types.ts`.
- Extract `WindowState` — it duplicates the local `PersistedState` in `electron/main/window.ts` — consolidate.

### Interface Suggestions

- Use more branded types (e.g., `WorkflowId = string & { __brand: 'WorkflowId' }`).
- `ExecutionResult` includes `tokensIn`/`tokensOut` — not currently emitted by the engine — should align with what the engine actually sends.

### Dependency Direction

- ✅ Pure type definitions, zero runtime dependencies — correctly positioned as shared.

### Duplication

- `WindowState` duplicates `PersistedState` in `window.ts` — reconcile.
- `ExecutionChunk`/`ExecutionResult`/`ExecutionError` are similar to what `engine/types.ts` `ExecutionEventMap` defines — consider deriving one from the other.
- `ApiKeyInfo` and `ApiKeyListResponse` overlap — consolidate.
