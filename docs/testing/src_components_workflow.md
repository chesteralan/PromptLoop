# Workflow Components — Testing Rules

## 1. `src/components/workflow/AddPromptButton.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders button with "Add Prompt" label and Plus icon
  - `onClick` fires when clicked
  - `disabled` prop disables the button
- **Mocking requirements:** Button component
- **Coverage targets:** Enabled vs disabled
- **Suggested test file location:** `src/test/components/workflow/AddPromptButton.test.tsx`

## 2. `src/components/workflow/ImportExportButtons.tsx`

- **Test type:** Integration
- **Key scenarios:**
  - `handleExport()`: builds `WorkflowExport` with version 1, strips internal fields (`id`, `workflowId`, `createdAt`, `updatedAt`); calls `showSaveDialog`; if not canceled, calls `writeFile`; shows success/error toast
  - `handleImport()`: calls `showOpenDialog`; if not canceled, reads file; parses JSON; validates top-level fields (version, name, prompts array); validates each prompt (title, model, position number); calls `onImport` on success; shows error toast on invalid format or parse failure
  - Loading state disables both buttons
  - Import with invalid prompts shows error listing their names
- **Mocking requirements:** `window.electronAPI.showSaveDialog`, `showOpenDialog`, `writeFile`, `readFile`; `sonner` toast
- **Coverage targets:** Export canceled vs confirmed; write success vs error; import canceled; file read success vs error; JSON parse error; invalid top-level fields; invalid prompt fields; valid import
- **Suggested test file location:** `src/test/components/workflow/ImportExportButtons.test.tsx`

## 3. `src/components/workflow/ModelSelector.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Groups models by provider; filters by `configuredProviders`
  - Search input filters models by name or ID (case-insensitive)
  - When no keys configured: disables trigger; shows "Add an API key first" in trigger; shows "No API keys configured" in dropdown
  - When keys exist but search yields no results: empty filtered groups (no models shown)
  - Selected model shows name and token count in trigger
  - Empty/unknown value shows "Select a model"
  - `onChange` fires with model ID on selection
- **Mocking requirements:** `../../lib/models` (MODELS, PROVIDER_LABELS); `../../hooks/useConfiguredProviders`; Select, Input components
- **Coverage targets:** No keys configured; keys configured with/without search match; selected vs unselected; all provider groups
- **Suggested test file location:** `src/test/components/workflow/ModelSelector.test.tsx`

## 4. `src/components/workflow/PromptEditorPanel.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - `prompt` is null: shows "Select a prompt to edit" placeholder in Sheet
  - `prompt` exists: shows Sheet with title, editable fields (title, content, systemPrompt, model, temperature slider, maxTokens, delayMs, enabled switch)
  - Each field change calls `onChange` with correct (id, partial) payload
  - SystemPrompt: empty string converts to `undefined`
  - Temperature slider: range 0-2, step 0.1
  - Enabled switch: boolean toggle
- **Mocking requirements:** Sheet, Input, Textarea, Label, Switch, ModelSelector components
- **Coverage targets:** Null vs defined prompt; all field change handlers; systemPrompt undefined coalescing
- **Suggested test file location:** `src/test/components/workflow/PromptEditorPanel.test.tsx`

## 5. `src/components/workflow/PromptList.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders `DragDropContext` and `Droppable` wrapping `PromptCard` for each prompt
  - `handleDragEnd`: no-op if no destination or same index; reorders prompts array and calls `onReorder` with new ID order
  - Renders placeholder element
  - Each `PromptCard` receives correct props (key, index, isSelected, onSelect, onToggle, onDelete)
- **Mocking requirements:** `@hello-pangea/dnd` (DragDropContext, Droppable); PromptCard component
- **Coverage targets:** Drop to same position (no-op); drop to different position; empty prompts array
- **Suggested test file location:** `src/test/components/workflow/PromptList.test.tsx`

## 6. `src/components/workflow/PromptProgressBar.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Empty prompts array: returns null (renders nothing)
  - Renders button for each prompt with proportional width
  - Each button has correct status color class (pending, running, completed, failed)
  - Unknown status defaults to `pending` color
  - `onSegmentClick` fires with prompt ID when segment clicked
  - Each button shows truncated title
- **Mocking requirements:** None (pure display)
- **Coverage targets:** Empty; all 4 status values; unknown status fallback; click handler
- **Suggested test file location:** `src/test/components/workflow/PromptProgressBar.test.tsx`

## 7. `src/components/workflow/QueueItem.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Shows correct icon per status: pending (Circle), running (Loader2 spinning), completed (CheckCircle2), failed (XCircle)
  - Shows correct color per status
  - `isActive`: applies `border-primary/50 bg-accent/50` classes
  - `failed` status: applies `border-destructive/30`
  - Shows title; shows error text if present (only on failed)
  - Shows durationMs when completed and value present
  - Truncates long title/error text
- **Mocking requirements:** None (pure display)
- **Coverage targets:** All 4 status values; isActive true/false; error present/absent; durationMs present/absent
- **Suggested test file location:** `src/test/components/workflow/QueueItem.test.tsx`

## 8. `src/components/workflow/SaveButton.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - `isNew === true`: shows "Create" label
  - `isNew === false`: shows "Save" label
  - `isSaving === true`: shows "Saving..."
  - Disabled when `disabled` is true OR `isSaving` is true
- **Mocking requirements:** Button component
- **Coverage targets:** isNew + isSaving combinations; disabled state
- **Suggested test file location:** `src/test/components/workflow/SaveButton.test.tsx`

## 9. `src/components/workflow/WorkflowSettings.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Shows loop mode selector with 4 options (Infinite, Fixed, Single Pass, Scheduled)
  - `isValidLoopMode` validates against known values; invalid values rejected
  - When loop mode is `'fixed'`: shows Max Iterations input (min 1, max 9999)
  - When loop mode is not `'fixed'`: hides Max Iterations input
  - `onLoopModeChange` fires with valid LoopMode value
  - `onMaxIterationsChange` fires with number value
- **Mocking requirements:** Select, Input, Label components
- **Coverage targets:** All 4 loop modes; fixed vs non-fixed; invalid mode rejection
- **Suggested test file location:** `src/test/components/workflow/WorkflowSettings.test.tsx`

## 10. `src/components/workflow/WorkflowStatusBadge.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders correct label and color classes for all 6 statuses (idle, running, paused, completed, error, stopped)
  - Unknown status falls back to generic muted styling with status as label
  - Running status shows pulsing dot; non-running shows static dot
- **Mocking requirements:** None (pure display)
- **Coverage targets:** All 6 statuses; unknown status fallback
- **Suggested test file location:** `src/test/components/workflow/WorkflowStatusBadge.test.tsx`

## 11. `src/components/workflow/WorkflowCard.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Shows name, status badge, prompt count (with pluralization), loop mode
  - Status `'idle'`: shows Start button
  - Status `'running'`: shows Stop button
  - Status other than idle/running: shows neither Start nor Stop
  - Always shows Edit button and Delete button (trash icon)
  - Delete button has destructive color
  - `onStart`, `onStop`, `onEdit`, `onDelete` fire correctly
- **Mocking requirements:** Card, Button, WorkflowStatusBadge components
- **Coverage targets:** All statuses for control buttons; prompt count singular/plural; loop mode present/absent
- **Suggested test file location:** `src/test/components/workflow/WorkflowCard.test.tsx`

## 12. `src/components/workflow/PromptCard.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Wrapped in `Draggable` from `@hello-pangea/dnd`
  - Shows drag handle, position number (+1), title, model badge
  - Switch toggles enabled state
  - Edit button opens editor (calls `onSelect`)
  - Delete button shows `ConfirmDialog`
  - Dragging state applies highlight classes (`border-primary/50 bg-accent shadow-lg`)
  - Selected state applies `border-primary bg-accent/50`
  - Default state applies `bg-card hover:bg-accent/30`
  - ConfirmDialog: confirm calls `onDelete` and hides dialog; cancel hides dialog
- **Mocking requirements:** `@hello-pangea/dnd` Draggable; Button, Badge, Switch, ConfirmDialog components
- **Coverage targets:** Dragging vs selected vs default state; delete confirm/cancel
- **Suggested test file location:** `src/test/components/workflow/PromptCard.test.tsx`
