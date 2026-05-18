import { Pencil, Play, Trash2, Square } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'
import type { WorkflowStatus } from '../../../electron/shared/types'

interface WorkflowCardProps {
  id: string
  name: string
  status: WorkflowStatus
  promptCount: number
  loopMode?: string
  onStart: () => void
  onStop: () => void
  onEdit: () => void
  onDelete: () => void
}

export function WorkflowCard({
  name,
  status,
  promptCount,
  loopMode,
  onStart,
  onStop,
  onEdit,
  onDelete,
}: WorkflowCardProps) {
  return (
    <Card className="transition-colors hover:bg-accent/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold">{name}</h3>
              <WorkflowStatusBadge status={status} />
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                {promptCount} prompt{promptCount !== 1 ? 's' : ''}
              </span>
              {loopMode && <span>· {loopMode}</span>}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {status === 'idle' && (
            <Button variant="default" size="sm" onClick={onStart}>
              <Play className="mr-1 size-3.5" />
              Start
            </Button>
          )}
          {status === 'running' && (
            <Button variant="destructive" size="sm" onClick={onStop}>
              <Square className="mr-1 size-3.5" />
              Stop
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-1 size-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive/70 hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
