import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { ModelSelector } from './ModelSelector'
import type { PromptData } from '../../lib/converters'

interface PromptEditorPanelProps {
  prompt: (PromptData & { id: string }) | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (id: string, data: Partial<Omit<PromptData, 'id' | 'createdAt' | 'updatedAt'>>) => void
}

export function PromptEditorPanel({
  prompt,
  open,
  onOpenChange,
  onChange,
}: PromptEditorPanelProps) {
  if (!prompt) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Prompt Editor</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a prompt to edit
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{prompt.title || 'Untitled Prompt'}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-1">
          <div>
            <Label>Title</Label>
            <Input
              value={prompt.title}
              onChange={(e) => onChange(prompt.id, { title: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Prompt Content</Label>
            <Textarea
              value={prompt.content}
              onChange={(e) => onChange(prompt.id, { content: e.target.value })}
              placeholder="Enter your prompt here..."
              className="mt-1.5 min-h-[120px]"
            />
          </div>

          <div>
            <Label>System Prompt</Label>
            <Textarea
              value={prompt.systemPrompt ?? ''}
              onChange={(e) =>
                onChange(prompt.id, {
                  systemPrompt: e.target.value || undefined,
                })
              }
              placeholder="Optional system instructions..."
              className="mt-1.5 min-h-[80px]"
            />
          </div>

          <div>
            <Label>Model</Label>
            <ModelSelector
              value={prompt.model}
              onChange={(model) => onChange(prompt.id, { model })}
            />
          </div>

          <div>
            <Label>Temperature ({prompt.temperature ?? 1.0})</Label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={prompt.temperature ?? 1.0}
              onChange={(e) => onChange(prompt.id, { temperature: Number(e.target.value) })}
              className="mt-1.5 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Precise (0)</span>
              <span>Creative (2)</span>
            </div>
          </div>

          <div>
            <Label>Max Tokens</Label>
            <Input
              type="number"
              min={1}
              max={2_097_152}
              value={prompt.maxTokens ?? 1024}
              onChange={(e) => onChange(prompt.id, { maxTokens: Number(e.target.value) })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Delay After Execution (ms)</Label>
            <Input
              type="number"
              min={0}
              max={60_000}
              step={100}
              value={prompt.delayMs ?? 0}
              onChange={(e) => onChange(prompt.id, { delayMs: Number(e.target.value) })}
              className="mt-1.5"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enabled</Label>
            <Switch
              checked={prompt.enabled}
              onCheckedChange={(checked) => onChange(prompt.id, { enabled: checked })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
