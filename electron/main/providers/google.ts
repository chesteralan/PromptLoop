import type { ProviderAdapter } from './interface'

export class GoogleAdapter implements ProviderAdapter {
  async stream(
    _prompt: string,
    _options: { apiKey: string; temperature: number; maxTokens: number; signal?: AbortSignal },
  ): Promise<AsyncIterable<string>> {
    throw new Error('Not implemented')
  }

  models() {
    return [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    ]
  }
}
