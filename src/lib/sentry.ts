import { init } from '@sentry/electron/renderer'

export function initRendererSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  init({
    dsn,
    environment: import.meta.env.DEV ? 'development' : 'production',
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
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
