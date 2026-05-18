# Abstraction Rules: Lib

**Files:** `src/lib/utils.ts`, `converters.ts`, `firebase.ts`, `ipc.ts`, `models.ts`, `sentry.ts`, `electron-mock.ts`

---

## `src/lib/utils.ts`

### Current Layer Mix

- Single `cn()` utility function — well-factored.

### Extraction Opportunities

- None — this is the right abstraction level.
- Could add additional pure utility functions here (e.g., `formatTokens`, `truncateWithEllipsis`).

### Interface Suggestions

- None.

### Dependency Direction

- ✅ Zero project dependencies — only `clsx` and `tailwind-merge`.

### Duplication

- N/A.

### Constants/Magic Values

- None.

---

## `src/lib/converters.ts`

### Current Layer Mix

- Firestore `DataConverter` definitions, data model interfaces (`WorkflowData`, `PromptData`, `ExecutionData`, `ApiKeyData`), and timestamp conversion utilities all in one file.

### Extraction Opportunities

- Extract data model interfaces into `src/lib/models/` directory as separate files.
- Extract timestamp utilities (`ts`, `fromTS`, `optTS`) into `src/lib/firestore-utils.ts`.
- Extract the converter factory pattern (identical structure for 4 converters) into a `createConverter<T>()` helper.

### Interface Suggestions

- `FirestoreModel<T>` interface: `toFirestore(model: T): Record<string, unknown>`, `fromFirestore(snapshot): T`.
- The converter type signatures could be simplified with a generic builder.

### Dependency Direction

- ✅ Pure data transformation — no coupling to UI or business logic.
- ✅ Depends only on Firestore types and `electron/shared/types`.

### Duplication

- **High duplication** — the `toFirestore`/`fromFirestore` pattern is repeated identically for `workflowConverter`, `promptConverter`, `executionConverter`, and `apiKeyConverter`.
- `createdAt: ts(model.createdAt as Date)` / `updatedAt: ts(model.updatedAt as Date)` repeated in every converter.
- `fromFirestore` pattern `{ ...data, createdAt: fromTS(data.createdAt), updatedAt: fromTS(data.updatedAt) }` repeated.
- Consider a generic `createConverter<T>(fields, timestamps?)` factory.

### Constants/Magic Values

- `'users'`, `'workflows'`, `'prompts'`, `'executions'` (collection names embedded in converter logic but not as string literals — they come from callers).

---

## `src/lib/firebase.ts`

### Current Layer Mix

- Firebase app initialization, env var validation, auth/firestore instance creation, and emulator connection — well-organized.

### Extraction Opportunities

- Extract env var validation into `src/lib/env.ts` as a `validateRequiredEnvVars(keys): void` utility.
- Extract emulator connection into `src/lib/emulators.ts`.

### Interface Suggestions

- None — clean initialization file.

### Dependency Direction

- ✅ Zero internal project dependencies — only `firebase/*` packages.

### Duplication

- None.

### Constants/Magic Values

- `REQUIRED_KEYS` array, `'VITE_FIREBASE_'` env var prefix, `'http://localhost:9099'`, `'localhost'`, `8080` (emulator config).

---

## `src/lib/ipc.ts`

### Current Layer Mix

- `ElectronAPI` type definition and global `Window` augmentation — well-separated.

### Extraction Opportunities

- This is the src-side IPC type definition. Ensure it stays in sync with `electron/preload/index.ts` — currently they are manually kept in sync. Consider generating one from the other.

### Interface Suggestions

- `ElectronAPI` is comprehensive. Consider adding event listener interfaces for better typing:
  - `ExecutionListeners: { onChunk, onCompleted, onFailed, onWorkflowDone }`.

### Dependency Direction

- ✅ Depends only on `electron/shared/types` — correct.

### Duplication

- Method signatures duplicate `electron/preload/index.ts` implementation — consider a shared interface.
- `'execution:chunk'`/`'execution:completed'`/`'execution:failed'`/`'workflow:completed'` event types duplicated from `electron/main/engine/types.ts`.

### Constants/Magic Values

- None (pure types).

---

## `src/lib/models.ts`

### Current Layer Mix

- Model definitions and provider labels — pure data, well-separated.

### Extraction Opportunities

- Move to `src/lib/models/models.ts` or align with `electron/main/providers/interface.ts` `ModelInfo`.
- Add `MODEL_TO_PROVIDER: Record<string, string>` lookup (currently done inline in `ModelSelector.tsx`).

### Interface Suggestions

- `ModelInfo` is clean. Consider adding `provider` field (already has it) — good.
- Could add `pricing?: { input: number; output: number }` for cost estimation.

### Dependency Direction

- ✅ Zero dependencies — pure constants.

### Duplication

- `ModelInfo` interface duplicated from `electron/main/providers/interface.ts`.
- Model list (gpt-4o, claude-3-5, gemini, etc.) duplicates provider files.

### Constants/Magic Values

- All model IDs, names, provider mappings, max token counts.

---

## `src/lib/sentry.ts`

### Current Layer Mix

- Renderer-side Sentry initialization — well-separated.

### Extraction Opportunities

- Extract common filter patterns shared with `electron/main/sentry.ts` into `src/lib/sentry-filter.ts`.

### Interface Suggestions

- None needed.

### Dependency Direction

- ✅ Zero project dependencies.

### Duplication

- `beforeSend` filter pattern duplicates `electron/main/sentry.ts` exactly (same ignored messages, same rate logic).

### Constants/Magic Values

- `'ResizeObserver'`, `'Non-Error exception captured'`, `'Script error.'`, `1.0`, `0.1`.

---

## `src/lib/electron-mock.ts`

### Current Layer Mix

- `ElectronAPI` mock implementation for browser development — well-separated.

### Extraction Opportunities

- Make mock data configurable (e.g., `injectElectronMock({ apiKeys: ['sk-test'] })`).
- Add `emitMockEvent(channel, data)` for simulating IPC events in tests.

### Interface Suggestions

- `ElectronMockConfig` interface: `{ apiKeys?: ApiKeyInfo[], appVersion?: string, emitEvent?: (channel, data) => void }`.

### Dependency Direction

- ✅ Depends only on `ElectronAPI` type from `ipc.ts`.

### Duplication

- All method implementations return empty/success defaults — intentional.
- `on()` listener registration pattern mirrors real preload but simplified.

### Constants/Magic Values

- `'mock-id'`, `'sk-****'`, `'mock-key'`, `'0.0.0'`.
