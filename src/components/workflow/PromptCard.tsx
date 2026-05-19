import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { useConfirmDelete } from '../../hooks/useConfirmDelete'
import type { PromptData } from '../../lib/converters'

interface PromptCardProps {
  prompt: PromptData & { id: string }
  index: number
  isSelected: boolean
  onSelect: () => void
  onToggle: (enabled: boolean) => void
  onDelete: () => void
}

export function PromptCard({
  prompt,
  index,
  isSelected,
  onSelect,
  onToggle,
  onDelete,
}: PromptCardProps) {
  const { showDelete, requestConfirm, cancelConfirm } = useConfirmDelete()

  return (
    <>
      <Draggable draggableId={prompt.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              snapshot.isDragging
                ? 'border-primary/50 bg-accent shadow-lg'
                : isSelected
                  ? 'border-primary bg-accent/50'
                  : 'bg-card hover:bg-accent/30'
            }`}
          >
            <div
              {...provided.dragHandleProps}
              className="flex cursor-grab items-center text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical className="size-4" />
            </div>

            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium tabular-nums text-muted-foreground">
              {prompt.position + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{prompt.title}</p>
              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                {prompt.model}
              </Badge>
            </div>

            <Switch checked={prompt.enabled} onCheckedChange={onToggle} size="sm" />

            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={onSelect}
              aria-label={`Edit ${prompt.title}`}
            >
              <Pencil className="size-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-destructive/70 hover:text-destructive"
              onClick={() => requestConfirm()}
              aria-label={`Delete ${prompt.title}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
      </Draggable>

      <ConfirmDialog
        open={showDelete}
        title="Delete Prompt"
        message={`Are you sure you want to delete "${prompt.title}"?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          onDelete()
          cancelConfirm()
        }}
        onCancel={() => cancelConfirm()}
      />
    </>
  )
}
