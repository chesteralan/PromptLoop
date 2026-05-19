import { AlertTriangle, Key, Clock, WifiOff, Server } from 'lucide-react'
import type { ComponentType } from 'react'

export type ErrorCategory =
  | 'rate_limit'
  | 'auth'
  | 'server_error'
  | 'timeout'
  | 'network'
  | 'unknown'

export interface ErrorCategoryConfig {
  icon: ComponentType<{ className?: string }>
  label: string
  action?: { label: string; to?: string; handler?: () => void }
}

export const ERROR_CATEGORY_CONFIG: Record<ErrorCategory, ErrorCategoryConfig> = {
  rate_limit: {
    icon: Clock,
    label: 'Rate Limited',
    action: { label: 'Wait' },
  },
  auth: {
    icon: Key,
    label: 'Invalid API Key',
    action: { label: 'Configure API Key', to: '/settings/api-keys' },
  },
  server_error: {
    icon: Server,
    label: 'Server Error',
    action: { label: 'Retry' },
  },
  timeout: {
    icon: Clock,
    label: 'Timed Out',
    action: { label: 'Retry' },
  },
  network: {
    icon: WifiOff,
    label: 'Network Error',
    action: { label: 'Check Connection' },
  },
  unknown: {
    icon: AlertTriangle,
    label: 'Unexpected Error',
    action: { label: 'Retry' },
  },
}
