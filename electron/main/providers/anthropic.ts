import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { ProviderAdapter, StreamOptions, ModelInfo } from './interface'

const MODELS: ModelInfo[] = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200_000 },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', maxTokens: 200_000 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', maxTokens: 200_000 },
]

const MODEL_TO_API: Record<string, string> = {
  'claude-3-5-sonnet': 'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku': 'claude-3-5-haiku-20241022',
  'claude-3-opus': 'claude-3-opus-20240229',
}

const RATES: Record<string, [number, number]> = {
  'claude-3-5-sonnet': [3, 15],
  'claude-3-5-haiku': [0.8, 4],
  'claude-3-opus': [15, 75],
}

export class AnthropicAdapter implements ProviderAdapter {
  stream(prompt: string, options: StreamOptions): AsyncIterable<string> {
    const modelId = MODEL_TO_API[options.model] ?? options.model
    const result = streamText({
      model: anthropic(modelId),
      prompt,
      system: options.systemPrompt,
      temperature: options.temperature ?? 1,
      maxOutputTokens: options.maxTokens ?? 1024,
      abortSignal: options.signal,
    })
    return result.textStream
  }

  models(): ModelInfo[] {
    return MODELS
  }

  async validateApiKey(_apiKey: string): Promise<boolean> {
    try {
      const result = streamText({
        model: anthropic('claude-3-5-haiku-20241022'),
        prompt: 'test',
        maxOutputTokens: 1,
      })
      const reader = result.textStream[Symbol.asyncIterator]()
      await reader.next()
      return true
    } catch {
      return false
    }
  }

  estimateCost(modelId: string, tokensIn: number, tokensOut: number): number {
    const rate = RATES[modelId] ?? [3, 15]
    return (tokensIn * rate[0] + tokensOut * rate[1]) / 1_000_000
  }
}
