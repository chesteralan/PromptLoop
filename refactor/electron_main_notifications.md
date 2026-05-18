# Refactoring Rules: `electron/main/notifications.ts`

## Purpose

Sends native OS notifications for workflow completion and failure events.

## Current Issues

1. **Duplicated click handler logic** — `sendWorkflowCompleted` and `sendWorkflowFailed` both define identical click handlers to focus the first window
2. **`wins[0]`** may not be the most relevant window — should focus the window associated with the workflow
3. **No sound customization** — `silent: false` always plays notification sound
4. **Error message truncated** to 100 chars with `.slice(0, 100)` — could lose context; consider showing full message and truncating in the body display
5. **`show()` called immediately** after creation — fine, but `Notification` may not be supported on all platforms (Linux)

## Refactoring Rules

1. **Extract shared `onNotificationClick`** handler
2. **Focus window matching the workflow's webContents** instead of `wins[0]`
3. **Add platform check** for notification support
4. **Use `Notification.isSupported()`** check before creating notifications
5. **Make truncation length configurable** or use ellipsis-based truncation

## Dependencies

- External: `electron` (`Notification`, `BrowserWindow`)
- Internal: none
- Used by: `../engine/runner.ts`

## Verification

- `npm run typecheck` (electron)
- Test notification appears on workflow complete/fail
- Test click focuses app window
