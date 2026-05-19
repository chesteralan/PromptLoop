import { useEffect, useState } from 'react'
import { Circle } from 'lucide-react'
import { useExecutionStore } from '../../store/executionStore'
import { executionStatusColors } from '../../lib/status-config'

export function StatusBar() {
  const executionStatus = useExecutionStore((s) => s.executionStatus)
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    window.electronAPI
      ?.getAppVersion()
      .then(setAppVersion)
      .catch(() => {})
  }, [])

  const displayStatus = executionStatus ?? 'idle'
  const statusColor = executionStatusColors[displayStatus] ?? 'text-muted-foreground'

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
