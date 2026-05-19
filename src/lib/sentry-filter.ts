export function shouldIgnoreSentryEvent(event: { message?: string }): boolean {
  const msg = event.message || ''
  return (
    msg.includes('ResizeObserver') ||
    msg.includes('Non-Error exception captured') ||
    msg.includes('Script error.')
  )
}

export const SENTRY_TRACES_SAMPLE_RATE_DEV = 1.0
export const SENTRY_TRACES_SAMPLE_RATE_PROD = 0.1
