# Settings & Shared Components Refactor Rules

Files: `src/components/settings/AddApiKeyDialog.tsx`, `src/components/settings/ApiKeyCard.tsx`, `src/components/shared/ConfirmDialog.tsx`, `src/components/shared/SkeletonTable.tsx`, `src/components/shared/SkeletonCard.tsx`, `src/components/shared/PageHeader.tsx`, `src/components/shared/EmptyState.tsx`

## Standards Violated

### 13 — Forms (validation logic)

- **Specific issues:**
  - `AddApiKeyDialog.tsx:41-48` — Inline validation logic for API key format. `validate()` returns string | null manually
  - `AddApiKeyDialog.tsx:12-16` — `KEY_PREFIXES` as `Record<string, RegExp>` with magic key patterns
- **Fix:** Extract validation into a schema (zod/joi) or a dedicated `validateApiKeyFormat` utility
- **Priority:** Medium

### 7 — Styling Standards

- **Specific issues:**
  - `AddApiKeyDialog.tsx:118-125` — Raw `<button>` element for show/hide password toggle instead of `<Button>` component
- **Fix:** Use the project's `Button` component for consistency
- **Priority:** Low

### 14 — Accessibility

- **Specific issues:**
  - `AddApiKeyDialog.tsx:78` — `role="form"` is redundant when using form elements
  - `AddApiKeyDialog.tsx:118` — Custom button for show/hide password missing explicit `aria-label`
- **Fix:** Remove redundant `role="form"`; add `aria-label="Toggle password visibility"`
- **Priority:** Low

### Clean Files

- `ApiKeyCard.tsx` — Clean, well-structured
- `ConfirmDialog.tsx` — Clean, good use of `useCallback`
- `SkeletonTable.tsx` — Clean
- `SkeletonCard.tsx` — Clean
- `PageHeader.tsx` — Clean
- `EmptyState.tsx` — Clean
