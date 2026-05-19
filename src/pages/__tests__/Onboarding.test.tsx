import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingPage } from '../Onboarding'

const { mockNavigate, mockDoc, mockGetDoc, mockUpdateDoc, mockUseAuth, mockToast } = vi.hoisted(
  () => ({
    mockNavigate: vi.fn(),
    mockDoc: vi.fn(),
    mockGetDoc: vi.fn(),
    mockUpdateDoc: vi.fn(),
    mockUseAuth: vi.fn(() => ({
      user: { uid: 'test-uid', email: 'test@example.com', displayName: 'Test' },
    })),
    mockToast: { success: vi.fn(), error: vi.fn() },
  }),
)

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('sonner', () => ({ toast: mockToast }))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('../../lib/firebase', () => ({ db: {}, auth: {} }))

vi.mock('firebase/firestore', () => ({
  doc: mockDoc,
  getDoc: mockGetDoc,
  updateDoc: mockUpdateDoc,
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
}))

function mockUserDoc(exists: boolean, data: Record<string, unknown> = {}) {
  mockDoc.mockReturnValue('user-doc-ref')
  mockGetDoc.mockResolvedValue({ exists: () => exists, data: () => data })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('OnboardingPage', () => {
  it('shows spinner when no user', () => {
    mockUseAuth.mockReturnValue({ user: null })
    mockDoc.mockReturnValue('user-doc-ref')
    mockGetDoc.mockResolvedValue({ exists: () => false, data: () => ({}) })
    render(<OnboardingPage />)
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows spinner while loading user doc', () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'test-uid' } })
    mockDoc.mockReturnValue('user-doc-ref')
    mockGetDoc.mockReturnValue(new Promise(() => {}))
    render(<OnboardingPage />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redirects to dashboard when onboarding is complete', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'test-uid' } })
    mockUserDoc(true, { name: 'Existing', onboardingComplete: true })
    render(<OnboardingPage />)
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('renders form when user doc has no onboardingComplete', async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid', email: 'test@example.com', displayName: null },
    })
    mockUserDoc(true, { name: 'ExistingName' })
    render(<OnboardingPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('Welcome to PromptLoop')).toBeInTheDocument()
    })
    expect(screen.getByDisplayValue('ExistingName')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@example.com')).toBeDisabled()
  })

  it('uses displayName when doc has no name', async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid', email: 't@t.com', displayName: 'Displayy' },
    })
    mockUserDoc(true, {})
    render(<OnboardingPage />)
    await vi.waitFor(() => {
      expect(screen.getByDisplayValue('Displayy')).toBeInTheDocument()
    })
  })

  it('disables button when name is empty', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'test-uid', displayName: null } })
    mockUserDoc(true, {})
    render(<OnboardingPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('Get Started')).toBeDisabled()
    })
  })

  it('calls updateDoc and navigates on complete', async () => {
    mockUpdateDoc.mockResolvedValue(undefined)
    mockUseAuth.mockReturnValue({ user: { uid: 'test-uid', displayName: null } })
    mockUserDoc(true, {})
    render(<OnboardingPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'MyName' } })
    fireEvent.click(screen.getByText('Get Started'))
    expect(mockUpdateDoc).toHaveBeenCalledWith('user-doc-ref', {
      name: 'MyName',
      onboardingComplete: true,
    })
    await vi.waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Welcome to PromptLoop!')
    })
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('shows error toast when save fails', async () => {
    mockUpdateDoc.mockRejectedValue(new Error('save error'))
    mockUseAuth.mockReturnValue({ user: { uid: 'test-uid', displayName: null } })
    mockUserDoc(true, {})
    render(<OnboardingPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'MyName' } })
    fireEvent.click(screen.getByText('Get Started'))
    await vi.waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to save profile')
    })
  })

  it('does not navigate away when setting cancelled flag', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'test-uid', displayName: null } })
    mockDoc.mockReturnValue('user-doc-ref')
    let resolver: (v: unknown) => void
    const slowPromise = new Promise((resolve) => {
      resolver = resolve
    })
    mockGetDoc.mockReturnValue(slowPromise)
    const { unmount } = render(<OnboardingPage />)
    unmount()
    resolver!({ exists: () => true, data: () => ({ onboardingComplete: true }) })
    await vi.waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
