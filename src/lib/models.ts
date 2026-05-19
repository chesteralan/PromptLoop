import { PROVIDER_LABELS } from './provider-config'

export interface ModelInfo {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google'
  maxTokens: number
}

export const MODELS: ModelInfo[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 128_000 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', maxTokens: 128_000 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 128_000 },
  { id: 'gpt-4', name: 'GPT-4', provider: 'openai', maxTokens: 8_192 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 16_384 },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', maxTokens: 200_000 },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'anthropic', maxTokens: 200_000 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', maxTokens: 200_000 },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', maxTokens: 1_048_576 },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', maxTokens: 2_097_152 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', maxTokens: 1_048_576 },
]

export { PROVIDER_LABELS }
