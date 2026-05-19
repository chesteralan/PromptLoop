import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PageHeader } from '../PageHeader'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}))

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<PageHeader title="Dashboard" description="Manage your workflows" />)
    expect(screen.getByText('Manage your workflows')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.queryByText('Manage your workflows')).not.toBeInTheDocument()
  })

  it('renders back button when onBack is provided', () => {
    const onBack = vi.fn()
    render(<PageHeader title="Editor" onBack={onBack} />)
    const backBtn = screen.getByRole('button')
    expect(backBtn).toBeInTheDocument()
  })

  it('fires onBack when back button is clicked', () => {
    const onBack = vi.fn()
    render(<PageHeader title="Editor" onBack={onBack} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('does not render back button when onBack is absent', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    render(<PageHeader title="Dashboard" actions={<button>Action</button>} />)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('does not render actions container when absent', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.queryByText('Action')).not.toBeInTheDocument()
  })
})
