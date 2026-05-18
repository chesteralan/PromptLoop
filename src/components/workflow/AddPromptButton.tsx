import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

interface AddPromptButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function AddPromptButton({ onClick, disabled }: AddPromptButtonProps) {
  return (
    <Button size="sm" variant="outline" onClick={onClick} disabled={disabled}>
      <Plus className="mr-1.5 size-4" />
      Add Prompt
    </Button>
  )
}
