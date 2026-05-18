# Refactoring Rules: `src/components/settings/`

## Purpose

Provides API key management components (AddApiKeyDialog, ApiKeyCard) for configuring AI provider credentials.

## Current Issues

### AddApiKeyDialog.tsx

- `handlePaste` reads clipboard on button click — `navigator.clipboard.readText()` requires `clipboard-read` permission which may fail in some browsers
- `validate()` uses regex patterns but doesn't warn about expired or malformed keys beyond prefix check
- `provider` state typed as `string` but should use the `PROVIDERS` tuple type for type safety
- `onSave` prop has `Promise<void>` return but the parent expects it to throw on error — inconsistent error handling pattern

### ApiKeyCard.tsx

- `providerColors` uses record lookup with fallback to `''` — but the empty string is used as a className which does nothing silently
- `onDelete` in parent `ApiKeysPage` updates local state _and_ calls API — inconsistency since `handleDelete` in this component calls `toast.success` before the parent's state update

## Refactoring Rules

1. **Add permission fallback** for clipboard read in `AddApiKeyDialog.tsx`
2. **Type `provider` state** as `(typeof PROVIDERS)[number]`
3. **Add `aria-live="polite"`** region for validation errors instead of toast-only
4. **Fix `providerColors` fallback** — provide a default className instead of empty string
5. **Unify delete flow** — either update state in `ApiKeyCard` or in parent, not both

## Dependencies

- `AddApiKeyDialog.tsx`: `../ui/dialog`, `../ui/button`, `../ui/input`, `../ui/label`, `../ui/select`, `lucide-react`, `sonner`
- `ApiKeyCard.tsx`: `lucide-react`, `sonner`, `../ui/button`, `../ui/badge`, `../ui/card`, `../shared/ConfirmDialog`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test save API key flow
- Test delete with confirmation
- Test clipboard paste
