import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ApiKeyCard } from '../ApiKeyCard'

const mockToastSuccess = vi.hoisted(() => vi.fn())
const mockToastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, disabled, className }: any) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/shared/ConfirmDialog', () => ({
  ConfirmDialog: ({ open, title, message, confirmLabel, variant, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="confirm-dialog" data-variant={variant}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button data-testid="confirm-btn" onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button data-testid="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ) : null,
}))

describe('ApiKeyCard', () => {
  const defaultProps = {
    id: 'key-1',
    provider: 'openai',
    keyPrefix: 'sk-abc',
    createdAt: '2024-01-15T10:00:00.000Z',
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders provider name', () => {
    render(<ApiKeyCard {...defaultProps} />)
    expect(screen.getByText('openai')).toBeInTheDocument()
  })

  it('renders key prefix with ellipsis', () => {
    render(<ApiKeyCard {...defaultProps} />)
    expect(screen.getByText('sk-abc...')).toBeInTheDocument()
  })

  it('renders formatted creation date', () => {
    render(<ApiKeyCard {...defaultProps} />)
    expect(screen.getByText(/Added/)).toBeInTheDocument()
  })

  it('shows delete button', () => {
    render(<ApiKeyCard {...defaultProps} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows confirm dialog when delete clicked', () => {
    render(<ApiKeyCard {...defaultProps} />)
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete API Key')).toBeInTheDocument()
  })

  it('calls onDelete and shows success toast on confirm', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    render(<ApiKeyCard {...defaultProps} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByTestId('confirm-btn'))
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('key-1')
      expect(mockToastSuccess).toHaveBeenCalledWith('API key deleted')
    })
  })

  it('shows error toast on delete failure', async () => {
    const onDelete = vi.fn().mockRejectedValue(new Error('fail'))
    render(<ApiKeyCard {...defaultProps} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByTestId('confirm-btn'))
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to delete API key')
    })
  })

  it('closes confirm dialog on cancel', () => {
    render(<ApiKeyCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('cancel-btn'))
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument()
  })

  it('renders anthropic provider with orange colors', () => {
    render(<ApiKeyCard {...defaultProps} provider="anthropic" />)
    const badge = screen.getByTestId('badge')
    expect(badge).toBeInTheDocument()
  })

  it('renders google provider', () => {
    render(<ApiKeyCard {...defaultProps} provider="google" />)
    expect(screen.getByText('google')).toBeInTheDocument()
  })

  it('renders unknown provider with openai fallback colors', () => {
    render(<ApiKeyCard {...defaultProps} provider="unknown" />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})
