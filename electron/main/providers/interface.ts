export interface StreamOptions {
  apiKey: string
  model: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
}

export interface ModelInfo {
  id: string
  name: string
  maxTokens: number
}

export interface ProviderAdapter {
  stream(prompt: string, options: StreamOptions): Promise<AsyncIterable<string>>
  models(): ModelInfo[]
  validateApiKey(apiKey: string): Promise<boolean>
  estimateCost(modelId: string, tokensIn: number, tokensOut: number): number
}
