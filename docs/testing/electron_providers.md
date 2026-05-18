# Electron Providers — Testing Rules

## 1. `electron/main/providers/interface.ts`

- **Test type:** Unit (type-only)
- **Key scenarios:**
  - `ProviderAdapter` interface contract: `stream()`, `models()`, `validateApiKey()`, `estimateCost()` all present
  - `StreamOptions` includes all optional fields
  - `ModelInfo` has id, name, maxTokens
- **Mocking requirements:** None (interface)
- **Coverage targets:** N/A
- **Suggested test file location:** `electron/main/providers/__tests__/interface.test.ts`

## 2. `electron/main/providers/factory.ts`

- **Test type:** Unit
- **Key scenarios:**
  - `getProviderInfo()` returns null for unknown model; returns correct adapter+name for known prefixes (`gpt`, `o`, `claude`, `gemini`)
  - `getProviderAdapter()` returns adapter or null; delegates to `getProviderInfo()`
  - `getProviderName()` returns name or null; delegates to `getProviderInfo()`
  - `getAllAdapters()` returns all 3 registered adapters
  - Matcher for `gpt-*` and `o*` maps to OpenAI
  - Matcher for `claude-*` maps to Anthropic
  - Matcher for `gemini-*` maps to Google
- **Mocking requirements:** `OpenAIAdapter`, `AnthropicAdapter`, `GoogleAdapter` constructors
- **Coverage targets:** All 3 provider matchers; unknown model path
- **Suggested test file location:** `electron/main/providers/__tests__/factory.test.ts`

## 3. `electron/main/providers/openai.ts`

- **Test type:** Unit / Integration
- **Key scenarios:**
  - `stream()` calls `streamText()` with correct model mapping (`MODEL_TO_API`); passes through unknown model IDs; passes `options.apiKey` (consumed by `openai()` provider), `systemPrompt`, `temperature` (default 1), `maxTokens` (default 1024), `abortSignal`; returns `result.textStream`
  - `models()` returns the 5 hardcoded GPT model entries
  - `validateApiKey()` calls `streamText` with gpt-4o-mini and 1 token; returns true if first chunk received; returns false on exception
  - `estimateCost()` uses correct per-model rates ($/1M tokens); falls back to gpt-4o rates for unknown models
- **Mocking requirements:** `streamText` from `ai`; `openai` from `@ai-sdk/openai`
- **Coverage targets:** All 5 model rate entries, unknown model fallback, validateApiKey success/failure
- **Suggested test file location:** `electron/main/providers/__tests__/openai.test.ts`

## 4. `electron/main/providers/anthropic.ts`

- **Test type:** Unit / Integration
- **Key scenarios:**
  - `stream()` calls `streamText()` with correct model mapping (`MODEL_TO_API`); passes through unknown model IDs; default temperature 1, maxTokens 1024
  - `models()` returns the 3 hardcoded Claude model entries
  - `validateApiKey()` calls `streamText` with claude-3-5-haiku
  - `estimateCost()` uses correct per-model rates; falls back to claude-3-5-sonnet rates
- **Mocking requirements:** `streamText` from `ai`; `anthropic` from `@ai-sdk/anthropic`
- **Coverage targets:** All 3 model rate entries, unknown model fallback, validateApiKey success/failure
- **Suggested test file location:** `electron/main/providers/__tests__/anthropic.test.ts`

## 5. `electron/main/providers/google.ts`

- **Test type:** Unit / Integration
- **Key scenarios:**
  - `stream()` calls `streamText()` with correct model mapping; default maxTokens 8192 (differs from OpenAI/Anthropic default 1024)
  - `models()` returns the 3 hardcoded Gemini model entries
  - `validateApiKey()` calls `streamText` with gemini-2.0-flash
  - `estimateCost()` uses correct per-model rates; falls back to gemini-2.0-flash rates
- **Mocking requirements:** `streamText` from `ai`; `google` from `@ai-sdk/google`
- **Coverage targets:** All 3 model rate entries, unknown model fallback, validateApiKey success/failure
- **Suggested test file location:** `electron/main/providers/__tests__/google.test.ts`

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
