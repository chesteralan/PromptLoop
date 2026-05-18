# Stores Refactor Rules

Files: `src/store/index.ts`, `src/store/workflowStore.ts`, `src/store/settingsStore.ts`, `src/store/executionStore.ts`

## Assessment

All store files are well-structured and compliant with Frontend Refactor Standards.

### Standards Compliance

- **4 (State Management):** Zustand stores with local-first state, derived state not duplicated ✓
- **6 (TypeScript Standards):** Properly typed interfaces for all store shapes ✓
- **8 (File Naming):** camelCase.ts as convention ✓
- **17 (Code Smells):** No duplicate logic, no magic strings, no dead code ✓

### Notes

- `workflowStore.ts:11-12` — `workflowStore` is used but may be partially redundant with react-query (server state). Currently it caches workflow data fetched via `useWorkflowSnapshot`. Evaluate whether react-query's cache can replace this entirely.
- `executionStore.ts:44-58` — Clean store with `resetExecution()` using `initialState` pattern. The `recentLogs` cap at 100 is good.
- `settingsStore.ts:28-56` — Uses `zustand/middleware` persist with `partialize` to exclude `user` from persistence (good security practice).

### No High-Priority Refactors Needed

- **Priority:** Low — only consider consolidation with react-query
