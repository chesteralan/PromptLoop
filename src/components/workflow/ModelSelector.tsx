import { useState } from 'react'
import { Search } from 'lucide-react'
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
import { MODELS, PROVIDER_LABELS, type ModelInfo } from '../../lib/models'

interface ModelSelectorProps {
  value: string
  onChange: (modelId: string) => void
}

const groupedModels = Object.entries(
  MODELS.reduce<Record<string, ModelInfo[]>>((acc, m) => {
    ;(acc[m.provider] ??= []).push(m)
    return acc
  }, {}),
)

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [search, setSearch] = useState('')
  const selected = MODELS.find((m) => m.id === value)

  const filtered = search
    ? groupedModels
        .map(
          ([provider, models]) =>
            [
              provider,
              models.filter(
                (m) =>
                  m.name.toLowerCase().includes(search.toLowerCase()) ||
                  m.id.toLowerCase().includes(search.toLowerCase()),
              ),
            ] as const,
        )
        .filter(([, models]) => models.length > 0)
    : groupedModels

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selected ? (
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
              <SelectLabel>{PROVIDER_LABELS[provider] ?? provider}</SelectLabel>
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
