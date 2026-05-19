import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueueItem } from '../QueueItem'

describe('QueueItem', () => {
  it('shows title', () => {
    render(<QueueItem title="My Prompt" status="pending" />)
    expect(screen.getByText('My Prompt')).toBeInTheDocument()
  })

  it('shows error text when error is present', () => {
    render(<QueueItem title="Failed" status="failed" error="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('does not show error text when error is absent', () => {
    render(<QueueItem title="Running" status="running" />)
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument()
  })

  it('shows durationMs when completed', () => {
    render(<QueueItem title="Done" status="completed" durationMs={1500} />)
    expect(screen.getByText('1500ms')).toBeInTheDocument()
  })

  it('does not show durationMs when completed but value absent', () => {
    render(<QueueItem title="Done" status="completed" />)
    expect(screen.queryByText('ms')).not.toBeInTheDocument()
  })

  it('applies active styling when isActive is true', () => {
    const { container } = render(<QueueItem title="Active" status="pending" isActive={true} />)
    const div = container.firstElementChild
    expect(div?.className).toContain('border-primary/50')
    expect(div?.className).toContain('bg-accent/50')
  })

  it('does not apply active styling when isActive is false', () => {
    const { container } = render(<QueueItem title="Inactive" status="pending" isActive={false} />)
    const div = container.firstElementChild
    expect(div?.className).not.toContain('border-primary/50')
  })

  it('applies destructive border when failed', () => {
    const { container } = render(<QueueItem title="Failed" status="failed" isActive={false} />)
    const div = container.firstElementChild
    expect(div?.className).toContain('border-destructive/30')
  })
})
