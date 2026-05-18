# Electron IPC Refactor Rules

Files: `electron/main/ipc/workflow.ts`, `electron/main/ipc/execution.ts`, `electron/main/ipc/api-keys.ts`, `electron/main/ipc/app.ts`

## Standards Violated

### 17 — Code Smells to Eliminate (dead code, stubs)

- **Specific issues:**
  - `execution.ts:1-7` — Entire file is a stub with TODO comment and empty function
- **Fix:** Implement planned handlers or remove the file and register empty stubs at call site
- **Priority:** Medium

### 11 — Error Handling

- **Specific issues:**
  - `api-keys.ts:7` — `as` assertion for provider validation (expected but fragile)
  - `app.ts:33,43` — `String(error)` in catch blocks loses error type info
- **Fix:** Use typed error handling consistent with the rest of the codebase
- **Priority:** Low

### 6 — TypeScript Standards

- **Specific issues:**
  - `app.ts:16` — `Electron.SaveDialogOptions` from external types, typed correctly
- **Fix:** None — already typed
- **Priority:** None

### 1 — General Principles

- **Specific issues:**
  - `workflow.ts:35-37` — `.then(cleanupRunner, cleanupRunner)` — both success and error call the same function; cleaner to use `.finally()`
- **Fix:** Replace `.then(success, error)` with `.finally(() => cleanupRunner(workflowId))`
- **Priority:** Low
