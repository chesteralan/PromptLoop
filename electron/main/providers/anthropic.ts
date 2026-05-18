import type { ProviderAdapter, StreamOptions, ModelInfo } from './interface'

const MODELS: ModelInfo[] = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200_000 },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', maxTokens: 200_000 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', maxTokens: 200_000 },
]

export class AnthropicAdapter implements ProviderAdapter {
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
