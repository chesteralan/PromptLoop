# Refactoring Rules: `src/hooks/useAutoSave.ts`

## Purpose

Generic auto-save hook that debounces saves when data changes and also handles Cmd/Ctrl+S keyboard shortcut.

## Current Issues

1. **`saveNow`** is wrapped in `useCallback` with `[data, isNew, save, onSaveStart, onSaveEnd]` — `data` in deps means `saveNow` reference changes every time `data` changes, which defeats `useCallback`'s purpose. The effect that calls `saveNow` has `saveNow` in deps, causing a loop: data changes → `saveNow` changes → effect re-runs → `setTimeout` cleared/reset
2. **`saveNow` is async** but called from `setTimeout` callback without error handling — if `save()` rejects, the promise is unhandled
3. **`lastSavedRef`** compares `JSON.stringify(data)` — works for simple data but fails for objects with methods, undefined values, or circular references
4. **`isDirty` state** is set by the effect but `saveNow` also sets `isDirty(false)` on success — the race condition where dirty is set but save is pending is not handled
5. **Keyboard shortcut** (`Cmd/Ctrl+S`) calls `saveNow()` but `saveNow` returns early if `isNew` — user gets no feedback that save is disabled for new items
6. **`timerRef` cleanup** on unmount is handled in the effect's cleanup — correct
7. **`delay = 2000`** might be too long for some use cases; should be configurable per-instance (already is via prop)
8. **No `isDirty` indicator** exposed to show "unsaved changes" status (already exposed)

## Refactoring Rules

1. **Fix `saveNow` dependency** — use `useRef` for `data` to avoid changing `saveNow` reference on every data change
2. **Add `.catch()`** to the async `saveNow` call
3. **Add `forceSave()`** option that ignores `isNew` check
4. **Replace `JSON.stringify` comparison** with a deep equality check or `isEqual` from lodash
5. **Add `isDirty` false on error** — currently `isDirty` stays true after a failed save
6. **Add `lastSavedAt` return** — timestamp of last successful save
7. **Add `debug` mode** via env var to log save events

## Dependencies

- `react` only (no UI dependencies)
- Used by: `../pages/WorkflowEditor`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test auto-save triggers after delay when data changes
- Test Cmd+S triggers immediate save
- Test isNew prevents save for new items
- Test isDirty resets after save
