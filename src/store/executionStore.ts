import { create } from 'zustand'

export type ExecStatus = 'idle' | 'running' | 'paused' | 'completed' | 'stopped' | 'error'

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
  executionStatus: ExecStatus
  currentPromptIndex: number
  responseBuffer: string
  loopIteration: number
  recentLogs: ExecutionLog[]

  setActiveWorkflow: (id: string | null) => void
  setExecutionStatus: (status: ExecStatus) => void
  setCurrentPromptIndex: (index: number) => void
  setLoopIteration: (iteration: number) => void
  appendResponseChunk: (chunk: string) => void
  clearResponse: () => void
  addLog: (log: Omit<ExecutionLog, 'id'>) => void
  resetExecution: () => void
}

const initialState = {
  activeWorkflowId: null as string | null,
  executionStatus: 'idle' as ExecStatus,
  currentPromptIndex: 0,
  responseBuffer: '',
  loopIteration: 0,
  recentLogs: [] as ExecutionLog[],
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  ...initialState,

  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
  setExecutionStatus: (status) => set({ executionStatus: status }),
  setCurrentPromptIndex: (index) => set({ currentPromptIndex: index }),
  setLoopIteration: (iteration) => set({ loopIteration: iteration }),
  appendResponseChunk: (chunk) => set((s) => ({ responseBuffer: s.responseBuffer + chunk })),
  clearResponse: () => set({ responseBuffer: '' }),
  addLog: (log) =>
    set((s) => ({
      recentLogs: [{ ...log, id: crypto.randomUUID() }, ...s.recentLogs].slice(0, 100),
    })),
  resetExecution: () => set(initialState),
}))
