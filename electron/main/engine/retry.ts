export type ErrorCategory =
  | 'rate_limit'
  | 'auth'
  | 'server_error'
  | 'timeout'
  | 'network'
  | 'unknown'

export interface ErrorClassification {
  category: ErrorCategory
  recoverable: boolean
  retryable: boolean
  message: string
  userMessage: string
  retryAfterMs?: number
}

function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as { statusCode: number }).statusCode
  }
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: unknown }).status
    if (typeof status === 'number') return status
  }
  return null
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function getRetryAfter(error: unknown): number | undefined {
  const val = (error as Record<string, unknown>)['retryAfter']
  if (typeof val === 'number') return val * 1000
  if (typeof val === 'string') return parseInt(val, 10) * 1000
  return undefined
}

export function classifyError(error: unknown): ErrorClassification {
  const message = getErrorMessage(error)
  const status = getErrorStatus(error)
  const retryAfterMs = getRetryAfter(error)

  const isOpenAI = message.includes('openai') || message.includes('OpenAI')
  const isAnthropic = message.includes('anthropic') || message.includes('Anthropic')
  const isGoogle = message.includes('google') || message.includes('Google')

  if (status === 429 || message.toLowerCase().includes('rate limit')) {
    return {
      category: 'rate_limit',
      recoverable: true,
      retryable: true,
      message,
      userMessage: `${isOpenAI ? 'OpenAI' : isAnthropic ? 'Anthropic' : isGoogle ? 'Google' : 'Provider'} rate limit reached. Retrying...`,
      retryAfterMs,
    }
  }

  if (
    status === 401 ||
    status === 403 ||
    message.toLowerCase().includes('api key') ||
    message.toLowerCase().includes('unauthorized') ||
    message.toLowerCase().includes('invalid key')
  ) {
    const provider = isOpenAI
      ? 'OpenAI'
      : isAnthropic
        ? 'Anthropic'
        : isGoogle
          ? 'Google'
          : 'Provider'
    return {
      category: 'auth',
      recoverable: true,
      retryable: false,
      message,
      userMessage: `Invalid ${provider} API key. Go to Settings > API Keys to update your key.`,
    }
  }

  if (status !== null && status >= 500) {
    return {
      category: 'server_error',
      recoverable: true,
      retryable: true,
      message,
      userMessage: 'Provider server error. Retrying...',
    }
  }

  if (
    message.toLowerCase().includes('timeout') ||
    message.toLowerCase().includes('timed out') ||
    message.toLowerCase().includes('abort')
  ) {
    return {
      category: 'timeout',
      recoverable: true,
      retryable: true,
      message,
      userMessage: 'Request timed out. Retrying...',
    }
  }

  if (
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('econnrefused') ||
    message.toLowerCase().includes('enotfound') ||
    message.toLowerCase().includes('fetch failed')
  ) {
    return {
      category: 'network',
      recoverable: true,
      retryable: true,
      message,
      userMessage: 'Network error. Check your connection and retry.',
    }
  }

  return {
    category: 'unknown',
    recoverable: false,
    retryable: true,
    message,
    userMessage: `Unexpected error: ${message}`,
  }
}

export interface RetryOptions {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  onRetry?: (attempt: number, classification: ErrorClassification) => void,
): Promise<T> {
  const options: RetryOptions = {
    maxRetries,
    baseDelayMs: 1000,
    maxDelayMs: 60_000,
  }

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const classification = classifyError(error)

      if (attempt === options.maxRetries || !classification.retryable) {
        throw error
      }

      const backoffMs = Math.min(
        options.baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000,
        options.maxDelayMs,
      )
      const waitMs = classification.retryAfterMs ?? backoffMs

      onRetry?.(attempt, classification)
      await delay(waitMs)
    }
  }

  throw new Error('All retries exhausted')
}
