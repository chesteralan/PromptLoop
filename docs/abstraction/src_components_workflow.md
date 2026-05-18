# Abstraction Rules: Workflow Components

**Files:** `src/components/workflow/WorkflowSettings.tsx`, `PromptCard.tsx`, `ImportExportButtons.tsx`, `WorkflowStatusBadge.tsx`, `WorkflowCard.tsx`, `ModelSelector.tsx`, `SaveButton.tsx`, `QueueItem.tsx`, `PromptProgressBar.tsx`, `AddPromptButton.tsx`, `PromptEditorPanel.tsx`, `PromptList.tsx`

---

## `src/components/workflow/WorkflowSettings.tsx`

### Current Layer Mix

- Pure controlled form component — well-separated.

### Extraction Opportunities

- Extract `loopModeLabels` into a shared config (`src/lib/workflow-config.ts`).
- Extract `isValidLoopMode` into a shared validator.
- `SelectItem` children with description could be extracted as `LabelledSelectItem`.

### Interface Suggestions

- `WorkflowSettingsProps` is clean.

### Dependency Direction

- ✅ Only depends on UI primitives and `LoopMode` type.

### Duplication

- `loopModeLabels` mapping potentially duplicated elsewhere.
- Description-only `SelectItem` pattern.

### Constants/Magic Values

- `['infinite', 'fixed', 'single', 'scheduled']`, `1`/`9999` (iteration bounds).

---

## `src/components/workflow/PromptCard.tsx`

### Current Layer Mix

- Drag-and-drop (`Draggable`), inline state for delete confirmation, and card rendering.

### Extraction Opportunities

- Extract drag handle into a `DragHandle` component.
- The delete confirmation state pattern is duplicated — consider a `useConfirmDelete()` hook.

### Interface Suggestions

- `PromptCardProps` is clean.

### Dependency Direction

- ✅ Depends on `PromptData`, `ConfirmDialog`, and UI primitives — correct.

### Duplication

- Delete confirmation state machine (`showDelete`/`setShowDelete`/`ConfirmDialog`) duplicates `ApiKeyCard` and `DashboardPage`.

### Constants/Magic Values

- `'Delete Prompt'`, confirmation message template.

---

## `src/components/workflow/ImportExportButtons.tsx`

### Current Layer Mix

- Import/export logic (file dialog, JSON parsing, validation) mixed with UI rendering.

### Extraction Opportunities

- Extract `WorkflowExport` validation into `src/lib/workflow-validators.ts`.
- Extract export serialization into `src/lib/workflow-serializer.ts`.
- Extract import parsing into `src/lib/workflow-importer.ts`.

### Interface Suggestions

- `WorkflowExport` type should come from a shared location, not be local.
- `ImportExportService` interface: `exportWorkflow(data): WorkflowExport`, `validateImport(json): Result<WorkflowExport>`.

### Dependency Direction

- ⚠️ Direct `window.electronAPI.showSaveDialog`/`showOpenDialog`/`writeFile`/`readFile` calls — should use a `FileDialogService` interface.

### Duplication

- File dialog pattern (show dialog → check canceled → read/write) duplicated for both import and export — extract `useFileDialog()` hook.
- Prompt field stripping (`{ id: _id, workflowId: _wid, ... }`) is fragile — define explicit fields.

### Constants/Magic Values

- `'Export Workflow'`, `'Import Workflow'`, `version: 1`, `[{ name: 'JSON', extensions: ['json'] }]`, `'_'` (filename sanitization separator).

---

## `src/components/workflow/WorkflowStatusBadge.tsx`

### Current Layer Mix

- Pure presentational component.

### Extraction Opportunities

- Extract `statusConfig` into shared `workflow-status-config.ts`.
- The `status === 'running' && 'animate-pulse'` pattern is duplicated from `StatusBar.tsx`.

### Interface Suggestions

- `WorkflowStatusBadgeProps` is clean.

### Dependency Direction

- ✅ Depends only on `cn` utility and `WorkflowStatus` type.

### Duplication

- Status → color/label mappings duplicate `StatusBar.tsx` and `tray.ts`.

### Constants/Magic Values

- Status/label/className mapping for all 6 statuses.

---

## `src/components/workflow/WorkflowCard.tsx`

### Current Layer Mix

- Pure presentational card component.

### Extraction Opportunities

- None significant.

### Interface Suggestions

- `WorkflowCardProps` is clean — consider adding `className` prop.

### Dependency Direction

- ✅ Only depends on `Button`, `Card`, `WorkflowStatusBadge`.

### Duplication

- None.

### Constants/Magic Values

- `'Start'`, `'Stop'`, `'Edit'`, `'s'` suffix logic for prompt count.

---

## `src/components/workflow/ModelSelector.tsx`

### Current Layer Mix

- Model search/filter, group display, provider availability checking, and keyboard selection all mixed.

### Extraction Opportunities

- Extract search/filter logic into `useModelSearch(models, search)` hook.
- Extract `groupedModels` creation into `src/lib/models.ts` as a derived constant.
- Extract "no keys" empty state into a shared `EmptyState` variant.

### Interface Suggestions

- `ModelSelectorProps` is clean.

### Dependency Direction

- ✅ Depends on `useConfiguredProviders`, `models.ts`, and UI primitives.
- ⚠️ `useConfiguredProviders` fetches API keys just to show provider list — consider a lighter endpoint.

### Duplication

- Search + filter pattern reusable.
- `(Math.round(m.maxTokens / 1000).toLocaleString())` formatting duplicated — extract `formatTokens(n)`.

### Constants/Magic Values

- `'Search models...'`, `'Add an API key first'`, `'Select a model'`, `'No API keys configured'`, `'k'` (token suffix).

---

## `src/components/workflow/SaveButton.tsx`

### Current Layer Mix

- Minimal presentational component — good.

### Extraction Opportunities

- None needed.

### Interface Suggestions

- `SaveButtonProps` is clean.

### Dependency Direction

- ✅ Only depends on `Button`.

### Duplication

- `isSaving ? 'Saving...' : isNew ? 'Create' : 'Save'` — could be a prop with variants.

### Constants/Magic Values

- `'Saving...'`, `'Create'`, `'Save'`.

---

## `src/components/workflow/QueueItem.tsx`

### Current Layer Mix

- Pure presentational component.

### Extraction Opportunities

- Extract `statusIcon`/`statusColor` maps into shared config.

### Interface Suggestions

- `QueueItemProps` is clean.

### Dependency Direction

- ✅ Only depends on `cn` utility and `lucide-react`.

### Duplication

- Status/icon/color mapping duplicates `ErrorDisplay`'s `categoryConfig` pattern.

### Constants/Magic Values

- Status → icon/color mapping.

---

## `src/components/workflow/PromptProgressBar.tsx`

### Current Layer Mix

- Pure presentational component.

### Extraction Opportunities

- None significant.

### Interface Suggestions

- `PromptProgressBarProps` is clean.

### Dependency Direction

- ✅ Only depends on `cn` utility.

### Duplication

- Status color mapping duplicates `QueueItem`'s `statusColor`.

### Constants/Magic Values

- `'pending'`, `'running'`, `'completed'`, `'failed'` status strings, `32` (min segment width), `100` (flex percentage).

---

## `src/components/workflow/AddPromptButton.tsx`

### Current Layer Mix

- Minimal presentational component.

### Extraction Opportunities

- None needed.

### Interface Suggestions

- `AddPromptButtonProps` is clean.

### Dependency Direction

- ✅ Only depends on `Button`.

### Duplication

- `size="sm" variant="outline"` `mr-1.5 size-4` icon pattern duplicated.

### Constants/Magic Values

- `'Add Prompt'`.

---

## `src/components/workflow/PromptEditorPanel.tsx`

### Current Layer Mix

- Sheet layout, form fields for title/content/systemPrompt/model/temperature/tokens/delay/enabled, and conditional rendering for empty selection.

### Extraction Opportunities

- Extract form fields into a `PromptEditorForm` component.
- Extract slider/temperature widget into a `TemperatureSlider` component.
- Extract field labels + descriptions into a config object.

### Interface Suggestions

- `PromptEditorPanelProps` is clean.

### Dependency Direction

- ✅ Depends on `ModelSelector`, `Sheet`, form UI primitives.

### Duplication

- `<Label>` + `<Input>` / `<Textarea>` patterns repeated 7+ times — extract `FormField` component: `<FormField label={...}><Input ... /></FormField>`.
- `onChange(prompt.id, { ... })` pattern repeated for each field.

### Constants/Magic Values

- `1.0` (default temperature), `1024` (default maxTokens), `0`/`2` (temperature range), `0`/`60000` (delay range), `'Title'`, `'Prompt Content'`, `'System Prompt'`, `'Model'`, `'Temperature'`, `'Max Tokens'`, `'Delay After Execution (ms)'`, `'Enabled'`.

---

## `src/components/workflow/PromptList.tsx`

### Current Layer Mix

- Drag-and-drop context (`DragDropContext`, `Droppable`) mixed with reorder logic.

### Extraction Opportunities

- Extract `handleDragEnd` into a pure function or `useDragReorder()` hook.

### Interface Suggestions

- `PromptListProps` is clean.

### Dependency Direction

- ✅ Depends on `PromptCard` and `@hello-pangea/dnd`.

### Duplication

- None.

### Constants/Magic Values

- `'prompts'` (droppable ID).
