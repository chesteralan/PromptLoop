import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExecutionControls } from '../ExecutionControls'

vi.mock('../../ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}))

describe('ExecutionControls', () => {
  const handlers = { onStart: vi.fn(), onPause: vi.fn(), onStop: vi.fn(), onRetry: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows Start button when idle', () => {
    render(<ExecutionControls status="idle" {...handlers} />)
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.queryByText('Pause')).not.toBeInTheDocument()
    expect(screen.queryByText('Stop')).not.toBeInTheDocument()
    expect(screen.queryByText('Resume')).not.toBeInTheDocument()
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('shows Pause + Stop when running', () => {
    render(<ExecutionControls status="running" {...handlers} />)
    expect(screen.getByText('Pause')).toBeInTheDocument()
    expect(screen.getByText('Stop')).toBeInTheDocument()
    expect(screen.queryByText('Start')).not.toBeInTheDocument()
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('shows Resume + Stop when paused', () => {
    render(<ExecutionControls status="paused" {...handlers} />)
    expect(screen.getByText('Resume')).toBeInTheDocument()
    expect(screen.getByText('Stop')).toBeInTheDocument()
    expect(screen.queryByText('Start')).not.toBeInTheDocument()
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('shows Retry when stopped', () => {
    render(<ExecutionControls status="stopped" {...handlers} />)
    expect(screen.getByText('Retry')).toBeInTheDocument()
    expect(screen.queryByText('Start')).not.toBeInTheDocument()
    expect(screen.queryByText('Pause')).not.toBeInTheDocument()
  })

  it('shows Retry when error', () => {
    render(<ExecutionControls status="error" {...handlers} />)
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('disables buttons when loading', () => {
    render(<ExecutionControls status="idle" {...handlers} loading={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('fires onStart when Start clicked', () => {
    render(<ExecutionControls status="idle" {...handlers} />)
    fireEvent.click(screen.getByText('Start'))
    expect(handlers.onStart).toHaveBeenCalledOnce()
  })

  it('fires onPause when Pause clicked', () => {
    render(<ExecutionControls status="running" {...handlers} />)
    fireEvent.click(screen.getByText('Pause'))
    expect(handlers.onPause).toHaveBeenCalledOnce()
  })

  it('fires onStop when Stop clicked', () => {
    render(<ExecutionControls status="running" {...handlers} />)
    fireEvent.click(screen.getByText('Stop'))
    expect(handlers.onStop).toHaveBeenCalledOnce()
  })

  it('fires onRetry when Retry clicked', () => {
    render(<ExecutionControls status="stopped" {...handlers} />)
    fireEvent.click(screen.getByText('Retry'))
    expect(handlers.onRetry).toHaveBeenCalledOnce()
  })

  it('sets aria-busy on container when loading', () => {
    const { container } = render(<ExecutionControls status="idle" {...handlers} loading={true} />)
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
  })
})
