import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkflowEditorPage } from '../WorkflowEditor'

const {
  mockNavigate,
  mockUseWorkflow,
  mockUsePrompts,
  mockCreateWorkflow,
  mockUpdateWorkflow,
  mockDeleteWorkflow,
  mockCreatePrompt,
  mockUpdatePrompt,
  mockDeletePrompt,
  mockReorderPrompts,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseWorkflow: vi.fn(),
  mockUsePrompts: vi.fn(),
  mockCreateWorkflow: { mutateAsync: vi.fn(), isPending: false },
  mockUpdateWorkflow: { mutateAsync: vi.fn() },
  mockDeleteWorkflow: { mutateAsync: vi.fn() },
  mockCreatePrompt: { mutateAsync: vi.fn(), isPending: false },
  mockUpdatePrompt: { mutate: vi.fn() },
  mockDeletePrompt: { mutate: vi.fn() },
  mockReorderPrompts: { mutate: vi.fn() },
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ workflowId: 'wf-1' }),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../hooks/useWorkflows', () => ({
  useWorkflow: () => mockUseWorkflow(),
  useCreateWorkflow: () => mockCreateWorkflow,
  useUpdateWorkflow: () => mockUpdateWorkflow,
  useDeleteWorkflow: () => mockDeleteWorkflow,
}))

vi.mock('../../hooks/usePrompts', () => ({
  usePrompts: () => mockUsePrompts(),
  useCreatePrompt: () => mockCreatePrompt,
  useUpdatePrompt: () => mockUpdatePrompt,
  useDeletePrompt: () => mockDeletePrompt,
  useReorderPrompts: () => mockReorderPrompts,
}))

vi.mock('../../hooks/useAutoSave', () => ({
  useAutoSave: () => {},
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

vi.mock('../../components/workflow/WorkflowSettings', () => ({
  WorkflowSettings: vi.fn(
    ({
      loopMode,
      maxIterations,
      onLoopModeChange,
      onMaxIterationsChange,
    }: {
      loopMode: string
      maxIterations?: number
      onLoopModeChange: (m: string) => void
      onMaxIterationsChange: (n: number | undefined) => void
    }) => (
      <div data-testid="workflow-settings">
        <span>loopMode: {loopMode}</span>
        <span>maxIterations: {maxIterations}</span>
        <button onClick={() => onLoopModeChange('loop')}>Set Loop Mode</button>
      </div>
    ),
  ),
}))

vi.mock('../../components/workflow/PromptList', () => ({
  PromptList: vi.fn(
    ({
      prompts,
      selectedId,
      onSelect,
      onToggle,
      onDelete,
      onReorder,
    }: {
      prompts: { id: string; title: string; enabled: boolean }[]
      selectedId: string | null
      onSelect: (id: string) => void
      onToggle: (id: string, enabled: boolean) => void
      onDelete: (id: string) => void
      onReorder: (ids: string[]) => void
    }) => (
      <div data-testid="prompt-list">
        {prompts.map((p) => (
          <div key={p.id} data-testid="prompt-item">
            <span>{p.title}</span>
            <button onClick={() => onSelect(p.id)}>Select</button>
            <button onClick={() => onToggle(p.id, !p.enabled)}>Toggle</button>
            <button onClick={() => onDelete(p.id)}>Delete</button>
          </div>
        ))}
        <button onClick={() => onReorder(prompts.map((p) => p.id).reverse())}>Reorder</button>
      </div>
    ),
  ),
}))

vi.mock('../../components/workflow/PromptEditorPanel', () => ({
  PromptEditorPanel: vi.fn(
    ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) =>
      open ? (
        <div data-testid="prompt-editor-panel">
          <button onClick={() => onOpenChange(false)}>Close Editor</button>
        </div>
      ) : null,
  ),
}))

vi.mock('../../components/workflow/AddPromptButton', () => ({
  AddPromptButton: vi.fn(({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
    <button onClick={onClick} disabled={disabled} data-testid="add-prompt-button">
      Add Prompt
    </button>
  )),
}))

vi.mock('../../components/workflow/SaveButton', () => ({
  SaveButton: vi.fn(
    ({
      isSaving,
      disabled,
      onClick,
    }: {
      isSaving: boolean
      disabled: boolean
      onClick: () => void
    }) => (
      <button onClick={onClick} disabled={disabled} data-testid="save-button">
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    ),
  ),
}))

vi.mock('../../components/workflow/ImportExportButtons', () => ({
  ImportExportButtons: vi.fn(() => <div data-testid="import-export-buttons" />),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WorkflowEditorPage', () => {
  it('shows skeleton cards while workflow is loading', () => {
    mockUseWorkflow.mockReturnValue({ data: undefined, isLoading: true })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    expect(screen.getAllByTestId('skeleton-card').length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when workflow not found', () => {
    mockUseWorkflow.mockReturnValue({ data: undefined, isLoading: false })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    expect(screen.getByText('Workflow not found')).toBeInTheDocument()
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
  })

  it('renders workflow name for existing workflow', async () => {
    mockUseWorkflow.mockReturnValue({
      data: { name: 'My Workflow', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getByDisplayValue('My Workflow')).toBeInTheDocument()
    })
  })

  it('shows skeleton for prompts when promptsLoading', () => {
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single' },
      isLoading: false,
    })
    mockUsePrompts.mockReturnValue({ data: undefined, isLoading: true })
    render(<WorkflowEditorPage />)
    const skeletons = document.querySelectorAll('[data-testid="skeleton-card"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })

  it('saves existing workflow via update mutation', async () => {
    mockUpdateWorkflow.mutateAsync.mockResolvedValue(undefined)
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getByDisplayValue('WF')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('save-button'))
    expect(mockUpdateWorkflow.mutateAsync).toHaveBeenCalledWith({
      workflowId: 'wf-1',
      data: expect.objectContaining({ name: 'WF', loopMode: 'single' }),
    })
  })

  it('shows import/export and delete only for existing workflows', async () => {
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getByTestId('import-export-buttons')).toBeInTheDocument()
    })
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('deletes workflow and navigates to dashboard', async () => {
    mockDeleteWorkflow.mutateAsync.mockResolvedValue(undefined)
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.queryByText('Workflow not found')).not.toBeInTheDocument()
    })
    const deleteBtns = screen.getAllByText('Delete')
    fireEvent.click(deleteBtns[0])
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Confirm Delete'))
    expect(mockDeleteWorkflow.mutateAsync).toHaveBeenCalledWith('wf-1')
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('creates a prompt via mutation when add prompt is clicked', async () => {
    mockCreatePrompt.mutateAsync.mockResolvedValue('new-p-id')
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    mockUsePrompts.mockReturnValue({ data: [] })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getByTestId('add-prompt-button')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('add-prompt-button'))
    expect(mockCreatePrompt.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Prompt', model: 'gpt-4o', position: 0 }),
    )
    await vi.waitFor(() => {
      expect(screen.getByTestId('prompt-editor-panel')).toBeInTheDocument()
    })
  })

  it('deletes a prompt via mutation', async () => {
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    const prompts = [
      { id: 'p1', title: 'P1', position: 0, enabled: true, content: '', model: 'gpt-4o' },
    ]
    let firstCall = true
    mockUsePrompts.mockImplementation(() => {
      if (firstCall) {
        firstCall = false
        return { data: [] }
      }
      return { data: prompts }
    })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('P1')).toBeInTheDocument()
    })
    const deleteBtns = screen.getAllByText('Delete')
    fireEvent.click(deleteBtns[deleteBtns.length - 1])
    expect(mockDeletePrompt.mutate).toHaveBeenCalledWith('p1')
  })

  it('toggles prompt enabled state', async () => {
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    const prompts = [
      { id: 'p1', title: 'P1', position: 0, enabled: true, content: '', model: 'gpt-4o' },
    ]
    let firstCall = true
    mockUsePrompts.mockImplementation(() => {
      if (firstCall) {
        firstCall = false
        return { data: [] }
      }
      return { data: prompts }
    })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('P1')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Toggle'))
    expect(mockUpdatePrompt.mutate).toHaveBeenCalledWith({
      promptId: 'p1',
      data: { enabled: false },
    })
  })

  it('reorders prompts via mutation', async () => {
    mockUseWorkflow.mockReturnValue({
      data: { name: 'WF', loopMode: 'single', maxIterations: 1 },
      isLoading: false,
    })
    const prompts = [
      { id: 'p1', title: 'P1', position: 0, enabled: true, content: '', model: 'gpt-4o' },
      { id: 'p2', title: 'P2', position: 1, enabled: true, content: '', model: 'gpt-4o' },
    ]
    let firstCall = true
    mockUsePrompts.mockImplementation(() => {
      if (firstCall) {
        firstCall = false
        return { data: [] }
      }
      return { data: prompts }
    })
    render(<WorkflowEditorPage />)
    await vi.waitFor(() => {
      expect(screen.getAllByTestId('prompt-item')).toHaveLength(2)
    })
    fireEvent.click(screen.getByText('Reorder'))
    expect(mockReorderPrompts.mutate).toHaveBeenCalledWith(['p2', 'p1'])
  })
})
