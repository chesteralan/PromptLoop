export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'completed' | 'stopped' | 'error'

export type PromptItemStatus = 'pending' | 'running' | 'completed' | 'failed'

export const EXECUTION_STATUSES = [
  'idle',
  'running',
  'paused',
  'completed',
  'stopped',
  'error',
] as const

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number]

export const executionStatusColors: Record<ExecutionStatus, string> = {
  idle: 'text-muted-foreground',
  running: 'text-green-500',
  paused: 'text-yellow-500',
  completed: 'text-blue-500',
  stopped: 'text-muted-foreground',
  error: 'text-red-500',
}

export const workflowStatusConfig: Record<WorkflowStatus, { label: string; className: string }> = {
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

export const promptItemStatusColors: Record<PromptItemStatus, string> = {
  pending: 'text-muted-foreground',
  running: 'text-blue-500',
  completed: 'text-green-500',
  failed: 'text-destructive',
}

export const promptProgressColors: Record<string, string> = {
  pending: 'bg-muted-foreground/20',
  running: 'bg-blue-500 animate-pulse',
  completed: 'bg-green-500',
  failed: 'bg-destructive',
}
