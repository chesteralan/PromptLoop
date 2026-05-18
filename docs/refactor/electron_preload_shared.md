# Electron Preload & Shared Refactor Rules

Files: `electron/preload/index.ts`, `electron/shared/types.ts`

## Standards Violated

### 6 — TypeScript Standards (unsafe casts)

- **Specific issues:**
  - `preload/index.ts:20-21` — `startWorkflow` accepts `config?: unknown`, forcing consumers to cast
  - `preload/index.ts:59-60` — `rest.id as string` and `rest.keyPrefix as string` after already checking truthiness (redundant casts)
  - `preload/index.ts:68` — `rest.key as string` after truthy check
  - `preload/index.ts:86-87` — `showSaveDialog` and `showOpenDialog` accept `options: unknown`
- **Fix:** Type the IPC payloads with specific interfaces instead of `unknown`; remove redundant casts after truthy checks
- **Priority:** Medium

### 17 — Code Smells to Eliminate (duplicate pattern)

- **Specific issues:**
  - `preload/index.ts:26-53` — Four nearly identical `onExecution*` / `onWorkflowCompleted` listener wrappers (spread pattern, handler creation, cleanup function)
- **Fix:** Extract a `createIpcListener<T>(channel, callback)` helper function
- **Priority:** Medium

### 9 — Import Rules

- **Specific issues:**
  - `preload/index.ts` — Imports are grouped correctly (1. Electron, 2. Internal types)
- **Fix:** None — already compliant
- **Priority:** None

### 18 — Documentation

- **Specific issues:**
  - `shared/types.ts` — Types are well-named and self-documenting
- **Fix:** None — clean file
- **Priority:** None
