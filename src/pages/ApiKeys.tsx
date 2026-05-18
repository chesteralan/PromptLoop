import { useState, useEffect, useCallback } from 'react'
import { Key, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { PageHeader } from '../components/shared/PageHeader'
import { EmptyState } from '../components/shared/EmptyState'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { AddApiKeyDialog } from '../components/settings/AddApiKeyDialog'
import { ApiKeyCard } from '../components/settings/ApiKeyCard'

export function ApiKeysPage() {
  const [keys, setKeys] = useState<Awaited<ReturnType<typeof window.electronAPI.listApiKeys>>>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const loadKeys = useCallback(async () => {
    setLoading(true)
    try {
      const data = await window.electronAPI.listApiKeys()
      setKeys(data)
    } catch {
      toast.error('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadKeys()
  }, [loadKeys])

  async function handleSave(provider: string, apiKey: string) {
    await window.electronAPI.encryptApiKey(provider, apiKey)
    await loadKeys()
  }

  async function handleDelete(id: string) {
    await window.electronAPI.deleteApiKey(id)
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage your AI provider API keys. Keys are encrypted and stored locally."
        actions={
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="mr-1.5 size-4" />
            Add Key
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : keys.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No API keys configured"
          description="Add an API key for OpenAI, Anthropic, or Google to start running workflows."
          actionLabel="Add API Key"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <ApiKeyCard
              key={k.id}
              id={k.id}
              provider={k.provider}
              keyPrefix={k.keyPrefix}
              createdAt={k.createdAt}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddApiKeyDialog open={showAdd} onOpenChange={setShowAdd} onSave={handleSave} />
    </div>
  )
}
