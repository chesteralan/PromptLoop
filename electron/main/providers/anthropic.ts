import type { ProviderAdapter } from './interface'

export class AnthropicAdapter implements ProviderAdapter {
  async stream(
    _prompt: string,
    _options: { apiKey: string; temperature: number; maxTokens: number; signal?: AbortSignal },
  ): Promise<AsyncIterable<string>> {
    throw new Error('Not implemented')
  }

  models() {
    return [
      { id: 'claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
    ]
  }
}
