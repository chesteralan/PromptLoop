import { cn } from '../../lib/utils'
import { workflowStatusConfig } from '../../lib/status-config'
import type { WorkflowStatus } from '../../lib/status-config'

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const config = workflowStatusConfig[status] ?? {
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
