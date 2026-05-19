import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginPage } from '../Login'

const { mockNavigate, mockSignInWithGoogle, mockSignInWithGitHub, mockToast } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignInWithGoogle: vi.fn(),
  mockSignInWithGitHub: vi.fn(),
  mockToast: { error: vi.fn() },
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: mockToast }))

import { useAuth } from '../../hooks/useAuth'

function mockAuth(overrides: Record<string, unknown> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    loading: false,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithGitHub: mockSignInWithGitHub,
    ...overrides,
  } as any)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LoginPage', () => {
  it('shows loading spinner when loading', () => {
    mockAuth({ loading: true })
    render(<LoginPage />)
    expect(screen.queryByText('PromptLoop')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('navigates to dashboard when user is authenticated', () => {
    mockAuth({ user: { uid: 'test-uid', email: 'test@example.com' } })
    render(<LoginPage />)
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('renders sign-in card when unauthenticated', () => {
    mockAuth()
    render(<LoginPage />)
    expect(screen.getByText('PromptLoop')).toBeInTheDocument()
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument()
  })

  it('renders OAuth buttons with correct aria-labels', () => {
    mockAuth()
    render(<LoginPage />)
    expect(screen.getByLabelText('Sign in with Google')).toBeInTheDocument()
    expect(screen.getByLabelText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('calls signInWithGoogle on Google button click', async () => {
    mockAuth()
    render(<LoginPage />)
    fireEvent.click(screen.getByLabelText('Sign in with Google'))
    expect(mockSignInWithGoogle).toHaveBeenCalledOnce()
  })

  it('calls signInWithGitHub on GitHub button click', () => {
    mockAuth()
    render(<LoginPage />)
    fireEvent.click(screen.getByLabelText('Sign in with GitHub'))
    expect(mockSignInWithGitHub).toHaveBeenCalledOnce()
  })

  it('shows error toast when Google sign-in fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('denied'))
    mockAuth()
    render(<LoginPage />)
    fireEvent.click(screen.getByLabelText('Sign in with Google'))
    await vi.waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith('Failed to sign in with Google'),
    )
  })

  it('shows error toast when GitHub sign-in fails', async () => {
    mockSignInWithGitHub.mockRejectedValue(new Error('denied'))
    mockAuth()
    render(<LoginPage />)
    fireEvent.click(screen.getByLabelText('Sign in with GitHub'))
    await vi.waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith('Failed to sign in with GitHub'),
    )
  })
})
