import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { classifyError, executeWithRetry } from '../retry'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('classifyError', () => {
  it('rate_limit from status 429', () => {
    const result = classifyError(Object.assign(new Error('Too many requests'), { statusCode: 429 }))
    expect(result.category).toBe('rate_limit')
    expect(result.action).toBe('retry')
  })

  it('rate_limit from message', () => {
    const result = classifyError(new Error('Rate limit exceeded'))
    expect(result.category).toBe('rate_limit')
    expect(result.action).toBe('retry')
  })

  it('rate_limit detects provider OpenAI', () => {
    const result = classifyError(Object.assign(new Error('OpenAI rate limit'), { statusCode: 429 }))
    expect(result.userMessage).toContain('OpenAI')
  })

  it('rate_limit detects provider Anthropic', () => {
    const result = classifyError(
      Object.assign(new Error('anthropic rate limit'), { statusCode: 429 }),
    )
    expect(result.userMessage).toContain('Anthropic')
  })

  it('auth from status 401', () => {
    const result = classifyError(Object.assign(new Error('unauthorized'), { statusCode: 401 }))
    expect(result.category).toBe('auth')
    expect(result.action).toBe('stop')
  })

  it('auth from status 403', () => {
    const result = classifyError(Object.assign(new Error('forbidden'), { statusCode: 403 }))
    expect(result.category).toBe('auth')
    expect(result.action).toBe('stop')
  })

  it('auth from API key message', () => {
    const result = classifyError(new Error('Invalid API key provided'))
    expect(result.category).toBe('auth')
    expect(result.action).toBe('stop')
  })

  it('auth user message includes provider name', () => {
    const result = classifyError(new Error('OpenAI API key error'))
    expect(result.userMessage).toContain('OpenAI')
  })

  it('server_error from 5xx', () => {
    const result = classifyError(Object.assign(new Error('Internal error'), { statusCode: 500 }))
    expect(result.category).toBe('server_error')
    expect(result.action).toBe('retry')
  })

  it('timeout from message', () => {
    const result = classifyError(new Error('Request timed out'))
    expect(result.category).toBe('timeout')
    expect(result.action).toBe('retry')
  })

  it('timeout from abort', () => {
    const result = classifyError(new Error('The user aborted a request'))
    expect(result.category).toBe('timeout')
  })

  it('network from econnrefused', () => {
    const result = classifyError(new Error('ECONNREFUSED'))
    expect(result.category).toBe('network')
    expect(result.action).toBe('retry')
  })

  it('network from fetch failed', () => {
    const result = classifyError(new Error('fetch failed'))
    expect(result.category).toBe('network')
  })

  it('unknown for unrecognized errors', () => {
    const result = classifyError(new Error('Something weird happened'))
    expect(result.category).toBe('unknown')
    expect(result.action).toBe('retry')
  })

  it('respects retryAfter from error object', () => {
    const result = classifyError(
      Object.assign(new Error('rate limit'), { statusCode: 429, retryAfter: 15 }),
    )
    expect(result.retryAfterMs).toBe(15000)
  })
})

describe('executeWithRetry', () => {
  it('succeeds on first try', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await executeWithRetry(fn)
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and succeeds', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('server error')).mockResolvedValueOnce('ok')

    const promise = executeWithRetry(fn, { maxRetries: 2, baseDelayMs: 100 })
    await vi.advanceTimersToNextTimerAsync()
    const result = await promise
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('throws after exhausting retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'))
    const promise = executeWithRetry(fn, { maxRetries: 2, baseDelayMs: 100 }).catch((e) => e)
    await vi.advanceTimersToNextTimerAsync()
    const err = await promise
    expect(err.message).toBe('always fails')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('throws immediately for auth errors', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Invalid API key'))
    await expect(executeWithRetry(fn)).rejects.toThrow('Invalid API key')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('calls onRetry callback on each retry', async () => {
    const serverErr = Object.assign(new Error('server error'), { statusCode: 500 })
    const fn = vi
      .fn()
      .mockRejectedValueOnce(serverErr)
      .mockRejectedValueOnce(serverErr)
      .mockResolvedValueOnce('ok')
    const onRetry = vi.fn()

    const promise = executeWithRetry(fn, { maxRetries: 3, baseDelayMs: 10 }, onRetry)
    await vi.advanceTimersToNextTimerAsync()
    await vi.advanceTimersToNextTimerAsync()
    await promise
    expect(onRetry).toHaveBeenCalledTimes(2)
    expect(onRetry).toHaveBeenCalledWith(1, expect.objectContaining({ category: 'server_error' }))
    expect(onRetry).toHaveBeenCalledWith(2, expect.objectContaining({ category: 'server_error' }))
  })
})
