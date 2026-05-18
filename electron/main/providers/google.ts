import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import type { ProviderAdapter, StreamOptions, ModelInfo } from './interface'

const MODELS: ModelInfo[] = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', maxTokens: 1_048_576 },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 2_097_152 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1_048_576 },
]

const MODEL_TO_API: Record<string, string> = {
  'gemini-2.0-flash': 'gemini-2.0-flash',
  'gemini-1.5-pro': 'gemini-1.5-pro',
  'gemini-1.5-flash': 'gemini-1.5-flash',
}

const RATES: Record<string, [number, number]> = {
  'gemini-2.0-flash': [0.1, 0.4],
  'gemini-1.5-pro': [1.25, 5],
  'gemini-1.5-flash': [0.075, 0.3],
}

export class GoogleAdapter implements ProviderAdapter {
  async stream(prompt: string, options: StreamOptions): Promise<AsyncIterable<string>> {
    const modelId = MODEL_TO_API[options.model] ?? options.model
    const result = streamText({
      model: google(modelId),
      prompt,
      system: options.systemPrompt,
      temperature: options.temperature ?? 1,
      maxOutputTokens: options.maxTokens ?? 8192,
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
        model: google('gemini-2.0-flash'),
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
    const rate = RATES[modelId] ?? [0.1, 0.4]
    return (tokensIn * rate[0] + tokensOut * rate[1]) / 1_000_000
  }
}
