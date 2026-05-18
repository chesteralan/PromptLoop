# Abstraction Rules: Electron IPC

**Files:** `electron/main/ipc/workflow.ts`, `execution.ts`, `api-keys.ts`, `app.ts`

---

## `electron/main/ipc/workflow.ts`

### Current Layer Mix

- IPC handler registration mixed with `WorkflowRunner` instance management (`Map<string, WorkflowRunner>`).
- Runner lifecycle (`cleanupRunner`) directly coupled to IPC handler.

### Extraction Opportunities

- Extract `RunnerManager` class: manages `Map<string, WorkflowRunner>`, handles cleanup, prevents duplicates.
- Extract IPC handler setup into smaller registration functions per channel.

### Interface Suggestions

- `RunnerManager` interface: `get(id): WorkflowRunner | null`, `set(id, runner): void`, `delete(id): void`, `cleanup(id): void`.
- Define typed request/response interfaces for each IPC channel (e.g., `WorkflowStartRequest`, `WorkflowStartResponse`).

### Dependency Direction

- ⚠️ Depends on `engine/runner` and `engine/types` — correct direction (IPC → engine).
- ✅ Thin layer — IPC handlers only do marshalling/delegation.

### Duplication

- Error response pattern `{ success: false, error: '...' }` repeated across all handlers — extract `errorResponse(msg)` and `successResponse(data)` helpers.
- `cleanupRunner` called in both `.then()` and error paths — use `.finally()`.

### Constants/Magic Values

- `'workflow:start'`, `'workflow:pause'`, `'workflow:stop'`, `'workflow:retry'`, `'workflow:status'`.

---

## `electron/main/ipc/execution.ts`

### Current Layer Mix

- Placeholder stub — no actual logic yet.

### Extraction Opportunities

- When implementing, follow the pattern of `workflow.ts` with clear handler registration per channel.

### Interface Suggestions

- `ExecutionHistoryService` interface: `fetchHistory(workflowId?, limit?): ExecutionLog[]`, `exportResults(id, format): void`, `clearHistory(): void`.

### Dependency Direction

- ✅ No current dependencies.

### Duplication

- N/A.

### Constants/Magic Values

- `'execution:history'`, `'execution:export'`, `'execution:clear'` (planned).

---

## `electron/main/ipc/api-keys.ts`

### Current Layer Mix

- IPC handler registration mixed with validation logic (`isValidProvider`, `VALID_PROVIDERS`).

### Extraction Opportunities

- Extract `VALID_PROVIDERS` and `isValidProvider` into `providers/provider-utils.ts` for sharing with encryption module.
- Extract the `{ success, error }` response wrapping pattern.

### Interface Suggestions

- `ApiKeyIpcHandler` interface: define typed request/response types for each operation.
- Move `Result<T>` (from `encryption.ts`) into shared types for consistent error handling.

### Dependency Direction

- ✅ Depends on `encryption.ts` — correct (IPC → business logic).
- ⚠️ Directly accesses `encryptApiKey`/`decryptApiKey` — consider an `ApiKeyService` interface.

### Duplication

- `{ success: false, error: ... }` / `{ success: true, ... }` pattern repeated in every handler.

### Constants/Magic Values

- `'api-key:encrypt'`, `'api-key:decrypt'`, `'api-key:list'`, `'api-key:delete'`, `'openai'`, `'anthropic'`, `'google'`, `'Invalid provider: '`.

---

## `electron/main/ipc/app.ts`

### Current Layer Mix

- `dialog.showSaveDialog`/`showOpenDialog`, `readFile`/`writeFile`, `app.getVersion`, and `app:minimize-to-tray` all in one file — mixed concerns (dialog, file I/O, app info).

### Extraction Opportunities

- Extract file I/O handlers into `ipc/file-io.ts`.
- Extract dialog handlers into `ipc/dialogs.ts`.
- Extract app info handler (`get-version`, minimize-to-tray) into `ipc/app-info.ts`.

### Interface Suggestions

- `FileService` interface: `write(path, content): Promise<Result>`, `read(path): Promise<Result>`.
- `DialogService` interface: `showSaveDialog(options): Promise<SaveDialogResult>`, `showOpenDialog(options): Promise<OpenDialogResult>`.

### Dependency Direction

- ✅ Direct Electron API calls — minimal coupling.

### Duplication

- Error wrapping pattern `{ success: false, error: String(error) }` repeated in file handlers.
- `BrowserWindow.getFocusedWindow()` null-check repeated.

### Constants/Magic Values

- `'app:get-version'`, `'app:minimize-to-tray'`, `'dialog:show-save-dialog'`, `'dialog:show-open-dialog'`, `'file:write'`, `'file:read'`.
