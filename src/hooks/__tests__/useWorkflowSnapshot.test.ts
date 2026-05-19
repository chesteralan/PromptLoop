import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useWorkflowSnapshot } from '../useWorkflowSnapshot'

const {
  mockDoc,
  mockOnSnapshot,
  mockUpdateWorkflow,
  mockSetActiveWorkflow,
  mockUseWorkflowStore,
  mockUseAuth,
} = vi.hoisted(() => ({
  mockDoc: vi.fn(),
  mockOnSnapshot: vi.fn(),
  mockUpdateWorkflow: vi.fn(),
  mockSetActiveWorkflow: vi.fn(),
  mockUseWorkflowStore: vi.fn(),
  mockUseAuth: vi.fn(() => ({ user: { uid: 'test-uid' } })),
}))

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({})), connectAuthEmulator: vi.fn() }))
vi.mock('firebase/firestore', () => ({
  doc: mockDoc,
  onSnapshot: mockOnSnapshot,
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
}))

vi.mock('../../lib/firebase', () => ({ db: {}, auth: {} }))
vi.mock('../useAuth', () => ({ useAuth: () => mockUseAuth() }))

vi.mock('../../store/workflowStore', () => ({
  useWorkflowStore: mockUseWorkflowStore,
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockDoc.mockReturnValue({ withConverter: vi.fn(() => 'converted-doc') })
  mockUseWorkflowStore.mockImplementation((selector: (s: any) => any) =>
    selector({ updateWorkflow: mockUpdateWorkflow, setActiveWorkflow: mockSetActiveWorkflow }),
  )
  mockUseAuth.mockReturnValue({ user: { uid: 'test-uid' } })
})

describe('useWorkflowSnapshot', () => {
  it('returns early when no user', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderHook(() => useWorkflowSnapshot('wf-1'))
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it('returns early when no workflowId', () => {
    renderHook(() => useWorkflowSnapshot(undefined))
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it('sets active workflow on mount', () => {
    mockOnSnapshot.mockReturnValue(vi.fn())
    renderHook(() => useWorkflowSnapshot('wf-1'))
    expect(mockSetActiveWorkflow).toHaveBeenCalledWith('wf-1')
  })

  it('subscribes to onSnapshot with workflowConverter', () => {
    mockOnSnapshot.mockReturnValue(vi.fn())
    renderHook(() => useWorkflowSnapshot('wf-1'))
    expect(mockDoc).toHaveBeenCalled()
    expect(mockOnSnapshot).toHaveBeenCalledOnce()
    expect(mockOnSnapshot).toHaveBeenCalledWith(
      'converted-doc',
      expect.any(Function),
      expect.any(Function),
    )
  })

  it('updates workflow when snapshot exists', () => {
    const snapshotData = {
      name: 'Test',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    }
    mockOnSnapshot.mockImplementation((_ref: unknown, next: (snap: any) => void) => {
      next({ exists: () => true, data: () => snapshotData })
      return vi.fn()
    })

    renderHook(() => useWorkflowSnapshot('wf-1'))
    expect(mockUpdateWorkflow).toHaveBeenCalledWith('wf-1', {
      id: 'wf-1',
      ...snapshotData,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    })
  })

  it('does not update when snapshot does not exist', () => {
    mockOnSnapshot.mockImplementation((_ref: unknown, next: (snap: any) => void) => {
      next({ exists: () => false })
      return vi.fn()
    })

    renderHook(() => useWorkflowSnapshot('wf-1'))
    expect(mockUpdateWorkflow).not.toHaveBeenCalled()
  })

  it('handles snapshot error without crashing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockOnSnapshot.mockImplementation(
      (_ref: unknown, _next: unknown, error: (e: Error) => void) => {
        error(new Error('permission denied'))
        return vi.fn()
      },
    )

    renderHook(() => useWorkflowSnapshot('wf-1'))
    expect(consoleSpy).toHaveBeenCalledWith('Workflow snapshot error:', 'permission denied')
    consoleSpy.mockRestore()
  })

  it('unsubscribes and clears active workflow on unmount', () => {
    const unsub = vi.fn()
    mockOnSnapshot.mockReturnValue(unsub)

    const { unmount } = renderHook(() => useWorkflowSnapshot('wf-1'))
    unmount()

    expect(unsub).toHaveBeenCalledOnce()
    expect(mockSetActiveWorkflow).toHaveBeenCalledWith(null)
  })
})
