import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { AuthProvider, AuthContext } from '../AuthProvider'

const mockOnAuthStateChanged = vi.hoisted(() => vi.fn())
const mockSignInWithPopup = vi.hoisted(() => vi.fn())
const mockSignInWithRedirect = vi.hoisted(() => vi.fn())
const mockGetRedirectResult = vi.hoisted(() => vi.fn())
const mockFirebaseSignOut = vi.hoisted(() => vi.fn())

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: any[]) => mockOnAuthStateChanged(...args),
  signInWithPopup: (...args: any[]) => mockSignInWithPopup(...args),
  signInWithRedirect: (...args: any[]) => mockSignInWithRedirect(...args),
  getRedirectResult: (...args: any[]) => mockGetRedirectResult(...args),
  GoogleAuthProvider: class {},
  GithubAuthProvider: class {},
  signOut: (...args: any[]) => mockFirebaseSignOut(...args),
  browserPopupRedirectResolver: {},
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

vi.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}))

function TestConsumer() {
  return (
    <AuthContext.Consumer>
      {(value) => {
        if (!value) return <span data-testid="no-context">no context</span>
        return (
          <div>
            <span data-testid="user">{value.user ? 'logged-in' : 'logged-out'}</span>
            <span data-testid="loading">{value.loading ? 'loading' : 'loaded'}</span>
            <button data-testid="sign-in-google" onClick={value.signInWithGoogle}>
              Google
            </button>
            <button data-testid="sign-in-github" onClick={value.signInWithGitHub}>
              GitHub
            </button>
            <button data-testid="sign-out" onClick={value.signOut}>
              Sign Out
            </button>
          </div>
        )
      }}
    </AuthContext.Consumer>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides auth context with loading=true initially', () => {
    mockOnAuthStateChanged.mockReturnValue(vi.fn())
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('sets user and loading=false after auth state change', () => {
    const mockUser = { uid: '123', displayName: 'Test', email: 'test@test.com' } as any
    mockOnAuthStateChanged.mockImplementation((_auth: any, callback: any) => {
      callback(mockUser)
      return vi.fn()
    })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    expect(screen.getByTestId('user')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
  })

  it('sets user to null when auth state is null', () => {
    mockOnAuthStateChanged.mockImplementation((_auth: any, callback: any) => {
      callback(null)
      return vi.fn()
    })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    expect(screen.getByTestId('user')).toHaveTextContent('logged-out')
    expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
  })

  it('unsubscribes from auth state on unmount', () => {
    const unsubscribe = vi.fn()
    mockOnAuthStateChanged.mockReturnValue(unsubscribe)
    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })

  it('signInWithGoogle calls signInWithProvider', async () => {
    mockOnAuthStateChanged.mockReturnValue(vi.fn())
    mockSignInWithPopup.mockResolvedValue(undefined)
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('sign-in-google'))
    })
    expect(mockSignInWithPopup).toHaveBeenCalled()
  })

  it('signInWithGitHub calls signInWithProvider', async () => {
    mockOnAuthStateChanged.mockReturnValue(vi.fn())
    mockSignInWithPopup.mockResolvedValue(undefined)
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('sign-in-github'))
    })
    expect(mockSignInWithPopup).toHaveBeenCalled()
  })

  it('signOut calls firebaseSignOut', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth: any, callback: any) => {
      callback(null)
      return vi.fn()
    })
    mockFirebaseSignOut.mockResolvedValue(undefined)
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('sign-out'))
    })
    expect(mockFirebaseSignOut).toHaveBeenCalled()
  })
})
