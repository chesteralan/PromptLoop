import { Key, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { ERROR_CATEGORY_CONFIG, type ErrorCategory } from '../../lib/error-config'

interface ErrorDisplayProps {
  category: ErrorCategory
  message: string
  userMessage: string
  retryAfterMs?: number
  onRetry?: () => void
}

export function ErrorDisplay({ category, userMessage, retryAfterMs, onRetry }: ErrorDisplayProps) {
  const navigate = useNavigate()
  const config = ERROR_CATEGORY_CONFIG[category] ?? ERROR_CATEGORY_CONFIG.unknown
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
