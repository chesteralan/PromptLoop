# Abstraction Rules: Electron Providers

**Files:** `electron/main/providers/interface.ts`, `factory.ts`, `openai.ts`, `anthropic.ts`, `google.ts`

---

## `electron/main/providers/interface.ts`

### Current Layer Mix

- Pure interface definitions — well-separated.

### Extraction Opportunities

- Add `ModelInfo` to `electron/shared/types.ts` for shared use with `src/lib/models.ts`.
- Consider adding a `ProviderCapabilities` interface (e.g., `supportsStreaming`, `supportsSystemPrompt`, `maxBatchSize`).

### Interface Suggestions

- `ProviderAdapter` is clean. Consider adding `dispose(): void` for cleanup.
- `StreamOptions` could extend `RequestInit` for custom HTTP headers.

### Dependency Direction

- ✅ Pure types, zero dependencies.

### Duplication

- `ModelInfo` interface duplicated in `src/lib/models.ts` with added `provider` field — reconcile into shared location.

### Constants/Magic Values

- None.

---

## `electron/main/providers/factory.ts`

### Current Layer Mix

- Adapter registration coupled with model ID matching logic.

### Extraction Opportunities

- Extract `ModelMatcher` type and `AdapterEntry` config into a `provider-registry.ts`.
- Make `registered` array injectable for testing (currently hardcoded module-level).

### Interface Suggestions

- `ProviderRegistry` interface: `register(name, matcher, adapter): void`, `getAdapter(modelId): ProviderAdapter | null`, `getAllAdapters(): ProviderAdapter[]`.
- Allow dynamic provider registration at runtime.

### Dependency Direction

- ✅ Depends only on `interface.ts` and provider implementations.

### Duplication

- `getProviderInfo` / `getProviderAdapter` / `getProviderName` all do similar lookup — could unify.

### Constants/Magic Values

- `'openai'`, `'anthropic'`, `'google'` (strings), `'gpt'`, `'o'`, `'claude'`, `'gemini'` (prefix matchers).

---

## `electron/main/providers/openai.ts`

### Current Layer Mix

- Model definitions (`MODELS`), API ID mapping (`MODEL_TO_API`), cost rates, streaming implementation, API key validation, and cost estimation all in one class.

### Extraction Opportunities

- Extract cost rates into `openai-costs.ts`.
- Extract model definitions into shared config (`src/lib/models.ts`).
- Extract `validateApiKey` logic into shared `provider-utils.ts` — the pattern is identical across providers.

### Interface Suggestions

- `CostCalculator` interface: `estimateCost(modelId, tokensIn, tokensOut): number`.

### Dependency Direction

- ✅ Depends only on `interface.ts` and `ai`/`@ai-sdk/openai`.

### Duplication

- `validateApiKey` pattern (streamText with one token, await reader) duplicated across all 3 providers.
- `stream()` method structure identical across providers.
- `MODEL_TO_API` maps are repetitive — could use a generic mapping utility.

### Constants/Magic Values

- Hardcoded model lists, cost rates (`[2.5, 10]` etc.), `temperature: 1`, `maxTokens: 1024`.

---

## `electron/main/providers/anthropic.ts`

### Current Layer Mix

- Same pattern as `openai.ts` — model defs, API IDs, cost rates, streaming, validation.

### Extraction Opportunities

- Same as `openai.ts` — extract costs to `anthropic-costs.ts`, share validation pattern.

### Interface Suggestions

- Same as `openai.ts`.

### Dependency Direction

- ✅ Depends only on `interface.ts` and `ai`/`@ai-sdk/anthropic`.

### Duplication

- `validateApiKey` identical pattern to `openai.ts` and `google.ts`.
- `stream()` implementation nearly identical.
- `estimateCost()` formula identical.

### Constants/Magic Values

- API model IDs (`'claude-3-5-sonnet-20241022'` etc.), cost rates (`[3, 15]` etc.).

---

## `electron/main/providers/google.ts`

### Current Layer Mix

- Same pattern as `openai.ts` and `anthropic.ts`.

### Extraction Opportunities

- Same as other providers — extract costs, share validation.

### Interface Suggestions

- Same as other providers.

### Dependency Direction

- ✅ Depends only on `interface.ts` and `ai`/`@ai-sdk/google`.

### Duplication

- **High duplication across all 3 providers.** The `stream()`, `validateApiKey()`, and `estimateCost()` methods follow identical patterns.
- Consider a base class `BaseProviderAdapter` that implements shared logic, with provider-specific overrides for model list, API mapping, and cost rates.

### Constants/Magic Values

- `maxTokens: 8192` (differs from other providers' 1024), `'gemini-2.0-flash'` etc.
