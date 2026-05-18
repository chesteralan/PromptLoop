import { useState } from 'react'
import { Trash2, Key } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { ConfirmDialog } from '../shared/ConfirmDialog'

const providerColors: Record<string, string> = {
  openai: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  anthropic: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  google: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

interface ApiKeyCardProps {
  id: string
  provider: string
  keyPrefix: string
  createdAt: string
  onDelete: (id: string) => Promise<void>
}

export function ApiKeyCard({ id, provider, keyPrefix, createdAt, onDelete }: ApiKeyCardProps) {
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(id)
      toast.success('API key deleted')
    } catch {
      toast.error('Failed to delete API key')
    } finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Key className="size-8 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{provider}</span>
              <span className={providerColors[provider] ?? ''}>
                <Badge variant="secondary" className="text-[10px]">
                  {keyPrefix}...
                </Badge>
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Added {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-destructive/70 hover:text-destructive"
            onClick={() => setShowDelete(true)}
            disabled={deleting}
          >
            <Trash2 className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDelete}
        title="Delete API Key"
        message={`Are you sure you want to delete the ${provider} API key ending in "${keyPrefix}"?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  )
}
