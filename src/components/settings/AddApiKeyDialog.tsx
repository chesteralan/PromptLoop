import { useState } from 'react'
import { Eye, EyeOff, ClipboardPaste } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { PROVIDERS } from '../../lib/provider-config'
import { capitalizeProvider } from '../../lib/provider-config'
import { validateApiKeyInput } from '../../lib/api-key-utils'

interface AddApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (provider: string, key: string) => Promise<void>
}

export function AddApiKeyDialog({ open, onOpenChange, onSave }: AddApiKeyDialogProps) {
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]>('openai')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setApiKey(text.trim())
      setValidationError(null)
    } catch {
      toast.error('Unable to read clipboard. Please paste manually.')
    }
  }

  function validate(): string | null {
    const result = validateApiKeyInput(provider, apiKey)
    return result.valid ? null : (result.error ?? 'Invalid API key')
  }

  async function handleSave() {
    const error = validate()
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError(null)
    setSaving(true)
    try {
      await onSave(provider, apiKey.trim())
      toast.success(`${provider} API key saved`)
      setApiKey('')
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save API key')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>

        <div className="space-y-4" role="form" aria-label="Add API Key form">
          {validationError && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {validationError}
            </div>
          )}
          <div>
            <Label>Provider</Label>
            <Select
              value={provider}
              onValueChange={(v) => v && (setProvider(v), setValidationError(null))}
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {capitalizeProvider(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>API Key</Label>
            <div className="mt-1.5 flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key..."
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                <ClipboardPaste className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim() || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
