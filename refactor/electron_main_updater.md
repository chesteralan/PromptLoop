# Refactoring Rules: `electron/main/updater.ts`

## Purpose

Stub for auto-updater integration using `electron-updater`.

## Current Issues

1. **Empty stub function** — only has a comment. Either implement with `electron-updater` or add a TODO with the planned configuration
2. **No exports** other than `setupAutoUpdater` — file is 3 lines

## Refactoring Rules

1. **Implement auto-updater** with `electron-updater` and publish feed configuration
2. **Add update event handlers** for `checking-for-update`, `update-available`, `update-not-available`, `download-progress`, `update-downloaded`
3. **Add IPC events** to notify renderer of update status
4. **Add configuration** for update server URL (GitHub releases, S3, etc.)
5. **Remove if staying as stub** — delete file if auto-updater is not planned

## Dependencies

- External: `electron-updater`
- Internal: `./window` (for notifying renderer)
- Used by: `./index.ts`

## Verification

- N/A until implemented
