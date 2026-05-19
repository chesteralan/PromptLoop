import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockInit } = vi.hoisted(() => ({ mockInit: vi.fn() }))

vi.mock('@sentry/electron/renderer', () => ({ init: mockInit }))

import { initRendererSentry } from '../sentry'

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
})

describe('initRendererSentry', () => {
  it('returns early when VITE_SENTRY_DSN is not set', () => {
    vi.stubEnv('VITE_SENTRY_DSN', '')
    initRendererSentry()
    expect(mockInit).not.toHaveBeenCalled()
  })

  it('calls init with DSN and development config', () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://key@sentry.io/project')
    initRendererSentry()
    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://key@sentry.io/project',
        environment: 'development',
        tracesSampleRate: 1.0,
      }),
    )
  })

  describe('beforeSend filter', () => {
    function getBeforeSend(): (event: { message?: string }) => { message?: string } | null {
      vi.stubEnv('VITE_SENTRY_DSN', 'https://key@sentry.io/project')
      initRendererSentry()
      const options = mockInit.mock.calls[0][0]
      return options.beforeSend
    }

    it('filters out ResizeObserver errors', () => {
      const beforeSend = getBeforeSend()
      expect(beforeSend({ message: 'ResizeObserver loop limit exceeded' })).toBeNull()
    })

    it('filters out Non-Error exception captured', () => {
      const beforeSend = getBeforeSend()
      expect(beforeSend({ message: 'Non-Error exception captured' })).toBeNull()
    })

    it('filters out Script error', () => {
      const beforeSend = getBeforeSend()
      expect(beforeSend({ message: 'Script error.' })).toBeNull()
    })

    it('passes through other events', () => {
      const beforeSend = getBeforeSend()
      const event = { message: 'TypeError: x is not a function' }
      expect(beforeSend(event)).toBe(event)
    })

    it('passes through events with empty message', () => {
      const beforeSend = getBeforeSend()
      const event = { message: '' }
      expect(beforeSend(event)).toBe(event)
    })
  })
})
