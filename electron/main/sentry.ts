import { init } from '@sentry/electron/main'

export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      const msg = event.message || ''
      if (
        msg.includes('ResizeObserver') ||
        msg.includes('Non-Error exception captured') ||
        msg.includes('Script error.')
      ) {
        return null
      }
      return event
    },
  })
}
