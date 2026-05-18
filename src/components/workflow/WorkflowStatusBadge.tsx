import { cn } from '../../lib/utils'
import type { WorkflowStatus } from '../../../electron/shared/types'

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
}

const statusConfig: Record<WorkflowStatus, { label: string; className: string }> = {
  idle: { label: 'Idle', className: 'bg-muted-foreground/20 text-muted-foreground' },
  running: {
    label: 'Running',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  paused: {
    label: 'Paused',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  error: {
    label: 'Error',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  stopped: {
    label: 'Stopped',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-muted-foreground/20 text-muted-foreground',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        config.className,
      )}
    >
      <span
        className={cn(
          'inline-block size-1.5 rounded-full',
          status === 'running' && 'animate-pulse bg-current',
          status !== 'running' && 'bg-current',
        )}
      />
      {config.label}
    </span>
  )
}
