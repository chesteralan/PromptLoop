import { cn } from '../../lib/utils'

interface PromptProgressItem {
  id: string
  title: string
  status: 'pending' | 'running' | 'completed' | 'failed'
}

interface PromptProgressBarProps {
  prompts: PromptProgressItem[]
  onSegmentClick?: (id: string) => void
}

const statusColors: Record<string, string> = {
  pending: 'bg-muted-foreground/20',
  running: 'bg-blue-500 animate-pulse',
  completed: 'bg-green-500',
  failed: 'bg-destructive',
}

export function PromptProgressBar({ prompts, onSegmentClick }: PromptProgressBarProps) {
  if (prompts.length === 0) return null

  return (
    <div className="flex overflow-x-auto rounded-md">
      {prompts.map((p) => (
        <button
          key={p.id}
          onClick={() => onSegmentClick?.(p.id)}
          className={cn(
            'group relative flex h-8 shrink-0 items-center justify-center border-r border-background/50 text-[10px] font-medium text-white transition-colors last:border-r-0 hover:opacity-80',
            statusColors[p.status] ?? statusColors.pending,
          )}
          style={{ flex: `${100 / prompts.length}%`, minWidth: 32 }}
          title={p.title}
        >
          <span className="truncate px-1">{p.title}</span>
        </button>
      ))}
    </div>
  )
}
