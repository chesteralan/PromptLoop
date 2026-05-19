import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExecutionViewerPage } from '../ExecutionViewer'

const {
  mockNavigate,
  mockWorkflow,
  mockPrompts,
  mockWorkflowControl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockSetExecutionStatus,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockClearResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockResetExecution,
  mockStoreState,
  mockUseExecutionStore,
} = vi.hoisted(() => {
  const storeState: Record<string, unknown> = {
    executionStatus: 'idle',
    responseBuffer: '',
    loopIteration: 0,
    recentLogs: [],
    clearResponse: vi.fn(),
    resetExecution: vi.fn(),
    setExecutionStatus: vi.fn(),
  }
  const storeFn = vi.fn((selector: (s: typeof storeState) => unknown) => selector(storeState))
  storeFn.getState = vi.fn(() => storeState)
  return {
    mockNavigate: vi.fn(),
    mockWorkflow: vi.fn(),
    mockPrompts: vi.fn(),
    mockWorkflowControl: {
      startWorkflow: vi.fn(),
      pauseWorkflow: vi.fn(),
      stopWorkflow: vi.fn(),
      retryWorkflow: vi.fn(),
    },
    mockSetExecutionStatus: storeState.setExecutionStatus as ReturnType<typeof vi.fn>,
    mockClearResponse: storeState.clearResponse as ReturnType<typeof vi.fn>,
    mockResetExecution: storeState.resetExecution as ReturnType<typeof vi.fn>,
    mockStoreState: storeState,
    mockUseExecutionStore: storeFn,
  }
})

vi.mock('react-router-dom', () => ({
  useParams: () => ({ workflowId: 'wf-1' }),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../store/executionStore', () => ({
  useExecutionStore: mockUseExecutionStore,
}))

vi.mock('../../hooks/useWorkflows', () => ({
  useWorkflow: () => mockWorkflow(),
}))

vi.mock('../../hooks/usePrompts', () => ({
  usePrompts: () => mockPrompts(),
}))

vi.mock('../../hooks/useIpc', () => ({
  useWorkflowControl: () => mockWorkflowControl,
  useExecutionListener: () => {},
}))

vi.mock('../../components/shared/SkeletonCard', () => ({
  SkeletonCard: () => <div data-testid="skeleton-card" />,
}))

vi.mock('../../components/execution/ExecutionControls', () => ({
  ExecutionControls: vi.fn(
    ({
      status,
      onStart,
      onPause,
      onStop,
      onRetry,
    }: {
      status: string
      onStart: () => void
      onPause: () => void
      onStop: () => void
      onRetry: () => void
    }) => (
      <div data-testid="execution-controls" data-status={status}>
        <button onClick={onStart}>Start</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onStop}>Stop</button>
        <button onClick={onRetry}>Retry</button>
      </div>
    ),
  ),
}))

vi.mock('../../components/workflow/PromptProgressBar', () => ({
  PromptProgressBar: vi.fn(() => <div data-testid="prompt-progress-bar" />),
}))

vi.mock('../../components/execution/StreamingText', () => ({
  StreamingText: vi.fn(() => <div data-testid="streaming-text" />),
}))

vi.mock('../../components/workflow/QueueItem', () => ({
  QueueItem: vi.fn(() => <div data-testid="queue-item" />),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockStoreState.executionStatus = 'idle'
  mockStoreState.responseBuffer = ''
  mockStoreState.loopIteration = 0
  mockStoreState.recentLogs = []
})

describe('ExecutionViewerPage', () => {
  it('shows skeleton cards while workflow is loading', () => {
    mockWorkflow.mockReturnValue({ data: undefined, isLoading: true })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    expect(screen.getAllByTestId('skeleton-card').length).toBeGreaterThanOrEqual(1)
  })

  it('renders workflow name in header', () => {
    mockWorkflow.mockReturnValue({ data: { name: 'Test WF' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    expect(screen.getByText('Test WF')).toBeInTheDocument()
  })

  it('shows idle status badge', () => {
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    expect(screen.getByText('idle')).toBeInTheDocument()
  })

  it('shows no enabled prompts message when idle and no prompts', () => {
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    expect(screen.getByText('No enabled prompts in this workflow.')).toBeInTheDocument()
  })

  it('shows progress bar and streaming when not idle', () => {
    mockStoreState.executionStatus = 'running'
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [{ id: 'p1', title: 'P1', enabled: true }] })
    render(<ExecutionViewerPage />)
    expect(screen.getByTestId('prompt-progress-bar')).toBeInTheDocument()
    expect(screen.getByTestId('streaming-text')).toBeInTheDocument()
    expect(screen.getByTestId('execution-controls')).toBeInTheDocument()
  })

  it('hides idle message when not idle', () => {
    mockStoreState.executionStatus = 'running'
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [{ id: 'p1', title: 'P1', enabled: true }] })
    render(<ExecutionViewerPage />)
    expect(screen.queryByText('No enabled prompts in this workflow.')).not.toBeInTheDocument()
  })

  it('startWorkflow calls control.startWorkflow and sets status', async () => {
    mockWorkflowControl.startWorkflow.mockResolvedValue(undefined)
    mockWorkflow.mockReturnValue({ data: { name: 'Test', loopMode: 'single' }, isLoading: false })
    mockPrompts.mockReturnValue({
      data: [
        { id: 'p1', title: 'P1', content: 'hello', model: 'gpt-4o', position: 0, enabled: true },
      ],
    })
    render(<ExecutionViewerPage />)
    fireEvent.click(screen.getByText('Start'))
    expect(mockWorkflowControl.startWorkflow).toHaveBeenCalledWith(
      'wf-1',
      expect.objectContaining({
        id: 'wf-1',
        name: 'Test',
        loopMode: 'single',
      }),
    )
    await vi.waitFor(() => {
      expect(mockStoreState.setExecutionStatus).toHaveBeenCalledWith('running')
    })
  })

  it('pauseWorkflow calls control.pauseWorkflow and sets status', async () => {
    mockWorkflowControl.pauseWorkflow.mockResolvedValue(undefined)
    mockStoreState.executionStatus = 'running'
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    fireEvent.click(screen.getByText('Pause'))
    expect(mockWorkflowControl.pauseWorkflow).toHaveBeenCalledWith('wf-1')
    await vi.waitFor(() => {
      expect(mockStoreState.setExecutionStatus).toHaveBeenCalledWith('paused')
    })
  })

  it('stopWorkflow calls control.stopWorkflow and sets status', async () => {
    mockWorkflowControl.stopWorkflow.mockResolvedValue(undefined)
    mockStoreState.executionStatus = 'running'
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    fireEvent.click(screen.getByText('Stop'))
    expect(mockWorkflowControl.stopWorkflow).toHaveBeenCalledWith('wf-1')
    await vi.waitFor(() => {
      expect(mockStoreState.setExecutionStatus).toHaveBeenCalledWith('stopped')
    })
  })

  it('retryWorkflow calls control.retryWorkflow and resets state', async () => {
    mockWorkflowControl.retryWorkflow.mockResolvedValue(undefined)
    mockStoreState.executionStatus = 'stopped'
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    fireEvent.click(screen.getByText('Retry'))
    expect(mockWorkflowControl.retryWorkflow).toHaveBeenCalledWith('wf-1')
    await vi.waitFor(() => {
      expect(mockStoreState.setExecutionStatus).toHaveBeenCalledWith('idle')
    })
    expect(mockStoreState.clearResponse).toHaveBeenCalled()
  })

  it('shows loop iteration badge when > 0', () => {
    mockStoreState.executionStatus = 'running'
    mockStoreState.loopIteration = 2
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    expect(screen.getByText('Loop 3')).toBeInTheDocument()
  })

  it('renders QueueItems for enabled prompts during execution', () => {
    mockStoreState.executionStatus = 'running'
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({
      data: [
        { id: 'p1', title: 'P1', enabled: true },
        { id: 'p2', title: 'P2', enabled: false },
        { id: 'p3', title: 'P3', enabled: true },
      ],
    })
    render(<ExecutionViewerPage />)
    const items = screen.getAllByTestId('queue-item')
    expect(items).toHaveLength(2)
  })

  it('shows clear button when logs exist', () => {
    mockStoreState.executionStatus = 'running'
    mockStoreState.recentLogs = [
      { id: 'l1', promptId: 'p1', status: 'completed', durationMs: 100 } as any,
    ]
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('clear button calls resetExecution', () => {
    mockStoreState.executionStatus = 'running'
    mockStoreState.recentLogs = [
      { id: 'l1', promptId: 'p1', status: 'completed', durationMs: 100 } as any,
    ]
    mockWorkflow.mockReturnValue({ data: { name: 'Test' }, isLoading: false })
    mockPrompts.mockReturnValue({ data: [] })
    render(<ExecutionViewerPage />)
    fireEvent.click(screen.getByText('Clear'))
    expect(mockStoreState.resetExecution).toHaveBeenCalled()
  })
})
