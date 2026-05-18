export interface ProviderAdapter {
  stream(
    prompt: string,
    options: {
      apiKey: string
      temperature: number
      maxTokens: number
      signal?: AbortSignal
    },
  ): Promise<AsyncIterable<string>>

  models(): { id: string; name: string }[]
}
