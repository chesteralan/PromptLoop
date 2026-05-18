import { init } from '@sentry/electron/main'

export function initSentry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
  })
}
