import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../components/auth/AuthProvider'
import { useAuth } from '../hooks/useAuth'

const mockOnAuthStateChanged = vi.fn()

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

vi.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}))

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  signInWithPopup: vi.fn(() => Promise.resolve()),
  signOut: vi.fn(() => Promise.resolve()),
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
  getAuth: vi.fn(() => ({})),
  connectAuthEmulator: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
}))

vi.mock('@/lib/auth-service', () => ({
  signInWithProvider: vi.fn(() => Promise.resolve()),
  handleRedirectResult: vi.fn(() => Promise.resolve()),
  createSignInProvider: vi.fn(),
}))

vi.mock('@/lib/user-service', () => ({
  ensureUserDocument: vi.fn(() => Promise.resolve()),
}))

vi.mock('@/lib/sentry', () => ({
  initRendererSentry: vi.fn(),
}))

vi.mock('@/lib/env', () => ({
  isElectron: false,
  isBrowser: true,
}))

function TestConsumer() {
  const { user, loading } = useAuth()
  if (loading) {
    return <div data-testid="auth-state">loading</div>
  }
  if (user) {
    return <div data-testid="auth-state">authenticated</div>
  }
  return <div data-testid="auth-state">unauthenticated</div>
}

function renderWithProviders(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading while auth state is being determined', () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn())

    renderWithProviders(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-state')).toHaveTextContent('loading')
  })

  it('shows unauthenticated when no user', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
      cb(null)
      return vi.fn()
    })

    renderWithProviders(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(await screen.findByTestId('auth-state')).toHaveTextContent('unauthenticated')
  })

  it('shows authenticated when user is set', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
      cb(mockUser)
      return vi.fn()
    })

    renderWithProviders(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(await screen.findByTestId('auth-state')).toHaveTextContent('authenticated')
  })
})
