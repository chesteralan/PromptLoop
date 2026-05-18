# Refactoring Rules: `src/components/ui/`

## Purpose

Provides reusable UI primitives (avatar, badge, button, card, command, dialog, dropdown-menu, input-group, input, label, progress, scroll-area, select, separator, sheet, skeleton, switch, table, tabs, textarea, tooltip) built on Base UI React, shadcn-style.

## Current Issues

### avatar.tsx

- `AvatarFallback` wraps children that may need explicit type narrowing
- `AvatarBadge` and `AvatarGroup` use generic `React.ComponentProps<'span' | 'div'>` with no semantic role
- `size` prop uses string union but no runtime validation

### badge.tsx

- `useRender.ComponentProps` import is fragile; rename to `ComponentProps` for clarity
- `mergeProps` import may be unnecessary if only passing `className`

### button.tsx

- `Button` does not forward `ref`; add `forwardRef` for form integration
- Complex `cva` class string is hard to maintain; extract into multi-line template

### card.tsx

- No semantic landmark roles (e.g., `role="region"` for Card)
- `CardAction` has no `aria-label` context

### command.tsx

- `CommandItem` uses `data-selected` attribute but also CSS `data-[checked=true]` which is ambiguous
- `CommandInput` hardcodes `SearchIcon`; should accept custom icon via prop
- `CommandDialog` accepts `children` union that overlaps with `Dialog` props

### dialog.tsx

- `DialogFooter.showCloseButton` defaults to `false` but user may expect close button by default
- `DialogContent` uses generic `children` with no fragment wrapper

### dropdown-menu.tsx

- `'use client'` directive used but this is a library file; should use Next.js convention only if needed
- `DropdownMenuSubContent` re-types props from `DropdownMenuContent` rather than reusing its type
- `DropdownMenuLabel` uses `data-inset` attribute with boolean but no `aria-hidden` when inset

### input-group.tsx

- `'use client'` directive possibly unnecessary
- `InputGroupAddon.onClick` accesses `parentElement` with unsafe chaining
- `InputGroupButton` re-declares `type` prop instead of using `ComponentProps<typeof Button>`

### input.tsx

- `Input` uses `InputPrimitive` from Base UI but also extends `React.ComponentProps<'input'>`; one of these is redundant
- No `forwardRef` support

### label.tsx

- Clean; minimal refactoring needed. Reorder `htmlFor` usage if used with Input

### progress.tsx

- `Progress` component hardcodes `ProgressTrack` and `ProgressIndicator` children; should allow custom children
- `value` prop from `ProgressPrimitive.Root.Props` is not typed as optional despite default

### scroll-area.tsx

- `ScrollBar` uses `data-horizontal` / `data-vertical` CSS selectors but orientation is already in `data-orientation`

### select.tsx

- Static `bg-white` / `dark:bg-gray-900` hardcoded in `SelectContent` instead of using CSS variables
- `SelectScrollUpButton` / `SelectScrollDownButton` duplicate similar code

### separator.tsx

- Clean; no issues

### sheet.tsx

- `SheetContent` uses string literal animation classes; extract to constants
- Animation classes duplicate across `side` variants; can be simplified with CSS

### skeleton.tsx

- Clean; minimal

### switch.tsx

- Complex inline Tailwind string for thumb positioning; extract to reusable classes
- `data-checked` / `data-unchecked` selectors used but not standard Base UI attributes

### table.tsx

- `TableHeader` uses `[&_tr]:border-b` selector that couples to child implementation
- No `role="rowgroup"` on `TableHeader` / `TableBody`

### tabs.tsx

- `group-data-[variant=line]` selectors deeply nested in `TabsTrigger` class string
- `tabsListVariants` not strongly typed for all variant combinations

### textarea.tsx

- Clean; same `forwardRef` concern as Input

### tooltip.tsx

- `TooltipContent` passes many positional props but doesn't provide sensible defaults for all
- `Arrow` element has complex inline positioning; could be separate styled component

## Refactoring Rules

1. **Add `forwardRef`** to `Button`, `Input`, `Textarea` for form library compatibility
2. **Replace hardcoded colors** (`bg-white`, `dark:bg-gray-900`) with CSS variable references in `select.tsx`
3. **Extract complex class strings** from `switch.tsx`, `tabs.tsx`, `card.tsx` into separate CSS classes or constants
4. **Remove `'use client'`** from `input-group.tsx`, `dropdown-menu.tsx`, `label.tsx`, `progress.tsx`, `sheet.tsx`, `table.tsx`, `tabs.tsx` unless targeting Next.js App Router
5. **Add semantic `role` attributes** to `Card` (`region`), `TableHeader`/`TableBody` (`rowgroup`)
6. **Deduplicate scroll button code** in `select.tsx` via shared helper
7. **Normalize `data-checked` / `data-unchecked`** to standard `data-state` pattern in `switch.tsx`
8. **Type re-exports**: `DropdownMenuSubContent` should reuse `DropdownMenuContent`'s props type directly
9. **Remove redundant `InputPrimitive` wrapper** in `input.tsx` if not using Base UI features

## Dependencies

- Internal: all depend on `@/lib/utils` (`cn` helper)
- External: `@base-ui/react/*`, `class-variance-authority`, `lucide-react`
- `command.tsx`: depends on `dialog.tsx`, `input-group.tsx`
- `dialog.tsx`: depends on `button.tsx`
- `input-group.tsx`: depends on `button.tsx`, `input.tsx`, `textarea.tsx`
- `sheet.tsx`: depends on `button.tsx`

## Verification

- `npm run lint` — no lint errors
- `npm run typecheck` — no type errors
- Visual regression check in storybook or browser
- Confirm `forwardRef` works by testing form focus scenarios
