import { Loader2, CheckCircle2, XCircle, Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface QueueItemProps {
  title: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  durationMs?: number
  error?: string
  isActive?: boolean
}

const statusIcon = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
}

const statusColor = {
  pending: 'text-muted-foreground',
  running: 'text-blue-500',
  completed: 'text-green-500',
  failed: 'text-destructive',
}

export function QueueItem({ title, status, durationMs, error, isActive }: QueueItemProps) {
  const Icon = statusIcon[status]

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 transition-colors',
        isActive ? 'border-primary/50 bg-accent/50' : 'border-transparent',
        status === 'failed' && 'border-destructive/30',
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          statusColor[status],
          status === 'running' && 'animate-spin',
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {error && <p className="mt-0.5 truncate text-xs text-destructive">{error}</p>}
        {status === 'completed' && durationMs != null && (
          <p className="mt-0.5 text-xs text-muted-foreground">{durationMs}ms</p>
        )}
      </div>
    </div>
  )
}
