# Refactoring Rules: `electron/main/ipc/`

## Purpose

Registers Electron IPC handlers for workflow control, execution events, API key management, and app-level operations.

## Current Issues

### workflow.ts

- `WorkflowRunner` instances stored in module-level `Map` but never cleaned up when workflow completes naturally (only on `stop` or `start` error) — creates memory leak
- `workflow:start` handler accepts raw `config` as `WorkflowConfig` type but there's no validation of the payload from the renderer — should validate with Zod or similar
- `workflow:retry` handler calls `runner.stop()` and `runners.delete()` but doesn't restart the runner — the name suggests it should retry
- No timeout or cleanup for runners that hang

### execution.ts

- Stub with only a comment — implement or remove

### api-keys.ts

- `encryptApiKey` casts `provider as 'openai' | 'anthropic' | 'google'` without validation — if renderer sends an invalid provider, this silently produces wrong behavior
- `listApiKeys` returns keys from `encryption.ts` which returns `(typeof StoredKey)[]` but the IPC response doesn't include `encrypted` field — correct, but the type assertion in preload expects `{ id, provider, keyPrefix, createdAt }[]` which matches

### app.ts

- `app:minimize-to-tray` uses `ipcMain.on` (fire-and-forget) instead of `ipcMain.handle` (async) — inconsistent with other handlers
- `file:write` and `file:read` use synchronous `readFileSync`/`writeFileSync` in async handlers — should use `fs.promises` API
- No path sanitization for `file:write`/`file:read` — renderer could read/write arbitrary files
- `dialog:show-save-dialog` and `dialog:show-open-dialog` accept `options: unknown` — should type as `Electron.SaveDialogOptions` / `Electron.OpenDialogOptions`

## Refactoring Rules

1. **Add runner cleanup on workflow completion** — listen for completion events and remove from map
2. **Add Zod validation** for IPC payloads (especially `workflow:start`, `api-key:encrypt`)
3. **Fix `workflow:retry`** — should call `runner.start()` after `stop()`, not just delete
4. **Implement `registerExecutionIpc`** or remove the stub
5. **Replace synchronous `readFileSync`/`writeFileSync`** with `fs.promises` API
6. **Add path sanitization** to `file:write`/`file:read` (resolve to allowed directories only)
7. **Type `options` param** in dialog handlers as `Electron.SaveDialogOptions` / `Electron.OpenDialogOptions`
8. **Validate provider string** in `api-keys.ts` before cast
9. **Change `app:minimize-to-tray`** to use `ipcMain.handle` for consistency

## Dependencies

- `workflow.ts`: `electron`, `../engine/runner`
- `execution.ts`: `electron`
- `api-keys.ts`: `electron`, `../encryption`
- `app.ts`: `electron`, `node:fs`
- Used by: `../index.ts` (all registered on app startup)

## Verification

- `npm run typecheck` (electron)
- Test workflow start/pause/stop/retry cycle end-to-end
- Test file write/read with path traversal attempt
- Test API key encrypt/decrypt/list/delete
- Verify no memory leak after repeated workflow runs
