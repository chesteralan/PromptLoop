export const PROVIDERS = ['openai', 'anthropic', 'google'] as const
export type Provider = (typeof PROVIDERS)[number]

export const PROVIDER_LABELS: Record<Provider, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
}

export const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  anthropic: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  google: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

export function capitalizeProvider(provider: string): string {
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}
