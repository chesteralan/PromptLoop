import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddPromptButton } from '../AddPromptButton'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}))

describe('AddPromptButton', () => {
  it('renders Add Prompt label', () => {
    render(<AddPromptButton onClick={vi.fn()} />)
    expect(screen.getByText('Add Prompt')).toBeInTheDocument()
  })

  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    render(<AddPromptButton onClick={onClick} />)
    fireEvent.click(screen.getByText('Add Prompt'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<AddPromptButton onClick={vi.fn()} disabled={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is enabled when disabled prop is false', () => {
    render(<AddPromptButton onClick={vi.fn()} disabled={false} />)
    expect(screen.getByRole('button')).toBeEnabled()
  })
})
