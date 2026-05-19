import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppLayout } from '../AppLayout'

const mockNavigate = vi.hoisted(() => vi.fn())
const mockGetDoc = vi.hoisted(() => vi.fn())
const mockUseAuth = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet" />,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  Navigate: ({ to }: any) => <div data-testid="navigate" data-to={to} />,
  NavLink: ({ children, to, className }: any) => {
    const cls = typeof className === 'function' ? className({ isActive: false }) : className
    return (
      <a href={to} className={cls}>
        {children}
      </a>
    )
  },
}))

vi.mock('firebase/firestore', () => ({
  doc: (_db: any, _collection: string, id: string) => ({ id }),
  getDoc: mockGetDoc,
}))

vi.mock('@/lib/firebase', () => ({
  db: {} as any,
}))

vi.mock('./Sidebar', () => ({
  Sidebar: ({ collapsed, onToggle }: any) => (
    <div data-testid="sidebar" data-collapsed={String(collapsed)}>
      <button onClick={onToggle} data-testid="sidebar-toggle">
        Toggle
      </button>
    </div>
  ),
}))

vi.mock('./StatusBar', () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}))

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({ user: null, loading: false })
  })

  it('shows loading spinner while checking onboarding', () => {
    mockUseAuth.mockReturnValue({ user: { uid: '123' }, loading: false })
    mockGetDoc.mockReturnValue(new Promise(() => {}))
    const { container } = render(<AppLayout />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders navigate when no user (skips firestore check)', async () => {
    render(<AppLayout />)
    expect(mockGetDoc).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toBeInTheDocument()
    })
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login')
  })

  it('redirects to onboarding when onboardingComplete is false', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'abc' }, loading: false })
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ onboardingComplete: false }),
    })
    render(<AppLayout />)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding', { replace: true })
    })
  })

  it('renders layout when onboardingComplete is true', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'abc' }, loading: false })
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ onboardingComplete: true }),
    })
    render(<AppLayout />)
    await waitFor(() => {
      expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })
  })

  it('renders layout when user document does not exist', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'abc' }, loading: false })
    mockGetDoc.mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    })
    render(<AppLayout />)
    await waitFor(() => {
      expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })
  })

  it('handles getDoc error gracefully and renders layout', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'abc' }, loading: false })
    mockGetDoc.mockRejectedValue(new Error('firestore error'))
    render(<AppLayout />)
    await waitFor(() => {
      expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })
  })
})
