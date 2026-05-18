import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { PromptCard } from './PromptCard'
import type { PromptData } from '../../lib/converters'

interface PromptListProps {
  prompts: (PromptData & { id: string })[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function PromptList({
  prompts,
  selectedId,
  onSelect,
  onToggle,
  onDelete,
  onReorder,
}: PromptListProps) {
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    if (result.source.index === result.destination.index) return

    const ordered = Array.from(prompts)
    const [moved] = ordered.splice(result.source.index, 1)
    ordered.splice(result.destination.index, 0, moved)
    onReorder(ordered.map((p) => p.id))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="prompts">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
            {prompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                isSelected={prompt.id === selectedId}
                onSelect={() => onSelect(prompt.id)}
                onToggle={(enabled) => onToggle(prompt.id, enabled)}
                onDelete={() => onDelete(prompt.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
