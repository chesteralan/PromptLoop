import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SaveButton } from '../SaveButton'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, size }: any) => (
    <button onClick={onClick} disabled={disabled} data-size={size}>
      {children}
    </button>
  ),
}))

describe('SaveButton', () => {
  it('shows Create label when isNew is true', () => {
    render(<SaveButton isNew={true} isSaving={false} onClick={vi.fn()} />)
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('shows Save label when isNew is false', () => {
    render(<SaveButton isNew={false} isSaving={false} onClick={vi.fn()} />)
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('shows Saving... when isSaving is true', () => {
    render(<SaveButton isNew={false} isSaving={true} onClick={vi.fn()} />)
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('is disabled when isSaving is true', () => {
    render(<SaveButton isNew={false} isSaving={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<SaveButton isNew={false} isSaving={false} disabled={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is enabled when neither disabled nor isSaving', () => {
    render(<SaveButton isNew={false} isSaving={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toBeEnabled()
  })

  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    render(<SaveButton isNew={false} isSaving={false} onClick={onClick} />)
    fireEvent.click(screen.getByText('Save'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
