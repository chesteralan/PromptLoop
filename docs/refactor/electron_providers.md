# Electron Providers Refactor Rules

Files: `electron/main/providers/interface.ts`, `electron/main/providers/factory.ts`, `electron/main/providers/openai.ts`, `electron/main/providers/anthropic.ts`, `electron/main/providers/google.ts`

## Standards Violated

### 17 — Code Smells to Eliminate (duplicate logic)

- **Specific issues:**
  - `openai.ts`, `anthropic.ts`, `google.ts` — Nearly identical structure across all 3 adapters:
    - Same `stream()` implementation pattern (MODEL_TO_API lookup → streamText → return textStream)
    - Same `validateApiKey()` structure (streamText, read first chunk, return true/catch false)
    - Same `estimateCost()` structure (rates lookup, division by 1,000,000)
    - Same `MODELS`, `MODEL_TO_API`, `RATES` declaration pattern
  - `factory.ts:14-22` — Adapter registry with inline matchers duplicates registration pattern
- **Fix:** Extract a base provider class or factory function that takes provider-specific config (models, rates, API mapping). Each adapter becomes a config object rather than a class.
- **Priority:** High

### 6 — TypeScript Standards

- **Specific issues:**
  - `openai.ts:56` — `Record<string, [number, number]>` for rates — should use typed model keys
- **Fix:** Use mapped type from ModelInfo or const assertion
- **Priority:** Low

### 10 — API & Data Fetching

- **Specific issues:**
  - `validateApiKey` in all 3 adapters — creates a real API call to validate; no cache/coalescing
  - All three adapters ignore `_apiKey` parameter in `validateApiKey` (OpenAI, Anthropic, Google SDK handles it internally)
- **Fix:** Add key validation result caching; document why `_apiKey` is unused
- **Priority:** Low
