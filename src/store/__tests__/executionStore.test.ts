import { describe, it, expect, beforeEach } from 'vitest'
import { useExecutionStore } from '../executionStore'

beforeEach(() => {
  useExecutionStore.setState({
    activeWorkflowId: null,
    executionStatus: 'idle',
    currentPromptIndex: 0,
    responseBuffer: '',
    loopIteration: 0,
    recentLogs: [],
  })
})

describe('executionStore', () => {
  it('has correct initial state', () => {
    const state = useExecutionStore.getState()
    expect(state.activeWorkflowId).toBeNull()
    expect(state.executionStatus).toBe('idle')
    expect(state.currentPromptIndex).toBe(0)
    expect(state.responseBuffer).toBe('')
    expect(state.loopIteration).toBe(0)
    expect(state.recentLogs).toEqual([])
  })

  it('setActiveWorkflow updates the active workflow id', () => {
    useExecutionStore.getState().setActiveWorkflow('w1')
    expect(useExecutionStore.getState().activeWorkflowId).toBe('w1')
    useExecutionStore.getState().setActiveWorkflow(null)
    expect(useExecutionStore.getState().activeWorkflowId).toBeNull()
  })

  it('setExecutionStatus updates the status', () => {
    useExecutionStore.getState().setExecutionStatus('running')
    expect(useExecutionStore.getState().executionStatus).toBe('running')
    useExecutionStore.getState().setExecutionStatus('paused')
    expect(useExecutionStore.getState().executionStatus).toBe('paused')
  })

  it('setCurrentPromptIndex updates the index', () => {
    useExecutionStore.getState().setCurrentPromptIndex(5)
    expect(useExecutionStore.getState().currentPromptIndex).toBe(5)
  })

  it('setLoopIteration updates the loop iteration', () => {
    useExecutionStore.getState().setLoopIteration(3)
    expect(useExecutionStore.getState().loopIteration).toBe(3)
  })

  it('appendResponseChunk concatenates to responseBuffer', () => {
    useExecutionStore.getState().appendResponseChunk('hello ')
    useExecutionStore.getState().appendResponseChunk('world')
    expect(useExecutionStore.getState().responseBuffer).toBe('hello world')
  })

  it('clearResponse resets responseBuffer to empty', () => {
    useExecutionStore.getState().appendResponseChunk('data')
    useExecutionStore.getState().clearResponse()
    expect(useExecutionStore.getState().responseBuffer).toBe('')
  })

  it('addLog prepends a log with generated UUID', () => {
    useExecutionStore.getState().addLog({
      workflowId: 'w1',
      promptId: 'p1',
      status: 'completed',
      durationMs: 100,
      tokensIn: 10,
      tokensOut: 20,
      createdAt: '2025-01-01',
    })
    const logs = useExecutionStore.getState().recentLogs
    expect(logs).toHaveLength(1)
    expect(logs[0].id).toBeDefined()
    expect(logs[0].id.length).toBeGreaterThan(0)
    expect(logs[0].workflowId).toBe('w1')
    expect(logs[0].durationMs).toBe(100)
  })

  it('addLog caps recentLogs at 100 entries', () => {
    for (let i = 0; i < 110; i++) {
      useExecutionStore.getState().addLog({
        workflowId: 'w1',
        promptId: 'p1',
        status: 'completed',
        durationMs: i,
        tokensIn: 0,
        tokensOut: 0,
        createdAt: '2025-01-01',
      })
    }
    expect(useExecutionStore.getState().recentLogs).toHaveLength(100)
    const lastLog = useExecutionStore.getState().recentLogs[99]
    expect(lastLog.durationMs).toBe(10)
  })

  it('resetExecution restores initial state', () => {
    useExecutionStore.getState().setActiveWorkflow('w1')
    useExecutionStore.getState().setExecutionStatus('running')
    useExecutionStore.getState().appendResponseChunk('data')
    useExecutionStore.getState().resetExecution()
    const state = useExecutionStore.getState()
    expect(state.activeWorkflowId).toBeNull()
    expect(state.executionStatus).toBe('idle')
    expect(state.responseBuffer).toBe('')
    expect(state.recentLogs).toEqual([])
  })
})
