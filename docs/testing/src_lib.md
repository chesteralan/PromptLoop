# Lib Modules — Testing Rules

## 1. `src/lib/converters.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `ts()` converts Date to Firestore Timestamp
  - `fromTS()` converts Timestamp to Date; passes through Date; falls back to new Date for unknown types
  - `optTS()` returns undefined for null/undefined; delegates to `fromTS` otherwise
  - `workflowConverter.toFirestore()` serializes WorkflowData with timestamps
  - `workflowConverter.fromFirestore()` deserializes with timestamp → Date conversion
  - `promptConverter.toFirestore()` / `fromFirestore()` same pattern for prompts
  - `executionConverter.toFirestore()` includes optional startedAt/completedAt (null if absent)
  - `executionConverter.fromFirestore()` handles optional timestamps via `optTS`
  - `apiKeyConverter.toFirestore()` / `fromFirestore()` handles optional lastUsedAt
- **Mocking requirements:** `firebase/firestore` Timestamp, QueryDocumentSnapshot, SnapshotOptions
- **Coverage targets:** All 4 converters; optional timestamp null vs present; fromTS fallback for unknown type
- **Suggested test file location:** `src/test/lib/converters.test.ts`

## 2. `src/lib/electron-mock.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `injectElectronMock()`: no-op if `window.electronAPI` already exists
  - Creates full `ElectronAPI` mock with all methods returning sensible defaults
  - `on()` functions return cleanup callbacks that remove the listener
  - `startWorkflow`/`pauseWorkflow`/`stopWorkflow`/`retryWorkflow` return `{ success: true, workflowId: '' }`
  - `encryptApiKey` returns `{ id: 'mock-id', keyPrefix: 'sk-****' }`
  - `decryptApiKey` returns `{ key: 'mock-key' }`
  - `listApiKeys` returns `[]`
  - `getAppVersion` returns `'0.0.0'`
  - File operations return success with empty/null defaults
- **Mocking requirements:** `window` global
- **Coverage targets:** Already exists vs fresh inject; on/off lifecycle
- **Suggested test file location:** `src/test/lib/electron-mock.test.ts`

## 3. `src/lib/firebase.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Validates all 6 required `VITE_FIREBASE_*` env vars; throws on missing
  - Initializes Firebase app with config from env vars
  - Exports `auth` and `db` instances
  - DEV mode: connects to auth emulator (localhost:9099) and Firestore emulator (localhost:8080); catches errors silently if emulators not running
- **Mocking requirements:** `firebase/app` (initializeApp); `firebase/auth` (getAuth, connectAuthEmulator); `firebase/firestore` (getFirestore, connectFirestoreEmulator); `import.meta.env`
- **Coverage targets:** All 6 env vars present vs missing; DEV vs production; emulator connect success vs error
- **Suggested test file location:** `src/test/lib/firebase.test.ts`

## 4. `src/lib/ipc.ts`

- **Test type:** Unit (type-only)
- **Key scenarios:**
  - `ElectronAPI` interface defines all IPC methods with correct types
  - `Window` interface extends with `electronAPI` property
- **Mocking requirements:** None (type definitions)
- **Coverage targets:** N/A
- **Suggested test file location:** `src/test/lib/ipc.test.ts`

## 5. `src/lib/models.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `MODELS` array contains 11 model entries across 3 providers
  - OpenAI: 5 models (gpt-4o through gpt-3.5-turbo)
  - Anthropic: 3 models (claude-3-5-sonnet, haiku, opus)
  - Google: 3 models (gemini-2.0-flash, 1.5-pro, 1.5-flash)
  - Each `ModelInfo` has id, name, provider, maxTokens
  - `PROVIDER_LABELS` maps provider keys to display names
- **Mocking requirements:** None (data constants)
- **Coverage targets:** All 11 entries; 3 provider labels
- **Suggested test file location:** `src/test/lib/models.test.ts`

## 6. `src/lib/sentry.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `initRendererSentry()`: returns early when `VITE_SENTRY_DSN` not set
  - When DSN set: calls `init()` with correct DSN, env, tracesSampleRate (1.0 for dev, 0.1 for production)
  - `beforeSend` filters: "ResizeObserver", "Non-Error exception captured", "Script error." → returns null
  - Other events pass through unchanged
- **Mocking requirements:** `@sentry/electron/renderer` `init` function; `import.meta.env`
- **Coverage targets:** DSN present/absent; DEV vs production; all 3 filter patterns
- **Suggested test file location:** `src/test/lib/sentry.test.ts`

## 7. `src/lib/utils.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `cn()` merges class names using clsx + tailwind-merge
  - Returns single string of merged classes
  - Tailwind conflicts resolved correctly (last class wins)
- **Mocking requirements:** None
- **Coverage targets:** Basic merge; conflict resolution; empty input; conditional classes (objects/arrays)
- **Suggested test file location:** `src/test/lib/utils.test.ts`
