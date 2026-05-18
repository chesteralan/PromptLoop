import type { ProviderAdapter, StreamOptions, ModelInfo } from './interface'

const MODELS: ModelInfo[] = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', maxTokens: 1_048_576 },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 2_097_152 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1_048_576 },
]

export class GoogleAdapter implements ProviderAdapter {
  async stream(_prompt: string, _options: StreamOptions): Promise<AsyncIterable<string>> {
    throw new Error('Not implemented')
  }

  models(): ModelInfo[] {
    return MODELS
  }

  async validateApiKey(_apiKey: string): Promise<boolean> {
    return false
  }

  estimateCost(_modelId: string, _tokensIn: number, _tokensOut: number): number {
    return 0
  }
}
