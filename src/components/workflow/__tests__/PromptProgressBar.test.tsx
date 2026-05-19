import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PromptProgressBar } from '../PromptProgressBar'

describe('PromptProgressBar', () => {
  it('returns null for empty prompts array', () => {
    const { container } = render(<PromptProgressBar prompts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a button for each prompt', () => {
    const prompts = [
      { id: 'p1', title: 'Prompt 1', status: 'pending' as const },
      { id: 'p2', title: 'Prompt 2', status: 'completed' as const },
    ]
    render(<PromptProgressBar prompts={prompts} />)
    expect(screen.getByText('Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Prompt 2')).toBeInTheDocument()
  })

  it('fires onSegmentClick with prompt id', () => {
    const onClick = vi.fn()
    const prompts = [{ id: 'p1', title: 'Test', status: 'pending' as const }]
    render(<PromptProgressBar prompts={prompts} onSegmentClick={onClick} />)
    fireEvent.click(screen.getByText('Test'))
    expect(onClick).toHaveBeenCalledWith('p1')
  })

  it('renders running status with pulse animation class', () => {
    const prompts = [{ id: 'p1', title: 'Running', status: 'running' as const }]
    const { container } = render(<PromptProgressBar prompts={prompts} />)
    const btn = container.querySelector('button')
    expect(btn?.className).toContain('animate-pulse')
  })

  it('renders completed status with green color', () => {
    const prompts = [{ id: 'p1', title: 'Done', status: 'completed' as const }]
    const { container } = render(<PromptProgressBar prompts={prompts} />)
    const btn = container.querySelector('button')
    expect(btn?.className).toContain('bg-green-500')
  })
})
