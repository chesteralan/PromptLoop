import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import type { ExecutionStatus } from '../../lib/status-config'

interface ExecutionControlsProps {
  status: ExecutionStatus
  onStart: () => void
  onPause: () => void
  onStop: () => void
  onRetry: () => void
  loading?: boolean
}

export function ExecutionControls({
  status,
  onStart,
  onPause,
  onStop,
  onRetry,
  loading,
}: ExecutionControlsProps) {
  return (
    <div className="flex items-center gap-2" aria-busy={loading}>
      {status === 'idle' && (
        <Button size="sm" onClick={onStart} disabled={loading}>
          <Play className="mr-1.5 size-4" />
          Start
        </Button>
      )}
      {status === 'running' && (
        <>
          <Button size="sm" variant="outline" onClick={onPause} disabled={loading}>
            <Pause className="mr-1.5 size-4" />
            Pause
          </Button>
          <Button size="sm" variant="destructive" onClick={onStop} disabled={loading}>
            <Square className="mr-1.5 size-4" />
            Stop
          </Button>
        </>
      )}
      {status === 'paused' && (
        <>
          <Button size="sm" onClick={onPause} disabled={loading}>
            <Play className="mr-1.5 size-4" />
            Resume
          </Button>
          <Button size="sm" variant="destructive" onClick={onStop} disabled={loading}>
            <Square className="mr-1.5 size-4" />
            Stop
          </Button>
        </>
      )}
      {(status === 'stopped' || status === 'error') && (
        <Button size="sm" variant="outline" onClick={onRetry} disabled={loading}>
          <RotateCcw className="mr-1.5 size-4" />
          Retry
        </Button>
      )}
    </div>
  )
}
