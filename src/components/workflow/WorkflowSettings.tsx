import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import type { LoopMode } from '../../../electron/shared/types'

interface WorkflowSettingsProps {
  loopMode: LoopMode
  maxIterations?: number
  onLoopModeChange: (mode: LoopMode) => void
  onMaxIterationsChange: (value: number) => void
}

const loopModeLabels: Record<LoopMode, { label: string; description: string }> = {
  infinite: { label: 'Infinite', description: 'Continuously loop until manually stopped' },
  fixed: { label: 'Fixed', description: 'Loop a specific number of times' },
  single: { label: 'Single Pass', description: 'Execute prompts once' },
  scheduled: { label: 'Scheduled', description: 'Run on a schedule (coming soon)' },
}

export function WorkflowSettings({
  loopMode,
  maxIterations,
  onLoopModeChange,
  onMaxIterationsChange,
}: WorkflowSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Loop Mode</Label>
        <Select value={loopMode} onValueChange={(v) => onLoopModeChange(v as LoopMode)}>
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              Object.entries(loopModeLabels) as [LoopMode, (typeof loopModeLabels)['infinite']][]
            ).map(([value, { label, description }]) => (
              <SelectItem key={value} value={value}>
                <div className="flex flex-col">
                  <span>{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loopMode === 'fixed' && (
        <div>
          <Label>Max Iterations</Label>
          <Input
            type="number"
            min={1}
            max={9999}
            value={maxIterations ?? 1}
            onChange={(e) => onMaxIterationsChange(Number(e.target.value))}
            className="mt-1.5"
          />
        </div>
      )}
    </div>
  )
}
