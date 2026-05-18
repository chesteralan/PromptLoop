import type { ProviderAdapter } from './interface'

export class OpenAIAdapter implements ProviderAdapter {
  async stream(
    _prompt: string,
    _options: { apiKey: string; temperature: number; maxTokens: number; signal?: AbortSignal },
  ): Promise<AsyncIterable<string>> {
    // TODO: Implement OpenAI streaming
    throw new Error('Not implemented')
  }

  models() {
    return [
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ]
  }
}
