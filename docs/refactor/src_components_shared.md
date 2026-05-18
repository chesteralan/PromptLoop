# Refactoring Rules: `src/components/shared/`

## Purpose

Provides reusable shared UI components (ConfirmDialog, EmptyState, PageHeader, SkeletonCard, SkeletonTable) used across multiple pages.

## Current Issues

### ConfirmDialog.tsx

- `onOpenChange` callback recreates `onCancel` inline; this can cause unnecessary re-renders
- No `aria-describedby` linkage between description and dialog
- `variant` prop spreads but only used for `Button` variant; could simplify

### EmptyState.tsx

- `icon` prop typed as `LucideIcon` but could accept any React component via more generic type
- Accessibility: icon has no `aria-hidden` — should add

### PageHeader.tsx

- `onBack` button has no `aria-label` for screen readers
- Title uses `<h1>` which is correct but description `<p>` lacks `id` for `aria-describedby`

### SkeletonCard.tsx

- Clean; minimal component

### SkeletonTable.tsx

- Uses `Array.from({ length })` with `_` unused parameter; use `Array(columns).fill(null)` or `Array.from({ length }, (_, i) => i)` with key pattern
- No `aria-busy="true"` on table during loading

## Refactoring Rules

1. **Add `aria-hidden="true"`** to icon in `EmptyState.tsx`
2. **Add `aria-label`** to back button in `PageHeader.tsx`
3. **Memoize `onOpenChange`** callback in `ConfirmDialog.tsx` to prevent re-renders
4. **Use `aria-busy="true"`** on `SkeletonTable.tsx` wrapper
5. **Replace unused `_` parameter** in `SkeletonTable.tsx` with `(_, i)` pattern for clarity

## Dependencies

- `ConfirmDialog.tsx`: `../ui/dialog`, `../ui/button`
- `EmptyState.tsx`: `../ui/button`, `lucide-react`
- `PageHeader.tsx`: `../ui/button`, `lucide-react`
- `SkeletonCard.tsx`: `../ui/card`, `../ui/skeleton`
- `SkeletonTable.tsx`: `../ui/table`, `../ui/skeleton`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test dialog open/close cycle
