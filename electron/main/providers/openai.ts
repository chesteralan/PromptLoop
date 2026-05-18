import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { ProviderAdapter, StreamOptions, ModelInfo } from './interface'

const MODELS: ModelInfo[] = [
  { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128_000 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128_000 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128_000 },
  { id: 'gpt-4', name: 'GPT-4', maxTokens: 8_192 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16_384 },
]

const MODEL_TO_API: Record<string, string> = {
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4-turbo': 'gpt-4-turbo',
  'gpt-4': 'gpt-4',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
}

export class OpenAIAdapter implements ProviderAdapter {
  async stream(prompt: string, options: StreamOptions): Promise<AsyncIterable<string>> {
    const modelId = MODEL_TO_API[options.model] ?? options.model
    const result = streamText({
      model: openai(modelId),
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
        model: openai('gpt-4o-mini'),
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
    const rates: Record<string, [number, number]> = {
      'gpt-4o': [2.5, 10],
      'gpt-4o-mini': [0.15, 0.6],
      'gpt-4-turbo': [10, 30],
      'gpt-4': [30, 60],
      'gpt-3.5-turbo': [0.5, 1.5],
    }
    const [inputRate, outputRate] = rates[modelId] ?? [2.5, 10]
    return (tokensIn * inputRate + tokensOut * outputRate) / 1_000_000
  }
}
