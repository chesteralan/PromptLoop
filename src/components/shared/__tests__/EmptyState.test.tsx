import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

vi.mock('../../ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}))

const MockIcon = () => <svg data-testid="icon" />

describe('EmptyState', () => {
  it('renders icon and title', () => {
    render(<EmptyState icon={MockIcon} title="No results found" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <EmptyState icon={MockIcon} title="No results" description="Try adjusting your search." />,
    )
    expect(screen.getByText('Try adjusting your search.')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(<EmptyState icon={MockIcon} title="No results" />)
    expect(screen.queryByText('Try adjusting your search.')).not.toBeInTheDocument()
  })

  it('renders action button when actionLabel and onAction are provided', () => {
    const onAction = vi.fn()
    render(
      <EmptyState
        icon={MockIcon}
        title="No workflows"
        actionLabel="Create Workflow"
        onAction={onAction}
      />,
    )
    expect(screen.getByText('Create Workflow')).toBeInTheDocument()
  })

  it('does not render action button when actionLabel is missing', () => {
    render(<EmptyState icon={MockIcon} title="No workflows" onAction={vi.fn()} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('does not render action button when onAction is missing', () => {
    render(<EmptyState icon={MockIcon} title="No workflows" actionLabel="Create" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('fires onAction when action button is clicked', () => {
    const onAction = vi.fn()
    render(
      <EmptyState icon={MockIcon} title="No workflows" actionLabel="Create" onAction={onAction} />,
    )
    fireEvent.click(screen.getByText('Create'))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
