# Refactoring Rules: `electron/main/providers/`

## Purpose

Provides LLM provider abstractions (OpenAI, Anthropic, Google) through a common `ProviderAdapter` interface and factory pattern.

## Current Issues

### interface.ts

- `stream()` returns `Promise<AsyncIterable<string>>` — wrapping `AsyncIterable` in a Promise is redundant since `AsyncIterable` already supports `for await`. The `streamText()` from the `ai` SDK returns `result.textStream` which is already `AsyncIterable<string>`. The provider implementations wrap this in `Promise.resolve()` implicitly.

### factory.ts

- `AdapterEntry` stores instances of adapters eagerly — adapters are stateless so this is fine, but `OpenAIAdapter`, `AnthropicAdapter`, `GoogleAdapter` are imported and instantiated even if never used
- `getAllAdapters()` returns adapter instances directly — callers could mutate adapter state if any were stateful (currently none are)
- Model matching logic duplicates between `getProviderAdapter` and `getProviderName` — could return both from single lookup

### openai.ts, anthropic.ts, google.ts

- **Three files with near-identical structure** — `stream()`, `models()`, `validateApiKey()`, `estimateCost()` all follow the same pattern
- `validateApiKey()` in all three providers makes a real API call with `maxOutputTokens: 1` but never checks the response content — it only checks that the stream doesn't throw. This works but wastes tokens and time
- `estimateCost()` uses hardcoded rate tables that may be outdated — add a comment or fetch from API
- `MODEL_TO_API` mapping in each file is 1:1 for most models — only needed when API model IDs differ from display IDs
- `RATES` in Anthropic and Google use `[number, number]` tuples but input/output rate order is implicit — add named fields or comments
- `stream()` in all three uses `async` function but doesn't `await` anything — the `streamText()` call returns immediately with a result object, and the actual streaming happens when the caller iterates. The `async` keyword is unnecessary

## Refactoring Rules

1. **Create a base provider class** or factory function to eliminate duplication between `openai.ts`, `anthropic.ts`, `google.ts`
2. **Extract rate configuration** into a shared config file (`providers/rates.ts`) with per-provider cost tables
3. **Remove unnecessary `async`** from `stream()` methods (return `streamText(...).textStream` directly)
4. **Consolidate `getProviderAdapter` and `getProviderName`** into single lookup returning `{ name, adapter }`
5. **Lazy-load adapters** in factory using dynamic imports or a registry pattern for tree-shaking
6. **Replace magic number rates** with named constants (`INPUT_COST_PER_1M`, `OUTPUT_COST_PER_1M`)
7. **Add model-specific `maxTokens` clamping** in `stream()` to respect model limits

## Dependencies

- `interface.ts`: none
- `factory.ts`: imports all adapter modules
- `openai.ts`: `ai`, `@ai-sdk/openai`
- `anthropic.ts`: `ai`, `@ai-sdk/anthropic`
- `google.ts`: `ai`, `@ai-sdk/google`
- Used by: `../engine/runner.ts`, `../engine/retry.ts`

## Verification

- `npm run typecheck` (electron)
- Unit tests for `validateApiKey` with mock HTTP
- Verify streaming works for all three providers
- Verify cost estimation returns correct values
