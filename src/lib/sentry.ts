import { init } from '@sentry/electron/renderer'

export function initRendererSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  init({
    dsn,
    environment: import.meta.env.DEV ? 'development' : 'production',
    integrations: [],
  })
}
