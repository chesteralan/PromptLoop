import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardPage } from '../Dashboard'

const { mockNavigate, mockUseWorkflows, mockUseExecutions, mockDeleteWorkflow, mockToast } =
  vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockUseWorkflows: vi.fn(),
    mockUseExecutions: vi.fn(),
    mockDeleteWorkflow: vi.fn(),
    mockToast: { success: vi.fn(), error: vi.fn() },
  }))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('sonner', () => ({ toast: mockToast }))

vi.mock('../../hooks/useWorkflows', () => ({
  useWorkflows: () => mockUseWorkflows(),
  useDeleteWorkflow: () => ({ mutateAsync: mockDeleteWorkflow }),
}))

vi.mock('../../hooks/useExecutions', () => ({
  useExecutions: () => mockUseExecutions(),
}))

vi.mock('../../components/shared/SkeletonCard', () => ({
  SkeletonCard: () => <div data-testid="skeleton-card" />,
}))

vi.mock('../../components/shared/ConfirmDialog', () => ({
  ConfirmDialog: vi.fn(
    ({
      open,
      onConfirm,
      onCancel,
    }: {
      open: boolean
      onConfirm: () => void
      onCancel: () => void
    }) =>
      open ? (
        <div data-testid="confirm-dialog">
          <button onClick={onConfirm}>Confirm Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      ) : null,
  ),
}))

vi.mock('../../components/workflow/WorkflowCard', () => ({
  WorkflowCard: vi.fn(
    ({
      _id,
      name,
      status,
      onStart,
      onStop,
      onEdit,
      onDelete,
    }: {
      _id: string
      name: string
      status: string
      onStart: () => void
      onStop: () => void
      onEdit: () => void
      onDelete: () => void
    }) => (
      <div data-testid="workflow-card" data-status={status}>
        <span>{name}</span>
        <button onClick={onStart}>Start</button>
        <button onClick={onStop}>Stop</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    ),
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('DashboardPage', () => {
  it('shows skeleton cards while loading workflows', () => {
    mockUseWorkflows.mockReturnValue({ data: undefined, isLoading: true })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    expect(screen.getAllByTestId('skeleton-card').length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no workflows', () => {
    mockUseWorkflows.mockReturnValue({ data: [], isLoading: false })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    expect(screen.getByText('No workflows yet')).toBeInTheDocument()
    expect(screen.getByText('Create Workflow')).toBeInTheDocument()
  })

  it('renders workflow cards when workflows exist', () => {
    mockUseWorkflows.mockReturnValue({
      data: [
        { id: '1', name: 'WF 1', status: 'idle', loopMode: 'single' },
        { id: '2', name: 'WF 2', status: 'running', loopMode: 'loop' },
      ],
      isLoading: false,
    })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    const cards = screen.getAllByTestId('workflow-card')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('WF 1')).toBeInTheDocument()
    expect(screen.getByText('WF 2')).toBeInTheDocument()
  })

  it('computed stats: shows correct values', () => {
    const today = new Date()
    mockUseWorkflows.mockReturnValue({
      data: [
        { id: '1', name: 'W1', status: 'running', loopMode: 'single' },
        { id: '2', name: 'W2', status: 'idle', loopMode: 'single' },
      ],
      isLoading: false,
    })
    mockUseExecutions.mockReturnValue({
      data: [
        { id: 'e1', status: 'completed', createdAt: today },
        { id: 'e2', status: 'completed', createdAt: today },
        { id: 'e3', status: 'failed', createdAt: today },
      ],
    })
    render(<DashboardPage />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
    const ones = screen.getAllByText('1')
    expect(ones.length).toBe(2)
  })

  it('computed stats: success rate with no runs is 0%', () => {
    mockUseWorkflows.mockReturnValue({ data: [], isLoading: false })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('navigates to new workflow on create', () => {
    mockUseWorkflows.mockReturnValue({ data: [], isLoading: false, isPending: false })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    fireEvent.click(screen.getByText('Create Workflow'))
    expect(mockNavigate).toHaveBeenCalledWith('/workflows/new')
  })

  it('navigates to execute on start', () => {
    mockUseWorkflows.mockReturnValue({
      data: [{ id: '1', name: 'W1', status: 'idle', loopMode: 'single' }],
      isLoading: false,
    })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    fireEvent.click(screen.getAllByText('Start')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/workflows/1/execute')
  })

  it('navigates to edit on edit', () => {
    mockUseWorkflows.mockReturnValue({
      data: [{ id: '1', name: 'W1', status: 'idle', loopMode: 'single' }],
      isLoading: false,
    })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    fireEvent.click(screen.getAllByText('Edit')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/workflows/1')
  })

  it('shows confirm dialog on delete and deletes on confirm', async () => {
    mockDeleteWorkflow.mockResolvedValue(undefined)
    mockUseWorkflows.mockReturnValue({
      data: [{ id: '1', name: 'W1', status: 'idle', loopMode: 'single' }],
      isLoading: false,
    })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    fireEvent.click(screen.getAllByText('Delete')[0])
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Confirm Delete'))
    expect(mockDeleteWorkflow).toHaveBeenCalledWith('1')
    await vi.waitFor(() => expect(mockToast.success).toHaveBeenCalledWith('Workflow deleted'))
  })

  it('shows error toast on delete failure', async () => {
    mockDeleteWorkflow.mockRejectedValue(new Error('fail'))
    mockUseWorkflows.mockReturnValue({
      data: [{ id: '1', name: 'W1', status: 'idle', loopMode: 'single' }],
      isLoading: false,
    })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    fireEvent.click(screen.getAllByText('Delete')[0])
    fireEvent.click(screen.getByText('Confirm Delete'))
    await vi.waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete workflow'),
    )
  })

  it('renders stat cards with correct labels', () => {
    mockUseWorkflows.mockReturnValue({ data: [], isLoading: false })
    mockUseExecutions.mockReturnValue({ data: [] })
    render(<DashboardPage />)
    expect(screen.getByText('Total Runs')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
    expect(screen.getByText('Active Now')).toBeInTheDocument()
    expect(screen.getByText('Failed Today')).toBeInTheDocument()
  })
})
