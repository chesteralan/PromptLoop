import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from '../ConfirmDialog'

vi.mock('../../ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogClose: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children || 'Cancel'}</button>
  ),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('../../ui/button', () => ({
  Button: ({ children, onClick, variant, disabled }: any) => (
    <button onClick={onClick} data-variant={variant} disabled={disabled}>
      {children}
    </button>
  ),
}))

describe('ConfirmDialog', () => {
  it('shows title and message', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete? Are you sure?"
        message="This action cannot be undone."
      />,
    )
    expect(screen.getByText('Delete? Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  it('uses default variant by default', () => {
    render(<ConfirmDialog open={true} onConfirm={vi.fn()} onCancel={vi.fn()} title="Delete?" />)
    const confirmBtn = screen.getByText('Confirm')
    expect(confirmBtn).toHaveAttribute('data-variant', 'default')
  })

  it('uses destructive variant when specified', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete?"
        variant="destructive"
      />,
    )
    const confirmBtn = screen.getByText('Confirm')
    expect(confirmBtn).toHaveAttribute('data-variant', 'destructive')
  })

  it('uses default labels when not provided', () => {
    render(<ConfirmDialog open={true} onConfirm={vi.fn()} onCancel={vi.fn()} title="Delete?" />)
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('uses custom labels when provided', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Save?"
        confirmLabel="Yes"
        cancelLabel="No"
      />,
    )
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('fires onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog open={true} onConfirm={onConfirm} onCancel={vi.fn()} title="Delete?" />)
    fireEvent.click(screen.getByText('Confirm'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('fires onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open={true} onConfirm={vi.fn()} onCancel={onCancel} title="Delete?" />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
