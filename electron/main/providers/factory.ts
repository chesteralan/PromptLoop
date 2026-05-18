import type { ProviderAdapter } from './interface'
import { OpenAIAdapter } from './openai'
import { AnthropicAdapter } from './anthropic'
import { GoogleAdapter } from './google'

type ModelMatcher = (modelId: string) => boolean

interface AdapterEntry {
  name: string
  matcher: ModelMatcher
  adapter: ProviderAdapter
}

const registered: AdapterEntry[] = [
  {
    name: 'openai',
    matcher: (id) => id.startsWith('gpt') || id.startsWith('o'),
    adapter: new OpenAIAdapter(),
  },
  { name: 'anthropic', matcher: (id) => id.startsWith('claude'), adapter: new AnthropicAdapter() },
  { name: 'google', matcher: (id) => id.startsWith('gemini'), adapter: new GoogleAdapter() },
]

export function getProviderAdapter(modelId: string): ProviderAdapter | null {
  const entry = registered.find((e) => e.matcher(modelId))
  return entry?.adapter ?? null
}

export function getProviderName(modelId: string): string | null {
  const entry = registered.find((e) => e.matcher(modelId))
  return entry?.name ?? null
}

export function getAllAdapters(): ProviderAdapter[] {
  return registered.map((e) => e.adapter)
}
