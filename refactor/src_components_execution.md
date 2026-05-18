# Refactoring Rules: `src/components/execution/`

## Purpose

Provides execution-time UI components (ExecutionControls, StreamingText, ErrorDisplay) for monitoring and controlling workflow runs.

## Current Issues

### ExecutionControls.tsx

- Duplicate button rendering for `stopped` / `error` states (both show Retry button)
- `loading` prop disables buttons but no `aria-busy` on the container
- Status union type `ExecStatus` is defined locally but duplicates `executionStore` status type

### StreamingText.tsx

- `scrollRef` is used on a child `div` inside `ScrollArea` but `ScrollArea` handles its own scrolling — the `useRef` + `scrollTop` may be ineffective
- Copy button shows for any non-empty text but clipboard API can fail; add error handling
- `handleCopy` is not wrapped in `useCallback`
- Empty state condition checks `!text && !isStreaming` but after execution starts, `isStreaming` may be true with empty text — correct behavior

### ErrorDisplay.tsx

- `_message` prop is destructured but unused — remove or use for debug display
- `categoryConfig` has `action.handler` typed as `undefined` for `rate_limit` but TypeScript may not narrow correctly
- `onRetry` is hidden for `auth` category but retry might still be useful after configuring key
- `retryAfterMs` is divided by `60_000` for progress bar which assumes max 60s — document this or make configurable

## Refactoring Rules

1. **Deduplicate `stopped` / `error` Retry button** in `ExecutionControls.tsx` by combining into single conditional
2. **Remove unused `_message` prop** from `ErrorDisplay.tsx`
3. **Wrap `handleCopy` in `useCallback`** in `StreamingText.tsx`
4. **Add clipboard API error handling** in `StreamingText.tsx`
5. **Use shared status type** from store instead of local `ExecStatus`
6. **Add `aria-busy`** to `ExecutionControls` container when `loading`
7. **Fix `ScrollArea` + `scrollRef`** — use `ScrollArea`'s `onScroll` or viewport ref instead

## Dependencies

- `ExecutionControls.tsx`: `lucide-react`, `../ui/button`
- `StreamingText.tsx`: `lucide-react`, `../ui/button`, `../ui/scroll-area`
- `ErrorDisplay.tsx`: `lucide-react`, `react-router-dom`, `../ui/button`, `../ui/progress`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test start/pause/stop/retry cycle
- Test clipboard copy
- Test error display with all categories
