# UI Primitives Refactor Rules

Files: `src/components/ui/*.tsx` (button, input, textarea, select, card, dialog, dropdown-menu, badge, avatar, switch, label, progress, scroll-area, separator, sheet, skeleton, table, tabs, tooltip, command, input-group)

## Assessment

All UI primitive files (shadcn-style components based on `@base-ui/react`) are well-structured and compliant with Frontend Refactor Standards:

### Standards Compliance

- **3 (React Component Standards):** Functional components, named exports, one component per file ✓
- **6 (TypeScript Standards):** Properly typed with forwardRef and VariantProps ✓
- **7 (Styling Standards):** Uses `cn()` utility with Tailwind classes consistently ✓
- **8 (File Naming):** camelCase.tsx as convention ✓
- **9 (Import Rules):** Consistent import grouping with `@/` alias ✓
- **14 (Accessibility):** Uses radix/base-ui primitives with built-in ARIA attributes ✓

### No Refactoring Needed

These files are generated/maintained as a UI primitive library. They follow consistent patterns and don't contain business logic. No changes recommended.

### Files Reviewed

- `button.tsx` — Clean, uses class-variance-authority
- `dialog.tsx` — Clean, good accessibility patterns
- `input.tsx`, `textarea.tsx`, `select.tsx` — Clean
- `card.tsx`, `badge.tsx`, `avatar.tsx` — Clean
- `switch.tsx`, `label.tsx`, `progress.tsx` — Clean
- `scroll-area.tsx`, `separator.tsx`, `sheet.tsx` — Clean
- `skeleton.tsx`, `table.tsx`, `tabs.tsx` — Clean
- `tooltip.tsx`, `command.tsx`, `input-group.tsx` — Clean
- `dropdown-menu.tsx` — Clean
