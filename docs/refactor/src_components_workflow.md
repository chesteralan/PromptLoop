# Refactoring Rules: `src/components/workflow/`

## Purpose

Provides workflow editing and display components (WorkflowSettings, PromptCard, PromptList, PromptEditorPanel, PromptProgressBar, QueueItem, AddPromptButton, SaveButton, ImportExportButtons, ModelSelector, WorkflowStatusBadge, WorkflowCard).

## Current Issues

### WorkflowSettings.tsx

- Import path `../../../electron/shared/types` uses deep relative path; use an alias or barrel export
- `LoopMode` import from electron shared types creates renderer/main coupling
- `onLoopModeChange` cast `(v as LoopMode)` is unsafe; add validation

### PromptCard.tsx

- `PromptData & { id: string }` type repeated across files; extract into shared type
- No `aria-label` on delete/edit buttons
- `showDelete` state managed per card; could move to parent for consistency

### PromptList.tsx

- Clean; minimal issues
- `handleDragEnd` uses `Array.from` which creates a shallow copy — fine for reorder

### PromptEditorPanel.tsx

- `onChange` callback type `Partial<Omit<PromptData, 'id' | 'createdAt' | 'updatedAt'>>` is complex; extract as `PromptUpdateData`
- Empty state sheet (when `!prompt`) renders unnecessary overlay; consider disabling trigger instead
- Temperature range input uses native `<input type="range">` instead of a styled component

### PromptProgressBar.tsx

- `statusColors` uses `status` as index key; TypeScript infers `string` — use `Record<string, string>` explicitly (already done)
- `status` property type on `PromptProgressItem` is a string union but `statusColors` lookup allows any string

### QueueItem.tsx

- Clean; well-structured

### AddPromptButton.tsx

- Trivial wrapper; could inline in parent

### SaveButton.tsx

- Trivial wrapper; could inline in parent

### ImportExportButtons.tsx

- `handleImport` validates each prompt field but error message shows only for first invalid prompt
- `JSON.parse` result cast as `WorkflowExport` is unsafe; use Zod or explicit runtime validation
- `handleExport` destructures `id`, `workflowId`, `createdAt`, `updatedAt` with underscore prefix but doesn't use them — these are correct side effects but `_` prefix is conventional

### ModelSelector.tsx

- `groupedModels` computed at module level — fine
- `noKeysConfigured` message inside `SelectContent` uses inline JSX; extract to separate component
- Search input's `onClick.stopPropagation()` prevents select from closing — intentional but fragile

### WorkflowStatusBadge.tsx

- Clean; well-structured

### WorkflowCard.tsx

- `status` is typed as `string` but should be `WorkflowStatus` from shared types
- `onStart`/`onStop`/`onEdit`/`onDelete` callbacks not wrapped in `useCallback` at parent
- `loopMode` not used in a meaningful way in the display (only shows raw value)

## Refactoring Rules

1. **Create shared `PromptItem` type** (`PromptData & { id: string }`) in `lib/types.ts`
2. **Replace deep import `../../../electron/shared/types`** with a barrel export from `electron/shared/types`
3. **Use Zod schema** for import validation in `ImportExportButtons.tsx` instead of manual checks
4. **Type `status` as `WorkflowStatus`** in `WorkflowCard.tsx`
5. **Combine AddPromptButton and SaveButton** into parent component to reduce indirection
6. **Fix `LoopMode` cast** with runtime validation helper
7. **Add `aria-label`** to icon-only buttons in `PromptCard.tsx`
8. **Move `showDelete` state** to parent list component

## Dependencies

- Internal: all import from `../ui/*`, `../../lib/utils`
- `ModelSelector.tsx`: `../../lib/models`, `../../hooks/useConfiguredProviders`
- `ImportExportButtons.tsx`: `../../lib/converters`
- `PromptEditorPanel.tsx`: `./ModelSelector`, `../../lib/converters`
- `PromptCard.tsx`: `@hello-pangea/dnd`, `../../lib/converters`
- `PromptList.tsx`: `@hello-pangea/dnd`, `./PromptCard`, `../../lib/converters`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test drag-and-drop reordering
- Test import/export workflow files
- Test model selection with configured providers
