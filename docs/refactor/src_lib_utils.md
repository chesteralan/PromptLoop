# Refactoring Rules: `src/lib/utils.ts`

## Purpose

Provides the `cn` utility function for merging Tailwind CSS classes using `clsx` and `tailwind-merge`.

## Current Issues

1. **Minimal file** (6 lines) — clean and functionally correct
2. **No custom merge configuration** — `tailwind-merge` default config handles standard Tailwind classes; could add custom prefixes or variants

## Refactoring Rules

1. **Add `extendTailwindMerge`** configuration if custom classes or prefixes are used
2. **Add `tw` tagged template literal** helper for template-based class composition (optional)
3. **Add JSDoc** for the `cn` function
4. **Add test** for the `cn` utility (merging conflicting classes)

## Dependencies

- `clsx`, `tailwind-merge`
- Used by: all UI components

## Verification

- `npm run lint`
- `npm run typecheck`
- Test `cn('px-4', 'px-2')` returns `'px-2'` (last wins)
