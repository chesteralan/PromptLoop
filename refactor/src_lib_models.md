# Refactoring Rules: `src/lib/models.ts`

## Purpose

Defines the available AI models (OpenAI, Anthropic, Google) with their IDs, names, max token limits, and provider labels.

## Current Issues

1. **`MODELS` array** duplicates the same model lists from `electron/main/providers/openai.ts`, `anthropic.ts`, `google.ts` — these should be defined in one place
2. **`PROVIDER_LABELS`** is a simple record — fine
3. **No `cost` information** included — the electron providers have rate tables, but the renderer doesn't have access to cost estimation
4. **No `supportsStreaming`** field — all listed models support streaming, but if non-streaming models are added later, this needs tracking
5. **Models are hardcoded** — could be fetched from a remote source or generated from provider adapters

## Refactoring Rules

1. **Move model definitions to shared location** — either `electron/shared/types.ts` or a new `shared/models.ts`
2. **Import model definitions from electron** with a barrel export
3. **Add `costPer1kTokens`** or similar for frontend cost display
4. **Add `isStreamable`** field for future non-streaming model support
5. **Add `releaseDate` or `deprecated`** flag for model lifecycle management
6. **Add validation** — ensure no duplicate model IDs

## Dependencies

- None (standalone data file)
- Used by: `../components/workflow/ModelSelector`

## Verification

- `npm run lint`
- `npm run typecheck`
- Verify model list matches provider capabilities
- Test model selector renders all models
