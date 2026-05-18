# Lib Utilities Refactor Rules

Files: `src/lib/utils.ts`, `src/lib/firebase.ts`, `src/lib/ipc.ts`, `src/lib/converters.ts`, `src/lib/models.ts`, `src/lib/electron-mock.ts`, `src/lib/sentry.ts`

## Standards Violated

### 17 — Code Smells to Eliminate (duplicate converter pattern)

- **Specific issues:**
  - `converters.ts:71-165` — Four nearly identical Firestore converters (`workflowConverter`, `promptConverter`, `executionConverter`, `apiKeyConverter`). Each has:
    - Same `toFirestore` / `fromFirestore` boilerplate
    - Same `ts()` / `fromTS()` / `optTS()` helper usage
    - Same `as WorkflowData` / `as PromptData` type assertions in `fromFirestore`
  - `converters.ts:56-69` — Helper functions `ts()`, `fromTS()`, `optTS()` defined once (good), but each converter still duplicates the call pattern
- **Fix:** Create a `createConverter<T>()` factory function that accepts field mappings for Date serialization, eliminating the boilerplate
- **Priority:** High

### 6 — TypeScript Standards

- **Specific issues:**
  - `converters.ts:82-88` — `as WorkflowData` type assertion in `fromFirestore`; same pattern at lines 115, 142, 162
  - `converters.ts:60` — `fromTS(v: unknown): Date` — accepts `unknown` and returns `new Date()` as fallback (masking errors)
- **Fix:** Use proper runtime validation (zod schema or explicit field mapping) instead of `as` casts; narrow `fromTS` parameter type
- **Priority:** Medium

### 11 — Error Handling

- **Specific issues:**
  - `electron-mock.ts:14` — `injectElectronMock` returns void; `try/catch` in `main.tsx:12-16` swallows failure silently (console.warn only)
  - `electron-mock.ts` — Mock silently returns empty/success values, masking real Electron API failures in dev
- **Fix:** Add an `isMocked` export for dev environment awareness; log warnings when mock is active
- **Priority:** Low

### Clean Files

- `utils.ts` — Clean (cn utility)
- `firebase.ts` — Clean
- `ipc.ts` — Clean (type declarations only)
- `models.ts` — Clean
- `sentry.ts` — Clean
