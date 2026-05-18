import { Save } from 'lucide-react'
import { Button } from '../ui/button'

interface SaveButtonProps {
  isNew: boolean
  isSaving: boolean
  disabled?: boolean
  onClick: () => void
}

export function SaveButton({ isNew, isSaving, disabled, onClick }: SaveButtonProps) {
  return (
    <Button size="sm" onClick={onClick} disabled={disabled || isSaving}>
      <Save className="mr-1.5 size-4" />
      {isSaving ? 'Saving...' : isNew ? 'Create' : 'Save'}
    </Button>
  )
}
