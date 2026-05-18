import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { AuthProvider } from '../components/auth/AuthProvider'
import { useAuth } from '../hooks/useAuth'

const mockOnAuthStateChanged = vi.fn()

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

vi.mock('../../lib/firebase', () => ({
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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users to login', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
      cb(null)
      return vi.fn()
    })

    renderWithRouter('/dashboard')

    expect(await screen.findByText('login-page')).toBeInTheDocument()
  })

  it('renders children when authenticated', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
      cb(mockUser)
      return vi.fn()
    })

    renderWithRouter('/dashboard')

    expect(await screen.findByText('dashboard')).toBeInTheDocument()
  })

  it('redirects authenticated users away from login', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
      cb(mockUser)
      return vi.fn()
    })

    renderWithRouter('/login')

    expect(await screen.findByText('login-redirected')).toBeInTheDocument()
  })
})
