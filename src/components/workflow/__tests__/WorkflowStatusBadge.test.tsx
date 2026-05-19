import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkflowStatusBadge } from '../WorkflowStatusBadge'

describe('WorkflowStatusBadge', () => {
  const cases = [
    { status: 'idle', label: 'Idle' },
    { status: 'running', label: 'Running' },
    { status: 'paused', label: 'Paused' },
    { status: 'completed', label: 'Completed' },
    { status: 'error', label: 'Error' },
    { status: 'stopped', label: 'Stopped' },
  ] as const

  it.each(cases)('shows $label for $status status', ({ status, label }) => {
    render(<WorkflowStatusBadge status={status as any} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('falls back to status as label for unknown status', () => {
    render(<WorkflowStatusBadge status={'unknown' as any} />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })

  it('shows pulse animation for running status', () => {
    const { container } = render(<WorkflowStatusBadge status="running" />)
    const dot = container.querySelector('span > span')
    expect(dot?.className).toContain('animate-pulse')
  })

  it('shows static dot for non-running status', () => {
    const { container } = render(<WorkflowStatusBadge status="idle" />)
    const dot = container.querySelector('span > span')
    expect(dot?.className).not.toContain('animate-pulse')
  })
})
