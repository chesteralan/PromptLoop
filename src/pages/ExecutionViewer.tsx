import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ListRestart } from 'lucide-react'
import { useWorkflow } from '../hooks/useWorkflows'
import { usePrompts } from '../hooks/usePrompts'
import { useExecutionStore } from '../store/executionStore'
import { useExecutionListener, useWorkflowControl } from '../hooks/useIpc'
import { PageHeader } from '../components/shared/PageHeader'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { ExecutionControls } from '../components/execution/ExecutionControls'
import { PromptProgressBar } from '../components/workflow/PromptProgressBar'
import { QueueItem } from '../components/workflow/QueueItem'
import { StreamingText } from '../components/execution/StreamingText'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { ScrollArea } from '../components/ui/scroll-area'
import { Button } from '../components/ui/button'
import type { PromptConfig } from '../../electron/main/engine/types'
import type { PromptData } from '../lib/converters'

type PromptItem = PromptData & { id: string }

type PromptRunStatus = 'pending' | 'running' | 'completed' | 'failed'

export function ExecutionViewerPage() {
  const { workflowId } = useParams<{ workflowId: string }>()
  const navigate = useNavigate()
  const { data: workflow, isLoading } = useWorkflow(workflowId)
  const { data: prompts = [] } = usePrompts(workflowId)
  const control = useWorkflowControl()

  const executionStatus = useExecutionStore((s) => s.executionStatus)
  const responseBuffer = useExecutionStore((s) => s.responseBuffer)
  const loopIteration = useExecutionStore((s) => s.loopIteration)
  const recentLogs = useExecutionStore((s) => s.recentLogs)
  const clearResponse = useExecutionStore((s) => s.clearResponse)
  const resetExecution = useExecutionStore((s) => s.resetExecution)

  const [loading, setLoading] = useState(false)
  const [promptStatuses, setPromptStatuses] = useState<Record<string, PromptRunStatus>>({})

  useExecutionListener()

  const enabledPrompts = (prompts as PromptItem[]).filter((p) => p.enabled !== false)

  const progressItems = enabledPrompts.map((p) => ({
    id: p.id,
    title: p.title || 'Untitled',
    status: (promptStatuses[p.id] ?? 'pending') as PromptRunStatus,
  }))

  const runningPromptId = progressItems.find((p) => p.status === 'running')?.id

  const handleStart = useCallback(async () => {
    if (!workflowId) return
    setLoading(true)
    setPromptStatuses({})
    clearResponse()

    const promptConfigs: PromptConfig[] = enabledPrompts.map((p) => ({
      id: p.id,
      title: p.title || 'Untitled',
      content: p.content || '',
      systemPrompt: p.systemPrompt,
      model: p.model || 'gpt-4o',
      position: p.position,
      enabled: true,
      temperature: p.temperature ?? 1.0,
      maxTokens: p.maxTokens ?? 1024,
      delayMs: p.delayMs ?? 0,
    }))

    await control.startWorkflow(workflowId, {
      id: workflowId,
      name: workflow?.name ?? 'Workflow',
      loopMode: workflow?.loopMode ?? 'single',
      maxIterations: workflow?.maxIterations,
      prompts: promptConfigs,
    })

    useExecutionStore.getState().setExecutionStatus('running')
    setLoading(false)
  }, [workflowId, enabledPrompts, workflow, control, clearResponse])

  const handlePause = useCallback(async () => {
    if (!workflowId) return
    setLoading(true)
    await control.pauseWorkflow(workflowId)
    useExecutionStore.getState().setExecutionStatus('paused')
    setLoading(false)
  }, [workflowId, control])

  const handleStop = useCallback(async () => {
    if (!workflowId) return
    setLoading(true)
    await control.stopWorkflow(workflowId)
    useExecutionStore.getState().setExecutionStatus('stopped')
    setLoading(false)
  }, [workflowId, control])

  const handleRetry = useCallback(async () => {
    if (!workflowId) return
    setLoading(true)
    await control.retryWorkflow(workflowId)
    useExecutionStore.getState().setExecutionStatus('idle')
    setPromptStatuses({})
    clearResponse()
    setLoading(false)
  }, [workflowId, control, clearResponse])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={workflow?.name ?? 'Execution Viewer'}
        onBack={() => navigate('/dashboard')}
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={executionStatus === 'running' ? 'default' : 'secondary'}>
              {executionStatus}
            </Badge>
            {loopIteration > 0 && <Badge variant="outline">Loop {loopIteration + 1}</Badge>}
            <ExecutionControls
              status={executionStatus}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
              onRetry={handleRetry}
              loading={loading}
            />
          </div>
        }
      />

      {executionStatus !== 'idle' && (
        <>
          <PromptProgressBar prompts={progressItems} onSegmentClick={() => {}} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <StreamingText text={responseBuffer} isStreaming={executionStatus === 'running'} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Queue</h3>
                <span className="text-xs text-muted-foreground">
                  {progressItems.filter((p) => p.status === 'completed').length}/
                  {progressItems.length}
                </span>
              </div>
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {progressItems.map((item) => (
                    <QueueItem
                      key={item.id}
                      title={item.title}
                      status={item.status}
                      durationMs={recentLogs.find((l) => l.promptId === item.id)?.durationMs}
                      error={recentLogs.find((l) => l.promptId === item.id)?.error}
                      isActive={item.id === runningPromptId}
                    />
                  ))}
                </div>
              </ScrollArea>

              {recentLogs.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Logs</h3>
                    <Button variant="ghost" size="sm" onClick={() => resetExecution()}>
                      <ListRestart className="mr-1 size-3" />
                      Clear
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-1">
                      {recentLogs.slice(0, 50).map((log) => (
                        <div
                          key={log.id + log.createdAt}
                          className="flex items-center gap-2 rounded px-2 py-1 text-xs"
                        >
                          <span
                            className={`inline-block size-1.5 shrink-0 rounded-full ${
                              log.status === 'completed' ? 'bg-green-500' : 'bg-destructive'
                            }`}
                          />
                          <span className="truncate text-muted-foreground">
                            {log.promptId.slice(0, 8)}
                          </span>
                          <span className="ml-auto tabular-nums text-muted-foreground">
                            {log.durationMs}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {executionStatus === 'idle' && enabledPrompts.length === 0 && (
        <p className="text-sm text-muted-foreground">No enabled prompts in this workflow.</p>
      )}
    </div>
  )
}
