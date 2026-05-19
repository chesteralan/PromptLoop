import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useWorkflows,
  useWorkflow,
  useCreateWorkflow,
  useUpdateWorkflow,
  useDeleteWorkflow,
} from '../useWorkflows'

const {
  mockCollection,
  mockDoc,
  mockGetDocs,
  mockGetDoc,
  mockAddDoc,
  mockUpdateDoc,
  mockDeleteDoc,
  mockQuery,
  mockOrderBy,
  mockUseAuth,
} = vi.hoisted(() => ({
  mockCollection: vi.fn(),
  mockDoc: vi.fn(),
  mockGetDocs: vi.fn(),
  mockGetDoc: vi.fn(),
  mockAddDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockDeleteDoc: vi.fn(),
  mockQuery: vi.fn(),
  mockOrderBy: vi.fn(),
  mockUseAuth: vi.fn(() => ({ user: { uid: 'test-uid' } })),
}))

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({})), connectAuthEmulator: vi.fn() }))
vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  getDocs: mockGetDocs,
  getDoc: mockGetDoc,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  query: mockQuery,
  orderBy: mockOrderBy,
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
  mockDoc.mockReturnValue({ withConverter: vi.fn(() => 'converted-doc-ref') })
  mockQuery.mockImplementation((...args: unknown[]) => `query-${args[0]}`)
  mockOrderBy.mockReturnValue('order-clause')
  mockUseAuth.mockReturnValue({ user: { uid: 'test-uid' } })
})

describe('useWorkflows', () => {
  it('returns empty array when no user', async () => {
    mockUseAuth.mockReturnValue({ user: null })
    const { result } = renderHook(() => useWorkflows(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(result.current.data).toBeUndefined()
  })

  it('queries workflows ordered by createdAt desc', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [{ id: 'wf-1', data: () => ({ name: 'Workflow A', createdAt: new Date() }) }],
    })
    const { result } = renderHook(() => useWorkflows(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc')
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].id).toBe('wf-1')
  })
})

describe('useWorkflow', () => {
  it('returns null when no id', async () => {
    const { result } = renderHook(() => useWorkflow(undefined), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(result.current.data).toBeUndefined()
  })

  it('returns null when document does not exist', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false })
    const { result } = renderHook(() => useWorkflow('wf-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeNull())
  })

  it('returns document data with id', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'wf-1',
      data: () => ({ name: 'My Workflow', createdAt: new Date() }),
    })
    const { result } = renderHook(() => useWorkflow('wf-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toEqual({
      id: 'wf-1',
      name: 'My Workflow',
      createdAt: expect.any(Date),
    })
  })
})

describe('useCreateWorkflow', () => {
  it('creates a workflow and invalidates queries on success', async () => {
    mockAddDoc.mockResolvedValue({ id: 'new-wf-id' })
    const { result } = renderHook(() => useCreateWorkflow(), { wrapper: createWrapper() })
    result.current.mutate({ name: 'New' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockAddDoc).toHaveBeenCalled()
  })
})

describe('useUpdateWorkflow', () => {
  it('strips id from data before update', async () => {
    mockUpdateDoc.mockResolvedValue(undefined)
    const { result } = renderHook(() => useUpdateWorkflow(), { wrapper: createWrapper() })
    result.current.mutate({ workflowId: 'wf-1', data: { id: 'wf-1', name: 'Updated' } })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteWorkflow', () => {
  it('deletes a workflow', async () => {
    mockDeleteDoc.mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteWorkflow(), { wrapper: createWrapper() })
    result.current.mutate('wf-1')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockDeleteDoc).toHaveBeenCalled()
  })
})
