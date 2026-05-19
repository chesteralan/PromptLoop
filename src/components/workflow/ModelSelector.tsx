import { Search, Key } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import { MODELS, PROVIDER_LABELS } from '../../lib/models'
import { useModelSearch } from '../../hooks/useModelSearch'

interface ModelSelectorProps {
  value: string
  onChange: (modelId: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const { search, setSearch, filtered, noKeysConfigured } = useModelSearch()
  const selected = MODELS.find((m) => m.id === value)

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full" disabled={noKeysConfigured}>
          <SelectValue>
            {noKeysConfigured ? (
              'Add an API key first'
            ) : selected ? (
              <span>
                {selected.name}{' '}
                <span className="text-muted-foreground">
                  ({Math.round(selected.maxTokens / 1000)}k tokens)
                </span>
              </span>
            ) : (
              'Select a model'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="w-72">
          {noKeysConfigured ? (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center text-xs text-muted-foreground">
              <Key className="size-6" />
              <span>No API keys configured</span>
              <span>Add API keys in Settings to select a model</span>
            </div>
          ) : (
            <>
              <div className="relative px-1 pb-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {filtered.map(([provider, models]) => (
                <SelectGroup key={provider}>
                  <SelectLabel>
                    {PROVIDER_LABELS[provider as keyof typeof PROVIDER_LABELS] ?? provider}
                  </SelectLabel>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span>{m.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(m.maxTokens / 1000)}k
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </>
          )}
        </SelectContent>
      </Select>

      {selected && (
        <p className="text-xs text-muted-foreground">
          Max tokens: {Math.round(selected.maxTokens / 1000).toLocaleString()}k
        </p>
      )}
    </div>
  )
}
