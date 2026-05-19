import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import type { LoopMode } from '../../lib/workflow-config'
import {
  LOOP_MODE_LABELS,
  isValidLoopMode,
  DEFAULT_MAX_ITERATIONS,
  MAX_ITERATIONS_BOUND,
} from '../../lib/workflow-config'

interface WorkflowSettingsProps {
  loopMode: LoopMode
  maxIterations?: number
  onLoopModeChange: (mode: LoopMode) => void
  onMaxIterationsChange: (value: number) => void
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
        <Select
          value={loopMode}
          onValueChange={(v) => v && isValidLoopMode(v) && onLoopModeChange(v)}
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LOOP_MODE_LABELS).map(([value, { label, description }]) => (
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
            max={MAX_ITERATIONS_BOUND}
            value={maxIterations ?? DEFAULT_MAX_ITERATIONS}
            onChange={(e) => onMaxIterationsChange(Number(e.target.value))}
            className="mt-1.5"
          />
        </div>
      )}
    </div>
  )
}
