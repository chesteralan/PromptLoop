import { AlertTriangle, Key, RefreshCw, WifiOff, Clock, Server } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

interface ErrorDisplayProps {
  category: 'rate_limit' | 'auth' | 'server_error' | 'timeout' | 'network' | 'unknown'
  message: string
  userMessage: string
  retryAfterMs?: number
  onRetry?: () => void
}

const categoryConfig: Record<
  string,
  {
    icon: typeof AlertTriangle
    label: string
    action?: { label: string; to?: string; handler?: () => void }
  }
> = {
  rate_limit: {
    icon: Clock,
    label: 'Rate Limited',
    action: { label: 'Wait', handler: undefined },
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

export function ErrorDisplay({ category, userMessage, retryAfterMs, onRetry }: ErrorDisplayProps) {
  const navigate = useNavigate()
  const config = categoryConfig[category] ?? categoryConfig.unknown
  const Icon = config.icon

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-destructive">{config.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{userMessage}</p>

          {retryAfterMs != null && retryAfterMs > 0 && (
            <div className="mt-3">
              <Progress value={(1 - retryAfterMs / 60_000) * 100} className="h-1" />
              <p className="mt-1 text-[10px] text-muted-foreground">
                Retrying in {Math.ceil(retryAfterMs / 1000)}s...
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            {config.action?.to && (
              <Button size="sm" variant="outline" onClick={() => navigate(config.action!.to!)}>
                <Key className="mr-1.5 size-3.5" />
                {config.action.label}
              </Button>
            )}
            {onRetry && category !== 'auth' && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RefreshCw className="mr-1.5 size-3.5" />
                {config.action?.label ?? 'Retry'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
