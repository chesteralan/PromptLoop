import { cn } from '../../lib/utils'
import { promptProgressColors } from '../../lib/status-config'
import type { PromptItemStatus } from '../../lib/status-config'

interface PromptProgressItem {
  id: string
  title: string
  status: PromptItemStatus
}

interface PromptProgressBarProps {
  prompts: PromptProgressItem[]
  onSegmentClick?: (id: string) => void
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
            promptProgressColors[p.status] ?? promptProgressColors.pending,
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
