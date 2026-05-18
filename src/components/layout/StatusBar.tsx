import { useEffect, useState } from 'react'
import { Circle } from 'lucide-react'
import { useExecutionStore } from '../../store/executionStore'

export function StatusBar() {
  const executionStatus = useExecutionStore((s) => s.executionStatus)
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    window.electronAPI
      ?.getAppVersion()
      .then(setAppVersion)
      .catch(() => {})
  }, [])

  const statusColors: Record<string, string> = {
    idle: 'text-muted-foreground',
    running: 'text-green-500',
    paused: 'text-yellow-500',
    completed: 'text-blue-500',
    stopped: 'text-muted-foreground',
    error: 'text-red-500',
  }
  const displayStatus = executionStatus ?? 'idle'
  const statusColor = statusColors[displayStatus] ?? 'text-muted-foreground'

  return (
    <footer className="flex h-7 items-center justify-between border-t px-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <Circle className={`size-2.5 fill-current ${statusColor}`} />
        <span>{displayStatus}</span>
      </div>
      {appVersion && <span>v{appVersion}</span>}
    </footer>
  )
}
