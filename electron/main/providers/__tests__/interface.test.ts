import { describe, it, expect } from 'vitest'
import type { ProviderAdapter, StreamOptions, ModelInfo } from '../interface'

describe('provider interface', () => {
  it('type-check all definitions at compile time', () => {
    const adapter: ProviderAdapter = null as unknown as ProviderAdapter
    const opts: StreamOptions = {
      apiKey: 'key',
      model: 'gpt-4o',
      systemPrompt: 'sys',
      temperature: 0.5,
      maxTokens: 100,
      signal: new AbortController().signal,
    }
    const model: ModelInfo = { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128_000 }
    expect(adapter).toBeDefined()
    expect(opts).toBeDefined()
    expect(model).toBeDefined()
  })
})
