import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  onBack?: () => void
}

export function PageHeader({ title, description, actions, onBack }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
