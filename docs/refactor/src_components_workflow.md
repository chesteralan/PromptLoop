# Workflow Components Refactor Rules

Files: `src/components/workflow/WorkflowSettings.tsx`, `src/components/workflow/PromptCard.tsx`, `src/components/workflow/WorkflowStatusBadge.tsx`, `src/components/workflow/WorkflowCard.tsx`, `src/components/workflow/ImportExportButtons.tsx`, `src/components/workflow/ModelSelector.tsx`, `src/components/workflow/SaveButton.tsx`, `src/components/workflow/QueueItem.tsx`, `src/components/workflow/PromptProgressBar.tsx`, `src/components/workflow/AddPromptButton.tsx`, `src/components/workflow/PromptEditorPanel.tsx`, `src/components/workflow/PromptList.tsx`

## Standards Violated

### 9 — Import Rules

- **Specific issues:**
  - `WorkflowSettings.tsx:4` — Relative import `../../../electron/shared/types` for LoopMode — should use alias
  - `WorkflowStatusBadge.tsx:2` — Same: `../../../electron/shared/types`
  - `WorkflowCard.tsx:5` — Same: `../../../electron/shared/types`
- **Fix:** Add/use import alias for shared types (e.g., `@electron/shared/types`)
- **Priority:** Medium

### 17 — Code Smells to Eliminate (component complexity)

- **Specific issues:**
  - `PromptEditorPanel.tsx` — 139 lines handling 7 form fields inline; each field has its own `Label + Input/Textarea/Switch` block
  - `ModelSelector.tsx` — 116 lines with complex inline filtering logic (`filtered` computed from `search` and `visibleGroups`)
  - `ImportExportButtons.tsx` — Inline file read/write logic, inline JSON validation, inline prompt validation
- **Fix:** Extract field rendering to a reusable `FormField` component; extract model filtering logic to a custom hook; extract import/export validation to a utility
- **Priority:** Medium

### 1 — General Principles (readability)

- **Specific issues:**
  - `PromptEditorPanel.tsx:22-35` — Duplicated `<Sheet>` wrapper for null/selected prompt states
- **Fix:** Use a single Sheet wrapper and conditionally render content
- **Priority:** Low

### 14 — Accessibility

- **Specific issues:**
  - All workflow components: generally good (aria-labels on buttons)
- **Fix:** None
- **Priority:** None

### Clean Files

- `WorkflowSettings.tsx` — Clean, well-typed, single responsibility
- `PromptCard.tsx` — Clean with good use of ConfirmDialog
- `WorkflowStatusBadge.tsx` — Clean
- `WorkflowCard.tsx` — Clean
- `SaveButton.tsx` — Clean, minimal
- `QueueItem.tsx` — Clean
- `PromptProgressBar.tsx` — Clean
- `AddPromptButton.tsx` — Clean
- `PromptList.tsx` — Clean
