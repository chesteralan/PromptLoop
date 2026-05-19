import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StreamingText } from '../StreamingText'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, disabled }: any) => (
    <button
      data-testid="copy-btn"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => (
    <div data-testid="scroll-area" className={className}>
      {children}
    </div>
  ),
}))

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('StreamingText', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows placeholder when no text and not streaming', () => {
    render(<StreamingText text="" isStreaming={false} />)
    expect(screen.getByText('Waiting for execution to start...')).toBeInTheDocument()
  })

  it('renders text content when text provided', () => {
    render(<StreamingText text="Hello world" isStreaming={false} />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('shows streaming indicator when streaming', () => {
    render(<StreamingText text="Hello" isStreaming={true} />)
    expect(screen.getByText('Streaming')).toBeInTheDocument()
  })

  it('does not show streaming indicator when not streaming', () => {
    render(<StreamingText text="Hello" isStreaming={false} />)
    expect(screen.queryByText('Streaming')).not.toBeInTheDocument()
  })

  it('shows copy button when text exists', () => {
    render(<StreamingText text="Hello" isStreaming={false} />)
    expect(screen.getByTestId('copy-btn')).toBeInTheDocument()
  })

  it('hides copy button when text is empty', () => {
    render(<StreamingText text="" isStreaming={false} />)
    expect(screen.queryByTestId('copy-btn')).not.toBeInTheDocument()
  })

  it('shows char count footer when text exists', () => {
    render(<StreamingText text="Hello" isStreaming={false} />)
    expect(screen.getByText('5 chars')).toBeInTheDocument()
  })

  it('hides char count footer when no text', () => {
    render(<StreamingText text="" isStreaming={false} />)
    expect(screen.queryByText(/chars/)).not.toBeInTheDocument()
  })

  it('copies text to clipboard on copy click', async () => {
    render(<StreamingText text="Copy me" isStreaming={false} />)
    fireEvent.click(screen.getByTestId('copy-btn'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me')
  })

  it('handles clipboard write failure gracefully', async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('denied'))
    render(<StreamingText text="Copy me" isStreaming={false} />)
    fireEvent.click(screen.getByTestId('copy-btn'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me')
  })

  it('shows "Response" header label', () => {
    render(<StreamingText text="Hello" isStreaming={false} />)
    expect(screen.getByText('Response')).toBeInTheDocument()
  })
})
