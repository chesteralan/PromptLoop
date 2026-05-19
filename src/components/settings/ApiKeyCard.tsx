import { useState } from 'react'
import { Trash2, Key } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { PROVIDER_COLORS } from '../../lib/provider-config'
import { useConfirmDelete } from '../../hooks/useConfirmDelete'

interface ApiKeyCardProps {
  id: string
  provider: string
  keyPrefix: string
  createdAt: string
  onDelete: (id: string) => Promise<void>
}

export function ApiKeyCard({ id, provider, keyPrefix, createdAt, onDelete }: ApiKeyCardProps) {
  const { showDelete, requestConfirm, cancelConfirm } = useConfirmDelete()
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
      cancelConfirm()
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
              <span className={PROVIDER_COLORS[provider] ?? PROVIDER_COLORS.openai}>
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
            onClick={() => requestConfirm()}
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
        onCancel={() => cancelConfirm()}
      />
    </>
  )
}
