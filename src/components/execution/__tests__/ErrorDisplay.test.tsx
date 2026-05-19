import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorDisplay } from '../ErrorDisplay'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, disabled }: any) => (
    <button data-variant={variant} data-size={size} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div data-testid="progress" data-value={value} className={className} />
  ),
}))

describe('ErrorDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const categories = [
    'rate_limit',
    'auth',
    'server_error',
    'timeout',
    'network',
    'unknown',
  ] as const

  it.each(categories.map((c) => [c]))('renders label for category %s', (category) => {
    const labels: Record<string, string> = {
      rate_limit: 'Rate Limited',
      auth: 'Invalid API Key',
      server_error: 'Server Error',
      timeout: 'Timed Out',
      network: 'Network Error',
      unknown: 'Unexpected Error',
    }
    render(<ErrorDisplay category={category} message="test" userMessage="Something went wrong" />)
    expect(screen.getByText(labels[category])).toBeInTheDocument()
  })

  it('renders userMessage', () => {
    render(<ErrorDisplay category="unknown" message="err" userMessage="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows configure API key button for auth category', () => {
    render(<ErrorDisplay category="auth" message="err" userMessage="Bad key" />)
    expect(screen.getByText('Configure API Key')).toBeInTheDocument()
  })

  it('navigates to settings on configure API key click', () => {
    render(<ErrorDisplay category="auth" message="err" userMessage="Bad key" />)
    fireEvent.click(screen.getByText('Configure API Key'))
    expect(mockNavigate).toHaveBeenCalledWith('/settings/api-keys')
  })

  it('shows retry button for non-auth categories when onRetry provided', () => {
    const onRetry = vi.fn()
    render(
      <ErrorDisplay category="server_error" message="err" userMessage="Oops" onRetry={onRetry} />,
    )
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('does NOT show retry button for auth category even with onRetry', () => {
    const onRetry = vi.fn()
    render(<ErrorDisplay category="auth" message="err" userMessage="Bad key" onRetry={onRetry} />)
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('does NOT show retry button when onRetry not provided', () => {
    render(<ErrorDisplay category="server_error" message="err" userMessage="Oops" />)
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('calls onRetry when retry button clicked', () => {
    const onRetry = vi.fn()
    render(
      <ErrorDisplay category="server_error" message="err" userMessage="Oops" onRetry={onRetry} />,
    )
    fireEvent.click(screen.getByText('Retry'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows progress bar when retryAfterMs > 0', () => {
    render(
      <ErrorDisplay
        category="rate_limit"
        message="err"
        userMessage="Slow down"
        retryAfterMs={5000}
      />,
    )
    expect(screen.getByTestId('progress')).toBeInTheDocument()
    expect(screen.getByText(/Retrying in 5s/)).toBeInTheDocument()
  })

  it('hides progress bar when retryAfterMs is null', () => {
    render(<ErrorDisplay category="rate_limit" message="err" userMessage="Slow down" />)
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument()
  })

  it('hides progress bar when retryAfterMs is 0', () => {
    render(
      <ErrorDisplay category="rate_limit" message="err" userMessage="Slow down" retryAfterMs={0} />,
    )
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument()
  })

  it('falls back to unknown config for unrecognized category', () => {
    render(<ErrorDisplay category={'invalid' as any} message="err" userMessage="Unknown" />)
    expect(screen.getByText('Unexpected Error')).toBeInTheDocument()
  })
})
