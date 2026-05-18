# Abstraction Rules: Execution Components

**Files:** `src/components/execution/ExecutionControls.tsx`, `StreamingText.tsx`, `ErrorDisplay.tsx`

---

## `src/components/execution/ExecutionControls.tsx`

### Current Layer Mix

- Pure presentational component — good separation.

### Extraction Opportunities

- Extract button config into a declarative map: `Record<ExecStatus, ButtonConfig[]>`.
- Extract `ExecStatus` type into shared types (duplicates `RunnerState` and `ExecStatus` from stores).

### Interface Suggestions

- `ExecutionControlsProps` is clean. Consider adding an `onResume` prop distinct from `onPause` for clarity.

### Dependency Direction

- ✅ Only depends on `../ui/button` and `lucide-react` — correct.

### Duplication

- `<Button size="sm" ...>` pattern repeated — could use a `ControlButton` factory.
- `mr-1.5 size-4` icon sizing repeated.

### Constants/Magic Values

- `'Start'`, `'Pause'`, `'Resume'`, `'Stop'`, `'Retry'`, `'mr-1.5 size-4'`.

---

## `src/components/execution/StreamingText.tsx`

### Current Layer Mix

- Clipboard copying, auto-scrolling, streaming indicator, and empty state all in one component.

### Extraction Opportunities

- Extract `useAutoScroll(dependency)` hook.
- Extract `useCopyToClipboard(text)` hook (share with other components).
- Extract streaming indicator (`animate-pulse dot`) into a shared `StreamingIndicator` component.
- Extract empty state placeholder into config or prop.

### Interface Suggestions

- `StreamingTextProps` is clean. Consider `className` prop for styling flexibility.

### Dependency Direction

- ✅ Only depends on `../ui/button`, `../ui/scroll-area`, and `lucide-react`.

### Duplication

- Copy button state machine (`copied`/`not copied` with timeout) reusable pattern.
- `animate-pulse rounded-full bg-blue-500` streaming dot duplicated inline.

### Constants/Magic Values

- `2000` (copy feedback timeout), `'Response'`, `'Streaming'`, `'Waiting for execution to start...'`, `' chars'`.

---

## `src/components/execution/ErrorDisplay.tsx`

### Current Layer Mix

- Category configuration (`categoryConfig`) mixed with rendering logic and navigation.

### Extraction Opportunities

- Extract `categoryConfig` into `src/lib/error-config.ts` — pure data.
- Extract retry progress bar into a `RetryProgressBar` component (shared with other UIs).
- Extract `getCategoryConfig(category): CategoryConfig` helper.

### Interface Suggestions

- `ErrorDisplayProps` could accept `onNavigate(path: string)` instead of `useNavigate` — better testability.
- `CategoryConfig` interface could be extracted and typed strictly.

### Dependency Direction

- ⚠️ Uses `useNavigate` from `react-router-dom` inline — couples error display to routing. Consider passing navigation callbacks as props.
- ✅ Only depends on UI components and `lucide-react`.

### Duplication

- `Icon` component lookup pattern (`const Icon = config.icon`) reusable.
- `size="sm" variant="outline"` button pattern repeated for both action buttons.

### Constants/Magic Values

- `'rate_limit'`, `'auth'`, `'server_error'`, `'timeout'`, `'network'`, `'unknown'` (category names), action labels, `'/settings/api-keys'`, `60_000` (progress max).
