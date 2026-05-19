import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OAuthButtons } from '../OAuthButtons'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, ...rest }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      aria-label={rest['aria-label']}
    >
      {children}
    </button>
  ),
}))

describe('OAuthButtons', () => {
  it('renders both sign-in buttons', () => {
    render(<OAuthButtons onGoogleSignIn={vi.fn()} onGitHubSignIn={vi.fn()} />)
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('has correct aria-labels on buttons', () => {
    render(<OAuthButtons onGoogleSignIn={vi.fn()} onGitHubSignIn={vi.fn()} />)
    expect(screen.getByLabelText('Sign in with Google')).toBeInTheDocument()
    expect(screen.getByLabelText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('fires onGoogleSignIn when Google button clicked', () => {
    const onGoogle = vi.fn()
    render(<OAuthButtons onGoogleSignIn={onGoogle} onGitHubSignIn={vi.fn()} />)
    fireEvent.click(screen.getByText('Sign in with Google'))
    expect(onGoogle).toHaveBeenCalledOnce()
  })

  it('fires onGitHubSignIn when GitHub button clicked', () => {
    const onGitHub = vi.fn()
    render(<OAuthButtons onGoogleSignIn={vi.fn()} onGitHubSignIn={onGitHub} />)
    fireEvent.click(screen.getByText('Sign in with GitHub'))
    expect(onGitHub).toHaveBeenCalledOnce()
  })

  it('disables buttons when loading', () => {
    render(<OAuthButtons onGoogleSignIn={vi.fn()} onGitHubSignIn={vi.fn()} isLoading={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('sets aria-busy on container when loading', () => {
    const { container } = render(
      <OAuthButtons onGoogleSignIn={vi.fn()} onGitHubSignIn={vi.fn()} isLoading={true} />,
    )
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
  })

  it('does not set aria-busy when not loading', () => {
    const { container } = render(<OAuthButtons onGoogleSignIn={vi.fn()} onGitHubSignIn={vi.fn()} />)
    expect(container.firstElementChild).not.toHaveAttribute('aria-busy')
  })
})
