import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
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

function LoginPage() {
  const { user, loading } = useAuth()
  if (loading) {
    return null
  }
  if (user) {
    return <div>login-redirected</div>
  }
  return <div>login-page</div>
}

function DashboardPage() {
  return <div>dashboard</div>
}

function renderWithRouter(initialRoute: string) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>not-found</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

function simulateAuth(user: Record<string, string> | null) {
  mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
    cb(user)
    return vi.fn()
  })
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users to login', async () => {
    simulateAuth(null)

    renderWithRouter('/dashboard')

    expect(await screen.findByText('login-page')).toBeInTheDocument()
  })

  it('renders children when authenticated', async () => {
    simulateAuth({ uid: '123', email: 'test@example.com' })

    renderWithRouter('/dashboard')

    expect(await screen.findByText('dashboard')).toBeInTheDocument()
  })

  it('redirects authenticated users away from login', async () => {
    simulateAuth({ uid: '123', email: 'test@example.com' })

    renderWithRouter('/login')

    expect(await screen.findByText('login-redirected')).toBeInTheDocument()
  })
})
