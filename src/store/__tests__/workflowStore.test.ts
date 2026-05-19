import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkflowStore } from '../workflowStore'

const mockWorkflow = {
  id: 'w1',
  name: 'Test Workflow',
  status: 'idle' as const,
  loopMode: 'sequential' as const,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
}

beforeEach(() => {
  useWorkflowStore.setState({ workflows: [], activeWorkflowId: null })
})

describe('workflowStore', () => {
  it('has correct initial state', () => {
    const state = useWorkflowStore.getState()
    expect(state.workflows).toEqual([])
    expect(state.activeWorkflowId).toBeNull()
  })

  it('setWorkflows replaces the workflow list', () => {
    useWorkflowStore.getState().setWorkflows([mockWorkflow])
    expect(useWorkflowStore.getState().workflows).toHaveLength(1)
    expect(useWorkflowStore.getState().workflows[0].name).toBe('Test Workflow')
  })

  it('addWorkflow appends to the list', () => {
    useWorkflowStore.getState().addWorkflow(mockWorkflow)
    useWorkflowStore.getState().addWorkflow({ ...mockWorkflow, id: 'w2', name: 'Workflow 2' })
    expect(useWorkflowStore.getState().workflows).toHaveLength(2)
    expect(useWorkflowStore.getState().workflows[1].name).toBe('Workflow 2')
  })

  it('updateWorkflow merges partial data by id', () => {
    useWorkflowStore.getState().setWorkflows([mockWorkflow])
    useWorkflowStore.getState().updateWorkflow('w1', { name: 'Updated', status: 'running' })
    const wf = useWorkflowStore.getState().workflows[0]
    expect(wf.name).toBe('Updated')
    expect(wf.status).toBe('running')
    expect(wf.loopMode).toBe('sequential')
  })

  it('updateWorkflow is no-op for non-existent id', () => {
    useWorkflowStore.getState().setWorkflows([mockWorkflow])
    useWorkflowStore.getState().updateWorkflow('nonexistent', { name: 'Nope' })
    expect(useWorkflowStore.getState().workflows).toHaveLength(1)
    expect(useWorkflowStore.getState().workflows[0].name).toBe('Test Workflow')
  })

  it('removeWorkflow filters out matching id', () => {
    useWorkflowStore.getState().setWorkflows([mockWorkflow, { ...mockWorkflow, id: 'w2' }])
    useWorkflowStore.getState().removeWorkflow('w1')
    expect(useWorkflowStore.getState().workflows).toHaveLength(1)
    expect(useWorkflowStore.getState().workflows[0].id).toBe('w2')
  })

  it('removeWorkflow is no-op for non-existent id', () => {
    useWorkflowStore.getState().setWorkflows([mockWorkflow])
    useWorkflowStore.getState().removeWorkflow('nonexistent')
    expect(useWorkflowStore.getState().workflows).toHaveLength(1)
  })

  it('setActiveWorkflow sets the active id', () => {
    useWorkflowStore.getState().setActiveWorkflow('w1')
    expect(useWorkflowStore.getState().activeWorkflowId).toBe('w1')
    useWorkflowStore.getState().setActiveWorkflow(null)
    expect(useWorkflowStore.getState().activeWorkflowId).toBeNull()
  })
})
