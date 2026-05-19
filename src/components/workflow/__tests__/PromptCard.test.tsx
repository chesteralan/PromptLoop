import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PromptCard } from '../PromptCard'

const mockPrompt = {
  id: 'p1',
  workflowId: 'w1',
  title: 'Test Prompt',
  content: 'Hello',
  model: 'gpt-4',
  position: 0,
  enabled: true,
  temperature: 0.7,
  maxTokens: 2048,
  delayMs: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

vi.mock('@hello-pangea/dnd', () => ({
  Draggable: ({ children }: any) => {
    const provided = {
      innerRef: vi.fn(),
      draggableProps: { 'data-testid': 'draggable' },
      dragHandleProps: { 'data-testid': 'drag-handle' },
    }
    const snapshot = { isDragging: false, isDropAnimating: false }
    return children(provided, snapshot)
  },
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, className, onClick, 'aria-label': ariaLabel }: any) => (
    <button
      className={className}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={className} data-variant={variant}>
      {children}
    </span>
  ),
}))

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, size }: any) => (
    <button
      role="switch"
      aria-checked={checked}
      data-size={size}
      data-testid="switch"
      onClick={() => onCheckedChange?.(!checked)}
    />
  ),
}))

vi.mock('@/components/shared/ConfirmDialog', () => ({
  ConfirmDialog: ({ open, title, message, confirmLabel, variant, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="confirm-dialog" data-variant={variant}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button data-testid="confirm-btn" onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button data-testid="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ) : null,
}))

describe('PromptCard', () => {
  const baseHandlers = {
    onSelect: vi.fn(),
    onToggle: vi.fn(),
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders prompt title and model badge', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    expect(screen.getByText('Test Prompt')).toBeInTheDocument()
    expect(screen.getByText('gpt-4')).toBeInTheDocument()
  })

  it('renders position number', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders drag handle', () => {
    const { container } = render(
      <PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />,
    )
    expect(container.querySelector('[data-testid="drag-handle"]')).toBeInTheDocument()
  })

  it('shows switch with checked state', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onToggle when switch clicked', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(baseHandlers.onToggle).toHaveBeenCalledWith(false)
  })

  it('calls onSelect when edit button clicked', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    fireEvent.click(screen.getByLabelText('Edit Test Prompt'))
    expect(baseHandlers.onSelect).toHaveBeenCalledTimes(1)
  })

  it('shows delete dialog when delete button clicked', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Delete Test Prompt'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Prompt')).toBeInTheDocument()
  })

  it('calls onDelete when delete confirmed', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    fireEvent.click(screen.getByLabelText('Delete Test Prompt'))
    fireEvent.click(screen.getByTestId('confirm-btn'))
    expect(baseHandlers.onDelete).toHaveBeenCalledTimes(1)
  })

  it('hides delete dialog when cancel clicked', () => {
    render(<PromptCard prompt={mockPrompt} index={0} isSelected={false} {...baseHandlers} />)
    fireEvent.click(screen.getByLabelText('Delete Test Prompt'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('cancel-btn'))
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument()
  })
})
