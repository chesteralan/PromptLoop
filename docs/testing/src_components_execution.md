# Execution Components — Testing Rules

## 1. `src/components/execution/ExecutionControls.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Status `'idle'`: shows Start button only
  - Status `'running'`: shows Pause + Stop buttons
  - Status `'paused'`: shows Resume + Stop buttons
  - Status `'stopped'` or `'error'`: shows Retry button only
  - All buttons are disabled when `loading` prop is true
  - Each button fires the correct callback (`onStart`, `onPause`, `onStop`, `onRetry`)
  - Each button shows correct icon and label text
  - `loading` sets `aria-busy` on container
- **Mocking requirements:** Button component
- **Coverage targets:** All 6 status values; loading disabled vs enabled; all button callbacks
- **Suggested test file location:** `components/execution/__tests__/ExecutionControls.test.tsx`

## 2. `src/components/execution/StreamingText.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Empty `text` + not streaming: shows "Waiting for execution to start..." placeholder
  - Has `text`: renders ScrollArea with monospace pre; shows copy button; shows char count footer
  - Is streaming: shows streaming indicator (pulsing dot + "Streaming" label)
  - Copy button copies text to clipboard; shows checkmark for 2 seconds; catch clipboard errors silently
  - Auto-scrolls to bottom when text changes (ref scrollTop = scrollHeight)
- **Mocking requirements:** `navigator.clipboard.writeText`; ScrollArea, Button components
- **Coverage targets:** Empty + not streaming; empty + streaming; has text + streaming; has text + not streaming; clipboard success vs failure
- **Suggested test file location:** `components/execution/__tests__/StreamingText.test.tsx`

## 3. `src/components/execution/ErrorDisplay.tsx`

- **Test type:** Unit
- **Key scenarios:**
  - Renders correct icon and label for each category: `rate_limit` (Clock), `auth` (Key), `server_error` (Server), `timeout` (Clock), `network` (WifiOff), `unknown` (AlertTriangle)
  - Unknown category falls back to `'unknown'` config
  - Shows `userMessage` text
  - `auth` category: shows "Configure API Key" button navigating to `/settings/api-keys`
  - Non-auth categories with `onRetry`: shows retry button
  - `auth` category: does NOT show retry button even if `onRetry` provided
  - `retryAfterMs` > 0: shows Progress bar and "Retrying in Xs..." countdown
  - `retryAfterMs` null/0: no progress bar rendered
- **Mocking requirements:** `react-router-dom` useNavigate; Button, Progress components
- **Coverage targets:** All 6 categories; auth vs non-auth retry suppression; retryAfterMs null/present; navigate call
- **Suggested test file location:** `components/execution/__tests__/ErrorDisplay.test.tsx`

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
