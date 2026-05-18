import { describe, it, expect, beforeEach } from 'vitest'
import { useExecutionStore } from '../store/executionStore'
import { useWorkflowStore } from '../store/workflowStore'
import { useSettingsStore } from '../store/settingsStore'

describe('executionStore', () => {
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

  it('sets active workflow', () => {
    useExecutionStore.getState().setActiveWorkflow('wf-1')
    expect(useExecutionStore.getState().activeWorkflowId).toBe('wf-1')
  })

  it('sets execution status', () => {
    useExecutionStore.getState().setExecutionStatus('running')
    expect(useExecutionStore.getState().executionStatus).toBe('running')
  })

  it('appends response chunks', () => {
    useExecutionStore.getState().appendResponseChunk('Hello ')
    useExecutionStore.getState().appendResponseChunk('World')
    expect(useExecutionStore.getState().responseBuffer).toBe('Hello World')
  })

  it('clears response', () => {
    useExecutionStore.getState().appendResponseChunk('data')
    useExecutionStore.getState().clearResponse()
    expect(useExecutionStore.getState().responseBuffer).toBe('')
  })

  it('adds logs capped at 100', () => {
    for (let i = 0; i < 105; i++) {
      useExecutionStore.getState().addLog({
        workflowId: 'wf-1',
        promptId: 'p-1',
        status: 'completed',
        durationMs: 100,
        tokensIn: 50,
        tokensOut: 50,
        createdAt: new Date().toISOString(),
      })
    }
    expect(useExecutionStore.getState().recentLogs.length).toBe(100)
  })
})

describe('workflowStore', () => {
  beforeEach(() => {
    useWorkflowStore.setState({
      workflows: [],
      activeWorkflowId: null,
    })
  })

  it('sets workflows', () => {
    const workflows = [
      { id: '1', name: 'Test', status: 'idle' as const, createdAt: '', updatedAt: '' },
    ]
    useWorkflowStore.getState().setWorkflows(workflows)
    expect(useWorkflowStore.getState().workflows).toEqual(workflows)
  })

  it('adds workflow', () => {
    const wf = { id: '1', name: 'Test', status: 'idle' as const, createdAt: '', updatedAt: '' }
    useWorkflowStore.getState().addWorkflow(wf)
    expect(useWorkflowStore.getState().workflows).toHaveLength(1)
  })

  it('updates workflow', () => {
    useWorkflowStore.setState({
      workflows: [{ id: '1', name: 'Old', status: 'idle' as const, createdAt: '', updatedAt: '' }],
    })
    useWorkflowStore.getState().updateWorkflow('1', { name: 'Updated' })
    expect(useWorkflowStore.getState().workflows[0].name).toBe('Updated')
  })

  it('removes workflow', () => {
    useWorkflowStore.setState({
      workflows: [
        { id: '1', name: 'A', status: 'idle' as const, createdAt: '', updatedAt: '' },
        { id: '2', name: 'B', status: 'idle' as const, createdAt: '', updatedAt: '' },
      ],
    })
    useWorkflowStore.getState().removeWorkflow('1')
    expect(useWorkflowStore.getState().workflows).toHaveLength(1)
    expect(useWorkflowStore.getState().workflows[0].id).toBe('2')
  })

  it('sets active workflow', () => {
    useWorkflowStore.getState().setActiveWorkflow('wf-1')
    expect(useWorkflowStore.getState().activeWorkflowId).toBe('wf-1')
  })
})

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      theme: 'system',
      windowMode: 'full',
      minimizeToTrayOnClose: false,
      notificationsEnabled: true,
      startOnBoot: false,
      user: null,
    })
  })

  it('sets theme', () => {
    useSettingsStore.getState().setTheme('dark')
    expect(useSettingsStore.getState().theme).toBe('dark')
  })

  it('sets window mode', () => {
    useSettingsStore.getState().setWindowMode('compact')
    expect(useSettingsStore.getState().windowMode).toBe('compact')
  })

  it('toggles minimize to tray', () => {
    useSettingsStore.getState().toggleMinimizeToTray()
    expect(useSettingsStore.getState().minimizeToTrayOnClose).toBe(true)
    useSettingsStore.getState().toggleMinimizeToTray()
    expect(useSettingsStore.getState().minimizeToTrayOnClose).toBe(false)
  })

  it('toggles notifications', () => {
    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false)
  })

  it('sets start on boot', () => {
    useSettingsStore.getState().setStartOnBoot(true)
    expect(useSettingsStore.getState().startOnBoot).toBe(true)
  })

  it('sets and clears user', () => {
    const mockUser = { uid: 'abc', email: 'test@example.com' }
    useSettingsStore.getState().setUser(mockUser)
    expect(useSettingsStore.getState().user).toEqual(mockUser)

    useSettingsStore.getState().clearUser()
    expect(useSettingsStore.getState().user).toBeNull()
  })
})
