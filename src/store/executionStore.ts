import { create } from 'zustand'

interface ExecutionLog {
  id: string
  workflowId: string
  promptId: string
  status: 'completed' | 'failed'
  durationMs: number
  tokensIn: number
  tokensOut: number
  error?: string
  createdAt: string
}

interface ExecutionStore {
  activeWorkflowId: string | null
  executionStatus: 'idle' | 'running' | 'paused' | 'stopped' | 'error'
  currentPromptIndex: number
  responseBuffer: string
  loopIteration: number
  recentLogs: ExecutionLog[]

  setActiveWorkflow: (id: string | null) => void
  setExecutionStatus: (status: ExecutionStore['executionStatus']) => void
  appendResponseChunk: (chunk: string) => void
  clearResponse: () => void
  addLog: (log: ExecutionLog) => void
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  activeWorkflowId: null,
  executionStatus: 'idle',
  currentPromptIndex: 0,
  responseBuffer: '',
  loopIteration: 0,
  recentLogs: [],
  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
  setExecutionStatus: (status) => set({ executionStatus: status }),
  appendResponseChunk: (chunk) => set((s) => ({ responseBuffer: s.responseBuffer + chunk })),
  clearResponse: () => set({ responseBuffer: '' }),
  addLog: (log) => set((s) => ({ recentLogs: [log, ...s.recentLogs].slice(0, 100) })),
}))
