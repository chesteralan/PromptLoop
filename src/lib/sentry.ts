import { init } from '@sentry/electron/renderer'
import {
  shouldIgnoreSentryEvent,
  SENTRY_TRACES_SAMPLE_RATE_DEV,
  SENTRY_TRACES_SAMPLE_RATE_PROD,
} from './sentry-filter'

export function initRendererSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  init({
    dsn,
    environment: import.meta.env.DEV ? 'development' : 'production',
    tracesSampleRate: import.meta.env.DEV
      ? SENTRY_TRACES_SAMPLE_RATE_DEV
      : SENTRY_TRACES_SAMPLE_RATE_PROD,
    beforeSend(event) {
      if (shouldIgnoreSentryEvent(event)) return null
      return event
    },
  })
}
