# Execution Components Refactor Rules

Files: `src/components/execution/ErrorDisplay.tsx`, `src/components/execution/StreamingText.tsx`, `src/components/execution/ExecutionControls.tsx`

## Standards Violated

### 6 — TypeScript Standards

- **Specific issues:**
  - `ErrorDisplay.tsx:14-16` — `categoryConfig` typed as `Record<string, {...}>` — should use `Record<ErrorDisplayProps['category'], {...}>` with mapped type
  - `ErrorDisplay.tsx:56` — `categoryConfig[category] ?? categoryConfig.unknown` — fallback works but type doesn't enforce all categories have configs
- **Fix:** Use a mapped type keyed by the error category union; enforce exhaustiveness
- **Priority:** Medium

### 11 — Error Handling (silent failures)

- **Specific issues:**
  - `StreamingText.tsx:25-27` — Empty `catch` block in `handleCopy` with only a comment (silently fails when clipboard is denied)
- **Fix:** Surface clipboard failures via toast or fallback copy method
- **Priority:** Low

### 17 — Code Smells to Eliminate

- **Specific issues:**
  - `ErrorDisplay.tsx:14-52` — Inline `categoryConfig` with `Record<string, ...>` creates a maintenance burden when new categories are added
  - `ExecutionControls.tsx` — Clean, small, focused component
- **Fix:** Extract category config to a constants file with typed keys
- **Priority:** Low

### 12 — Performance

- **Specific issues:**
  - `StreamingText.tsx:15-19` — `useEffect` scrolling on every `text` change — fine for streaming
- **Fix:** None — appropriate for the use case
- **Priority:** None
