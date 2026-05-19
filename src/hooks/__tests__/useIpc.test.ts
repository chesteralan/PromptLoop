import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useExecutionListener, useWorkflowControl } from '../useIpc'

const mockOnExecutionChunk = vi.fn()
const mockOnExecutionCompleted = vi.fn()
const mockOnExecutionFailed = vi.fn()
const mockOnWorkflowCompleted = vi.fn()

const mockSetExecutionStatus = vi.fn()
const mockAppendResponseChunk = vi.fn()
const mockClearResponse = vi.fn()
const mockAddLog = vi.fn()

const { useExecutionStore } = vi.hoisted(() => ({
  useExecutionStore: vi.fn(),
}))

vi.mock('../../store/executionStore', () => ({ useExecutionStore }))

beforeEach(() => {
  vi.clearAllMocks()
  useExecutionStore.mockImplementation((selector: (s: any) => any) =>
    selector({
      setExecutionStatus: mockSetExecutionStatus,
      appendResponseChunk: mockAppendResponseChunk,
      clearResponse: mockClearResponse,
      addLog: mockAddLog,
    }),
  )
  window.electronAPI = {
    onExecutionChunk: mockOnExecutionChunk,
    onExecutionCompleted: mockOnExecutionCompleted,
    onExecutionFailed: mockOnExecutionFailed,
    onWorkflowCompleted: mockOnWorkflowCompleted,
    startWorkflow: vi.fn(),
    pauseWorkflow: vi.fn(),
    stopWorkflow: vi.fn(),
    retryWorkflow: vi.fn(),
  } as any
})

describe('useExecutionListener', () => {
  it('subscribes to all 4 channels on mount', () => {
    const cleanupChunk = vi.fn()
    const cleanupCompleted = vi.fn()
    const cleanupFailed = vi.fn()
    const cleanupWorkflowDone = vi.fn()

    mockOnExecutionChunk.mockReturnValue(cleanupChunk)
    mockOnExecutionCompleted.mockReturnValue(cleanupCompleted)
    mockOnExecutionFailed.mockReturnValue(cleanupFailed)
    mockOnWorkflowCompleted.mockReturnValue(cleanupWorkflowDone)

    const { unmount } = renderHook(() => useExecutionListener())

    expect(mockOnExecutionChunk).toHaveBeenCalledOnce()
    expect(mockOnExecutionCompleted).toHaveBeenCalledOnce()
    expect(mockOnExecutionFailed).toHaveBeenCalledOnce()
    expect(mockOnWorkflowCompleted).toHaveBeenCalledOnce()

    unmount()

    expect(cleanupChunk).toHaveBeenCalledOnce()
    expect(cleanupCompleted).toHaveBeenCalledOnce()
    expect(cleanupFailed).toHaveBeenCalledOnce()
    expect(cleanupWorkflowDone).toHaveBeenCalledOnce()
  })

  it('calls appendResponseChunk on chunk event', () => {
    mockOnExecutionChunk.mockImplementation((cb) => {
      cb({ chunk: 'hello', workflowId: 'wf-1', promptId: 'p-1' })
      return vi.fn()
    })

    renderHook(() => useExecutionListener())
    expect(mockAppendResponseChunk).toHaveBeenCalledWith('hello')
  })

  it('adds completed log on completed event', () => {
    mockOnExecutionCompleted.mockImplementation((cb) => {
      cb({ workflowId: 'wf-1', promptId: 'p-1', durationMs: 500 })
      return vi.fn()
    })

    renderHook(() => useExecutionListener())
    expect(mockAddLog).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowId: 'wf-1',
        promptId: 'p-1',
        status: 'completed',
        durationMs: 500,
        tokensIn: 0,
        tokensOut: 0,
      }),
    )
  })

  it('adds failed log on failed event', () => {
    mockOnExecutionFailed.mockImplementation((cb) => {
      cb({ workflowId: 'wf-1', promptId: 'p-1', error: 'API error' })
      return vi.fn()
    })

    renderHook(() => useExecutionListener())
    expect(mockAddLog).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowId: 'wf-1',
        promptId: 'p-1',
        status: 'failed',
        error: 'API error',
      }),
    )
  })

  it('sets status to idle and clears response on workflow completed', () => {
    mockOnWorkflowCompleted.mockImplementation((cb) => {
      cb({ workflowId: 'wf-1' })
      return vi.fn()
    })

    renderHook(() => useExecutionListener())
    expect(mockSetExecutionStatus).toHaveBeenCalledWith('idle')
    expect(mockClearResponse).toHaveBeenCalled()
  })
})

describe('useWorkflowControl', () => {
  it('returns memoized callbacks wrapping window.electronAPI methods', () => {
    const { result } = renderHook(() => useWorkflowControl())

    result.current.startWorkflow('wf-1', { key: 'config' }, { openai: 'sk-key' })
    expect(window.electronAPI.startWorkflow).toHaveBeenCalledWith(
      'wf-1',
      { key: 'config' },
      { openai: 'sk-key' },
    )

    result.current.pauseWorkflow('wf-1')
    expect(window.electronAPI.pauseWorkflow).toHaveBeenCalledWith('wf-1')

    result.current.stopWorkflow('wf-1')
    expect(window.electronAPI.stopWorkflow).toHaveBeenCalledWith('wf-1')

    result.current.retryWorkflow('wf-1')
    expect(window.electronAPI.retryWorkflow).toHaveBeenCalledWith('wf-1')
  })
})
