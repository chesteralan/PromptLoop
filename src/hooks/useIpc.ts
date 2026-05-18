import { useEffect } from 'react'
import { useExecutionStore } from '../store/executionStore'

export function useExecutionListener() {
  const setExecutionStatus = useExecutionStore((s) => s.setExecutionStatus)
  const appendResponseChunk = useExecutionStore((s) => s.appendResponseChunk)
  const clearResponse = useExecutionStore((s) => s.clearResponse)
  const addLog = useExecutionStore((s) => s.addLog)

  useEffect(() => {
    const cleanupChunk = window.electronAPI.onExecutionChunk((data) => {
      appendResponseChunk(data.chunk)
    })

    const cleanupCompleted = window.electronAPI.onExecutionCompleted((data) => {
      addLog({
        workflowId: data.workflowId,
        promptId: data.promptId,
        status: 'completed',
        durationMs: data.durationMs,
        tokensIn: 0,
        tokensOut: 0,
        createdAt: new Date().toISOString(),
      })
    })

    const cleanupFailed = window.electronAPI.onExecutionFailed((data) => {
      addLog({
        workflowId: data.workflowId,
        promptId: data.promptId,
        status: 'failed',
        durationMs: 0,
        tokensIn: 0,
        tokensOut: 0,
        error: data.error,
        createdAt: new Date().toISOString(),
      })
    })

    const cleanupWorkflowDone = window.electronAPI.onWorkflowCompleted(() => {
      setExecutionStatus('idle')
      clearResponse()
    })

    return () => {
      cleanupChunk()
      cleanupCompleted()
      cleanupFailed()
      cleanupWorkflowDone()
    }
  }, [setExecutionStatus, appendResponseChunk, clearResponse, addLog])
}

export function useWorkflowControl() {
  return {
    startWorkflow: (workflowId: string, config?: unknown, apiKeys?: Record<string, string>) =>
      window.electronAPI.startWorkflow(workflowId, config, apiKeys),
    pauseWorkflow: (workflowId: string) => window.electronAPI.pauseWorkflow(workflowId),
    stopWorkflow: (workflowId: string) => window.electronAPI.stopWorkflow(workflowId),
    retryWorkflow: (workflowId: string) => window.electronAPI.retryWorkflow(workflowId),
  }
}
