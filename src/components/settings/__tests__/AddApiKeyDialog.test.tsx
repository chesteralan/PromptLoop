import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddApiKeyDialog } from '../AddApiKeyDialog'

const mockToastSuccess = vi.hoisted(() => vi.fn())
const mockToastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}))

vi.mock('@/components/ui/dialog', () => {
  const Dialog = ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null
  const DialogContent = ({ children }: any) => <div data-testid="dialog-content">{children}</div>
  const DialogHeader = ({ children }: any) => <div data-testid="dialog-header">{children}</div>
  const DialogTitle = ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>
  const DialogFooter = ({ children }: any) => <div data-testid="dialog-footer">{children}</div>
  return { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }
})

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, disabled, title }: any) => (
    <button
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children }: any) => <label data-testid="label">{children}</label>,
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
      <select
        data-testid="select-native"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
        <option value="google">Google</option>
      </select>
    </div>
  ),
  SelectTrigger: ({ children, className, disabled, ...props }: any) => (
    <button data-slot="select-trigger" className={className} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  SelectValue: ({ children }: any) => <span data-slot="select-value">{children}</span>,
  SelectContent: ({ children, className }: any) => (
    <div data-slot="select-content" className={className}>
      {children}
    </div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-slot="select-item" data-value={value}>
      {children}
    </div>
  ),
}))

const mockClipboardReadText = vi.hoisted(() => vi.fn().mockResolvedValue('sk-test-key'))

Object.assign(navigator, {
  clipboard: {
    readText: mockClipboardReadText,
  },
})

describe('AddApiKeyDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSave: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockClipboardReadText.mockResolvedValue('sk-test-key')
  })

  it('renders dialog when open', () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText('Add API Key')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<AddApiKeyDialog {...defaultProps} open={false} />)
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('shows provider selector', () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    expect(screen.getByTestId('select')).toBeInTheDocument()
  })

  it('shows API key input', () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('shows validation error for empty key', async () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    const saveBtn = screen.getByText('Save')
    expect(saveBtn).toBeDisabled()
  })

  it('shows validation error for wrong openai prefix', async () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'wrong-key' } })
    fireEvent.click(screen.getByText('Save'))
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid key format for openai')
  })

  it('shows validation error for wrong anthropic prefix', async () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'sk-wrong' } })
    const select = screen.getByTestId('select-native')
    fireEvent.change(select, { target: { value: 'anthropic' } })
    fireEvent.click(screen.getByText('Save'))
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid key format for anthropic')
  })

  it('shows validation error for wrong google prefix', async () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'sk-wrong' } })
    const select = screen.getByTestId('select-native')
    fireEvent.change(select, { target: { value: 'google' } })
    fireEvent.click(screen.getByText('Save'))
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid key format for google')
  })

  it('accepts valid openai key', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<AddApiKeyDialog {...defaultProps} onSave={onSave} />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'sk-valid-key-123' } })
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('openai', 'sk-valid-key-123')
    })
  })

  it('accepts valid anthropic key', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<AddApiKeyDialog {...defaultProps} onSave={onSave} />)
    const select = screen.getByTestId('select-native')
    fireEvent.change(select, { target: { value: 'anthropic' } })
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'sk-ant-valid-key' } })
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('anthropic', 'sk-ant-valid-key')
    })
  })

  it('accepts valid google key', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<AddApiKeyDialog {...defaultProps} onSave={onSave} />)
    const select = screen.getByTestId('select-native')
    fireEvent.change(select, { target: { value: 'google' } })
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'AIzaValidKey123' } })
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('google', 'AIzaValidKey123')
    })
  })

  it('shows error toast on save failure', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
    render(<AddApiKeyDialog {...defaultProps} onSave={onSave} />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'sk-valid-key' } })
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Save failed')
    })
  })

  it('pastes from clipboard', async () => {
    mockClipboardReadText.mockResolvedValue('sk-pasted-key')
    render(<AddApiKeyDialog {...defaultProps} />)
    const pasteBtn = screen.getByTitle('Paste from clipboard')
    fireEvent.click(pasteBtn)
    await waitFor(() => {
      expect(mockClipboardReadText).toHaveBeenCalled()
    })
  })

  it('shows error toast on clipboard read failure', async () => {
    mockClipboardReadText.mockRejectedValue(new Error('denied'))
    render(<AddApiKeyDialog {...defaultProps} />)
    const pasteBtn = screen.getByTitle('Paste from clipboard')
    fireEvent.click(pasteBtn)
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Unable to read clipboard. Please paste manually.',
      )
    })
  })

  it('disables save button when key is empty', () => {
    render(<AddApiKeyDialog {...defaultProps} />)
    expect(screen.getByText('Save')).toBeDisabled()
  })

  it('calls onOpenChange(false) when cancel clicked', () => {
    const onOpenChange = vi.fn()
    render(<AddApiKeyDialog {...defaultProps} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
