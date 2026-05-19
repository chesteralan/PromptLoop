export const KEY_PREFIXES: Record<string, RegExp> = {
  openai: /^sk-/,
  anthropic: /^sk-ant-/,
  google: /^AIza/,
}

export const KEY_FORMAT_HINTS: Record<string, string> = {
  openai: 'sk-...',
  anthropic: 'sk-ant-...',
  google: 'AIza...',
}

export function validateApiKeyInput(
  provider: string,
  key: string,
): { valid: boolean; error?: string } {
  const trimmed = key.trim()
  if (!trimmed) return { valid: false, error: 'API key is required' }
  const pattern = KEY_PREFIXES[provider]
  if (pattern && !pattern.test(trimmed)) {
    return {
      valid: false,
      error: `Invalid key format for ${provider}. Expected format: ${KEY_FORMAT_HINTS[provider] ?? 'unknown'}`,
    }
  }
  return { valid: true }
}
