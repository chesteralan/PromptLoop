# Settings & Shared Components — Testing Rules

## 1. `src/components/settings/AddApiKeyDialog.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Opens dialog with Provider dropdown and API Key input (password masked)
  - Provider selection updates provider state and clears validation error
  - Toggle show/hide key button changes input type
  - Paste button reads clipboard and sets key (trimmed); shows error toast on clipboard failure
  - `validate()`: returns error for empty key; validates format prefix (`sk-` for OpenAI, `sk-ant-` for Anthropic, `AIza` for Google); returns null for valid
  - Save button disabled when key is empty or saving
  - Save calls `onSave(provider, trimmedKey)`; shows success toast; resets form; closes dialog
  - Save error shows error toast
  - Validation error shows alert banner with `role="alert"`
  - Cancel button closes dialog
- **Mocking requirements:** `navigator.clipboard.readText`; `sonner` toast; Dialog, Button, Input, Label, Select components
- **Coverage targets:** All 3 provider prefix patterns; validation pass/fail; clipboard read success/failure; save success/error
- **Suggested test file location:** `components/settings/__tests__/AddApiKeyDialog.test.tsx`

## 2. `src/components/settings/ApiKeyCard.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Shows provider name (capitalized), key prefix with ellipsis, formatted date
  - Provider colors: openai=green, anthropic=orange, google=blue; unknown falls back to openai
  - Delete button shows `ConfirmDialog`; `deleting` state disables delete button
  - Confirm calls `onDelete(id)`; shows success/error toast
- **Mocking requirements:** `sonner` toast; Card, Badge, Button, ConfirmDialog components
- **Coverage targets:** All 3 provider color schemes; unknown provider fallback; delete success/error
- **Suggested test file location:** `components/settings/__tests__/ApiKeyCard.test.tsx`

## 3. `src/components/shared/ConfirmDialog.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Shows dialog with title, message, confirm and cancel buttons
  - `variant='destructive'`: confirm button uses destructive variant
  - `variant='default'`: confirm button uses default variant
  - `confirmLabel` defaults to "Confirm"; `cancelLabel` defaults to "Cancel"
  - `onConfirm` fires on confirm click
  - `onCancel` fires on cancel click
  - Dialog close (dismiss) triggers `onCancel` via `handleOpenChange`
- **Mocking requirements:** Dialog, Button components
- **Coverage targets:** Default vs destructive variant; default labels; close via dismiss
- **Suggested test file location:** `components/shared/__tests__/ConfirmDialog.test.tsx`

## 4. `src/components/shared/EmptyState.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders icon, title, optional description
  - `description` absent: no description rendered
  - `actionLabel` + `onAction` both present: shows action button
  - Missing `actionLabel` or `onAction`: no button rendered
  - Button click fires `onAction`
- **Mocking requirements:** Button component
- **Coverage targets:** With/without description; with/without action
- **Suggested test file location:** `components/shared/__tests__/EmptyState.test.tsx`

## 5. `src/components/shared/PageHeader.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders title and optional description
  - `onBack` provided: shows back button with ArrowLeft icon; click fires `onBack`
  - `onBack` absent: no back button
  - `actions` provided: renders actions container
  - `actions` absent: no actions container
- **Mocking requirements:** Button component
- **Coverage targets:** Back button present/absent; actions present/absent; description present/absent
- **Suggested test file location:** `components/shared/__tests__/PageHeader.test.tsx`

## 6. `src/components/shared/SkeletonTable.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders table with `rows`×`columns` skeleton cells
  - Defaults: rows=5, columns=4
  - Custom rows/columns respected
  - `aria-busy="true"` on container
- **Mocking requirements:** Table, Skeleton components
- **Coverage targets:** Default vs custom dimensions
- **Suggested test file location:** `components/shared/__tests__/SkeletonTable.test.tsx`

## 7. `src/components/shared/SkeletonCard.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders Card with header (2 skeletons) and content (2 skeletons)
  - Static structure, no interactive elements
- **Mocking requirements:** Card, Skeleton components
- **Coverage targets:** N/A (single render path)
- **Suggested test file location:** `components/shared/__tests__/SkeletonCard.test.tsx`

---

---

## Global Rule

All test files must be placed in a `__tests__` directory within the same folder as the source file:

- `src/components/auth/AuthProvider.tsx` → `src/components/auth/__tests__/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `src/hooks/__tests__/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `electron/main/__tests__/encryption.test.ts`

This keeps tests co-located with their source, making it easy to find and maintain related tests.
All test files must be placed under ``. Mirror the source path structure:

- `src/components/auth/AuthProvider.tsx` → `components/auth/AuthProvider.test.tsx`
- `src/hooks/useWorkflows.ts` → `hooks/useWorkflows.test.ts`
- `electron/main/encryption.ts` → `electron/main/encryption.test.ts`

This keeps all tests colocated under a single ``root regardless of whether the source is in`src/`or`electron/`.
