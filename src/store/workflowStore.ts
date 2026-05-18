import { create } from 'zustand'

interface Workflow {
  id: string
  name: string
  status: 'idle' | 'running' | 'paused' | 'error'
  createdAt: string
  updatedAt: string
}

interface WorkflowStore {
  workflows: Workflow[]
  activeWorkflowId: string | null
  isLoading: boolean

  setWorkflows: (workflows: Workflow[]) => void
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, data: Partial<Workflow>) => void
  removeWorkflow: (id: string) => void
  setActiveWorkflow: (id: string | null) => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflows: [],
  activeWorkflowId: null,
  isLoading: false,

  setWorkflows: (workflows) => set({ workflows }),
  addWorkflow: (workflow) => set((s) => ({ workflows: [...s.workflows, workflow] })),
  updateWorkflow: (id, data) =>
    set((s) => ({
      workflows: s.workflows.map((w) => (w.id === id ? { ...w, ...data } : w)),
    })),
  removeWorkflow: (id) => set((s) => ({ workflows: s.workflows.filter((w) => w.id !== id) })),
  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
}))
