# Refactoring Rules: `src/hooks/useKeyboardShortcuts.ts`

## Purpose

Registers global keyboard shortcuts for navigation (Cmd+N for new workflow, Cmd+, for settings, Esc to close panels, Space for play/pause, Cmd+S for save).

## Current Issues

1. **`options` dependency** in `useEffect` — the effect re-runs every time `options` object reference changes (which is every render if inline). Should memoize `options` at call site or use ref
2. **`INPUT_SELECTOR`** constant is at module level — good
3. **`Escape` key handler** queries DOM for close buttons — fragile; should use a context or event-based approach
4. **Space key play/pause** — `e.key === ' '` prevents default scrolling, but if user is in an input that doesn't match `INPUT_SELECTOR` (e.g., custom editor), it still triggers
5. **Shortcuts conflict** with Electron's global shortcuts — `Cmd+N` opens a new window in most browsers; Electron suppresses this, but the app should too (it does via `e.preventDefault()`)
6. **No shortcut customization** — hardcoded shortcuts

## Refactoring Rules

1. **Wrap `options` in a ref** to avoid effect re-runs on every render
2. **Add `aria-keyshortcuts`** to relevant elements for accessibility
3. **Replace DOM query for Escape** with a context-based close mechanism
4. **Add `disabled` option** to disable shortcuts when a modal is open
5. **Extract shortcut definitions** into a config object for easier maintenance
6. **Fix `isInputFocused`** to also check for `contentEditable` elements (already there)
7. **Add `key` attribute** to the effect dependency to only re-run when `onSave`/`onPlayPause` change (use ref pattern)

## Dependencies

- `react`, `react-router-dom`
- Used by: pages that need keyboard shortcuts

## Verification

- `npm run lint`
- `npm run typecheck`
- Test Cmd+N navigates to /workflows/new
- Test Cmd+, navigates to /settings
- Test Esc closes open dialogs/sheets
- Test Space start/pause execution
- Test Cmd+S triggers save
