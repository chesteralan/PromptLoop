import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkflowCard } from '../WorkflowCard'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, className, onClick }: any) => (
    <button className={className} data-variant={variant} data-size={size} onClick={onClick}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

vi.mock('@/components/workflow/WorkflowStatusBadge', () => ({
  WorkflowStatusBadge: ({ status }: any) => <span data-testid="status-badge">{status}</span>,
}))

describe('WorkflowCard', () => {
  const baseProps = {
    id: '1',
    name: 'Test Workflow',
    status: 'idle' as const,
    promptCount: 3,
    onStart: vi.fn(),
    onStop: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders workflow name and status badge', () => {
    render(<WorkflowCard {...baseProps} />)
    expect(screen.getByText('Test Workflow')).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent('idle')
  })

  it('shows prompt count with plural', () => {
    render(<WorkflowCard {...baseProps} promptCount={3} />)
    expect(screen.getByText('3 prompts')).toBeInTheDocument()
  })

  it('shows prompt count without plural for 1', () => {
    render(<WorkflowCard {...baseProps} promptCount={1} />)
    expect(screen.getByText('1 prompt')).toBeInTheDocument()
  })

  it('shows loop mode when provided', () => {
    render(<WorkflowCard {...baseProps} loopMode="infinite" />)
    expect(screen.getByText('· infinite')).toBeInTheDocument()
  })

  it('hides loop mode when not provided', () => {
    render(<WorkflowCard {...baseProps} />)
    expect(screen.queryByText(/·/)).not.toBeInTheDocument()
  })

  it('shows Start button when idle', () => {
    render(<WorkflowCard {...baseProps} status="idle" />)
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.queryByText('Stop')).not.toBeInTheDocument()
  })

  it('shows Stop button when running', () => {
    render(<WorkflowCard {...baseProps} status="running" />)
    expect(screen.getByText('Stop')).toBeInTheDocument()
    expect(screen.queryByText('Start')).not.toBeInTheDocument()
  })

  it('does not show Start or Stop for other statuses', () => {
    const statuses = ['paused', 'completed', 'error', 'stopped'] as const
    for (const status of statuses) {
      const { unmount } = render(<WorkflowCard {...baseProps} status={status} />)
      expect(screen.queryByText('Start')).not.toBeInTheDocument()
      expect(screen.queryByText('Stop')).not.toBeInTheDocument()
      unmount()
    }
  })

  it('renders Edit button for all statuses', () => {
    render(<WorkflowCard {...baseProps} status="completed" />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('renders Delete button', () => {
    render(<WorkflowCard {...baseProps} />)
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
  })

  it('fires onStart when Start clicked', () => {
    render(<WorkflowCard {...baseProps} status="idle" />)
    fireEvent.click(screen.getByText('Start'))
    expect(baseProps.onStart).toHaveBeenCalledTimes(1)
  })

  it('fires onStop when Stop clicked', () => {
    render(<WorkflowCard {...baseProps} status="running" />)
    fireEvent.click(screen.getByText('Stop'))
    expect(baseProps.onStop).toHaveBeenCalledTimes(1)
  })

  it('fires onEdit when Edit clicked', () => {
    render(<WorkflowCard {...baseProps} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(baseProps.onEdit).toHaveBeenCalledTimes(1)
  })
})
