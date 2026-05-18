# Abstraction Rules: Settings & Shared Components

**Files:** `src/components/settings/AddApiKeyDialog.tsx`, `ApiKeyCard.tsx`
**Shared:** `src/components/shared/ConfirmDialog.tsx`, `SkeletonTable.tsx`, `PageHeader.tsx`, `EmptyState.tsx`, `SkeletonCard.tsx`

---

## `src/components/settings/AddApiKeyDialog.tsx`

### Current Layer Mix

- Form state management, clipboard interaction, key prefix validation, provider selection, and save logic all in one component.

### Extraction Opportunities

- Extract `KEY_PREFIXES` validation patterns into a shared `src/lib/api-key-utils.ts`.
- Extract clipboard paste logic into `useClipboardPaste()` hook.
- Extract the provider select + key input into an `ApiKeyForm` component.
- Extract validation into pure function `validateApiKeyInput(provider, key): string | null`.

### Interface Suggestions

- `ApiKeyValidationService` interface: `validate(provider, key): ValidationResult`, `getExpectedFormat(provider): string`.
- `AddApiKeyDialogProps` is clean.

### Dependency Direction

- ✅ Depends on UI primitives and `sonner` toast.

### Duplication

- `PROVIDERS = ['openai', 'anthropic', 'google']` duplicated from `electron/main/ipc/api-keys.ts` and `electron/main/providers/factory.ts`.
- `validationError` display pattern reusable.
- `saving`/`setSaving` pattern duplicated.
- `Provider` capitalization `p.charAt(0).toUpperCase() + p.slice(1)` reusable utility.

### Constants/Magic Values

- `PROVIDERS`, `KEY_PREFIXES`, `'Add API Key'`, `'Paste from clipboard'`, `'API key is required'`, `'Invalid key format for '`, `'sk-...'`, `'sk-ant-...'`, `'AIza...'`, `'Saving...'`, `'Save'`, `'Cancel'`.

---

## `src/components/settings/ApiKeyCard.tsx`

### Current Layer Mix

- Card display with delete confirmation state machine.

### Extraction Opportunities

- Extract `providerColors` into a shared `src/lib/provider-config.ts`.
- Delete confirmation pattern duplicated across components — extract `useDeleteConfirm()` hook.

### Interface Suggestions

- `ApiKeyCardProps` is clean.

### Dependency Direction

- ✅ Only depends on UI primitives and `ConfirmDialog`.

### Duplication

- Delete confirmation state (`showDelete`/`setShowDelete`/`deleting`/`setDeleting`/`ConfirmDialog`) exact pattern from `PromptCard.tsx`.
- `providerColors` duplicates notion of provider-specific styling.

### Constants/Magic Values

- Provider color class mappings, `'Delete API Key'`, confirmation message template, `'API key deleted'`, `'Failed to delete API key'`.

---

## `src/components/shared/ConfirmDialog.tsx`

### Current Layer Mix

- Clean, reusable dialog — well-separated.

### Extraction Opportunities

- None — this is a well-factored shared component.

### Interface Suggestions

- `ConfirmDialogProps` is clean. Consider `loading?: boolean` for async confirmations.

### Dependency Direction

- ✅ Only depends on `Dialog` and `Button` UI primitives.

### Duplication

- N/A (this IS the shared component).

### Constants/Magic Values

- `'Confirm'` (default), `'Cancel'` (default).

---

## `src/components/shared/SkeletonTable.tsx`

### Current Layer Mix

- Pure presentational placeholder.

### Extraction Opportunities

- None.

### Interface Suggestions

- `SkeletonTableProps` is clean.

### Dependency Direction

- ✅ Only depends on `Table` and `Skeleton`.

### Duplication

- `Array.from({ length })` pattern reusable.

### Constants/Magic Values

- `5` (default rows), `4` (default columns), `'h-4 w-20'`/`'h-4 w-full'` skeleton sizes.

---

## `src/components/shared/PageHeader.tsx`

### Current Layer Mix

- Clean, reusable component.

### Extraction Opportunities

- None.

### Interface Suggestions

- `PageHeaderProps` is clean.

### Dependency Direction

- ✅ Only depends on `Button`.

### Duplication

- N/A (this IS the shared component).

### Constants/Magic Values

- None.

---

## `src/components/shared/EmptyState.tsx`

### Current Layer Mix

- Clean, reusable component.

### Extraction Opportunities

- None.

### Interface Suggestions

- `EmptyStateProps` is clean.

### Dependency Direction

- ✅ Only depends on `Button`.

### Duplication

- N/A (this IS the shared component).

### Constants/Magic Values

- None.

---

## `src/components/shared/SkeletonCard.tsx`

### Current Layer Mix

- Clean, reusable skeleton placeholder.

### Extraction Opportunities

- Could combine with `SkeletonTable` into a configurable `Skeleton` library.

### Interface Suggestions

- Could accept `lines?: number` for variable content length.

### Dependency Direction

- ✅ Only depends on `Card` and `Skeleton`.

### Duplication

- `Skeleton` component usage pattern duplicated across both skeleton components.

### Constants/Magic Values

- `'h-5 w-2/3'`, `'h-4 w-1/3'`, `'h-4 w-full'`, `'h-4 w-4/5'` skeleton sizes.
