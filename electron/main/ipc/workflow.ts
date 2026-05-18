import { ipcMain } from 'electron'
import { WorkflowRunner } from '../engine/runner'
import type { WorkflowConfig } from '../engine/types'

const runners = new Map<string, WorkflowRunner>()

function cleanupRunner(workflowId: string): void {
  const runner = runners.get(workflowId)
  if (runner) {
    runner.stop()
    runners.delete(workflowId)
  }
}

export function registerWorkflowIpc(): void {
  ipcMain.handle(
    'workflow:start',
    async (
      _event,
      {
        workflowId,
        config,
        apiKeys,
      }: { workflowId: string; config: WorkflowConfig; apiKeys: Record<string, string> },
    ) => {
      const existing = runners.get(workflowId)
      if (existing) {
        return { success: false, error: 'Workflow is already running' }
      }

      const runner = new WorkflowRunner(config, apiKeys)
      runners.set(workflowId, runner)

      runner.start().then(
        () => cleanupRunner(workflowId),
        () => cleanupRunner(workflowId),
      )

      return { success: true, workflowId }
    },
  )

  ipcMain.handle('workflow:pause', async (_event, { workflowId }: { workflowId: string }) => {
    const runner = runners.get(workflowId)
    if (!runner) return { success: false, error: 'Workflow not found' }
    runner.pause()
    return { success: true, workflowId }
  })

  ipcMain.handle('workflow:stop', async (_event, { workflowId }: { workflowId: string }) => {
    cleanupRunner(workflowId)
    return { success: true, workflowId }
  })

  ipcMain.handle('workflow:retry', async (_event, { workflowId }: { workflowId: string }) => {
    const runner = runners.get(workflowId)
    if (!runner) return { success: false, error: 'Workflow not found' }
    runner.stop()
    runners.delete(workflowId)
    return { success: true, workflowId }
  })

  ipcMain.handle('workflow:status', async (_event, { workflowId }: { workflowId: string }) => {
    const runner = runners.get(workflowId)
    if (!runner) return { success: false, error: 'Workflow not found' }
    return { success: true, status: runner.getStatus() }
  })
}
