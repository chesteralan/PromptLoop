# Refactoring Rules: `src/lib/ipc.ts`

## Purpose

Defines the `ElectronAPI` TypeScript interface for the IPC bridge exposed to the renderer process, and declares the global `window.electronAPI` type.

## Current Issues

1. **`showSaveDialog` and `showOpenDialog** accept `options: unknown` — should be typed as `Electron.SaveDialogOptions` / `Electron.OpenDialogOptions` but Electron types aren't available in the renderer build. Consider defining minimal proxy types
2. **`writeFile` and `readFile`** return types include `error` field inconsistently — `writeFile` returns `{ success: boolean; error?: string }` but `readFile` returns `{ success: boolean; content?: string; error?: string }`
3. **`startWorkflow` etc.** return `{ success: boolean; workflowId: string; error?: string }` but the IPC handler in `workflow.ts` returns `{ success: boolean; workflowId: string }` without `error` on success — the `error` field is only present on failure. This is fine but the type suggests `error` is always optional
4. **`encryptApiKey`** returns `{ id: string; keyPrefix: string }` but the IPC handler returns `{ success: true, id, keyPrefix } | { success: false, error }` — the preload script unwraps this, but the interface here should match what's exposed after unwrapping
5. **`on*` callbacks** return `() => void` cleanup functions — good pattern
6. **No `requestAnimationFrame` or throttling** for high-frequency `onExecutionChunk` callbacks — chunk events could arrive faster than React can process them

## Refactoring Rules

1. **Add throttled `onExecutionChunk`** wrapper — batch chunks and update at ~60fps
2. **Define `SaveDialogOptions` and `OpenDialogOptions`** as minimal proxy types instead of `unknown`
3. **Add `error` field to all response types** for consistency
4. **Add `onExecutionStatus`** event to interface (currently missing, but emitted by engine)
5. **Add generic IPC invoke helper** with proper typing for response validation
6. **Add `addListener`/`removeListener` pattern** for all event types

## Dependencies

- `../../electron/shared/types`
- Used by: all renderer code that accesses `window.electronAPI`

## Verification

- `npm run lint`
- `npm run typecheck`
- Ensure `window.electronAPI` is properly typed in all consumers
