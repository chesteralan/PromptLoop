import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExecutions } from '../useExecutions'

const { mockCollection, mockGetDocs, mockQuery, mockOrderBy, mockLimit, mockWhere, mockUseAuth } =
  vi.hoisted(() => ({
    mockCollection: vi.fn(),
    mockGetDocs: vi.fn(),
    mockQuery: vi.fn(),
    mockOrderBy: vi.fn(),
    mockLimit: vi.fn(),
    mockWhere: vi.fn(),
    mockUseAuth: vi.fn(() => ({ user: { uid: 'test-uid' } })),
  }))

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({})), connectAuthEmulator: vi.fn() }))
vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  query: mockQuery,
  orderBy: mockOrderBy,
  limit: mockLimit,
  where: mockWhere,
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
}))

vi.mock('../../lib/firebase', () => ({ db: {}, auth: {} }))
vi.mock('../useAuth', () => ({ useAuth: () => mockUseAuth() }))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockCollection.mockReturnValue({ withConverter: vi.fn(() => 'converted-ref') })
  mockQuery.mockImplementation((...args: unknown[]) => `query-${args[0]}`)
  mockOrderBy.mockReturnValue('order-clause')
  mockLimit.mockReturnValue('limit-clause')
  mockWhere.mockReturnValue('where-clause')
  mockUseAuth.mockReturnValue({ user: { uid: 'test-uid' } })
})

describe('useExecutions', () => {
  it('returns empty array when no user', async () => {
    mockUseAuth.mockReturnValue({ user: null })
    const { result } = renderHook(() => useExecutions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(result.current.data).toBeUndefined()
  })

  it('queries executions subcollection ordered by createdAt desc', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [{ id: 'ex-1', data: () => ({ workflowId: 'wf-1' }) }],
    })
    const { result } = renderHook(() => useExecutions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc')
    expect(mockLimit).toHaveBeenCalledWith(100)
    expect(mockWhere).not.toHaveBeenCalled()
    expect(result.current.data).toHaveLength(1)
  })

  it('adds workflowId filter when provided', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] })
    renderHook(() => useExecutions('wf-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(mockWhere).toHaveBeenCalled())
    expect(mockWhere).toHaveBeenCalledWith('workflowId', '==', 'wf-1')
    expect(mockLimit).toHaveBeenCalledWith(100)
  })

  it('uses custom resultLimit', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] })
    renderHook(() => useExecutions(undefined, 50), { wrapper: createWrapper() })
    await waitFor(() => expect(mockLimit).toHaveBeenCalledWith(50))
  })

  it('query is disabled when no user', () => {
    mockUseAuth.mockReturnValue({ user: null })
    const { result } = renderHook(() => useExecutions(), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })
})
