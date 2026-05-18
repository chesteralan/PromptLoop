import { describe, it, expect, vi, beforeEach } from 'vitest'
import { init } from '@sentry/electron/main'

vi.mock('@sentry/electron/main', () => ({
  init: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  delete process.env.SENTRY_DSN
  delete process.env.NODE_ENV
})

describe('initSentry', () => {
  it('returns early when SENTRY_DSN is not set', async () => {
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(init).not.toHaveBeenCalled()
  })

  it('calls init with correct config when DSN is set', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    process.env.NODE_ENV = 'production'
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://key@dsn.example.com/1',
        environment: 'production',
        tracesSampleRate: 0.1,
      }),
    )
  })

  it('sets tracesSampleRate to 1.0 in non-production', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    process.env.NODE_ENV = 'development'
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(init).toHaveBeenCalledWith(expect.objectContaining({ tracesSampleRate: 1.0 }))
  })

  it('defaults environment to development when NODE_ENV is not set', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(init).toHaveBeenCalledWith(expect.objectContaining({ environment: 'development' }))
  })
})

interface SentryEvent {
  message?: string
  [key: string]: unknown
}

describe('beforeSend', () => {
  function getBeforeSend() {
    return vi.mocked(init).mock.calls[0][0].beforeSend as (event: SentryEvent) => SentryEvent | null
  }

  it('returns null for ResizeObserver errors', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(getBeforeSend()({ message: 'ResizeObserver loop limit exceeded' })).toBeNull()
  })

  it('returns null for Non-Error exception captured', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(getBeforeSend()({ message: 'Non-Error exception captured' })).toBeNull()
  })

  it('returns null for Script error.', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(getBeforeSend()({ message: 'Script error.' })).toBeNull()
  })

  it('passes through other events', async () => {
    process.env.SENTRY_DSN = 'https://key@dsn.example.com/1'
    const { initSentry } = await import('../sentry')
    initSentry()
    const event: SentryEvent = { message: 'Some real error' }
    expect(getBeforeSend()(event)).toEqual(event)
  })
})
