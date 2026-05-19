import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '../ProtectedRoute'

const mockUseAuth = vi.hoisted(() => vi.fn<() => { user: any; loading: boolean }>())

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

vi.mock('react-router-dom', () => ({
  Navigate: ({ to, state }: any) => (
    <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)} />
  ),
  useLocation: () => ({ pathname: '/dashboard', search: '', hash: '', state: null }),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner when loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    const { container } = render(
      <ProtectedRoute>
        <div>content</div>
      </ProtectedRoute>,
    )
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })

  it('redirects to /login when no user', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    const { getByTestId } = render(
      <ProtectedRoute>
        <div>content</div>
      </ProtectedRoute>,
    )
    expect(getByTestId('navigate')).toHaveAttribute('data-to', '/login')
    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { uid: '123', email: 'test@test.com' }, loading: false })
    const { getByText } = render(
      <ProtectedRoute>
        <div>content</div>
      </ProtectedRoute>,
    )
    expect(getByText('content')).toBeInTheDocument()
  })
})
