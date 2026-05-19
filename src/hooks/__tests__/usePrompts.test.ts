import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  usePrompts,
  useCreatePrompt,
  useUpdatePrompt,
  useDeletePrompt,
  useReorderPrompts,
} from '../usePrompts'

const {
  mockCollection,
  mockDoc,
  mockGetDocs,
  mockAddDoc,
  mockUpdateDoc,
  mockDeleteDoc,
  mockQuery,
  mockOrderBy,
  mockWriteBatch,
  mockUseAuth,
} = vi.hoisted(() => ({
  mockCollection: vi.fn(),
  mockDoc: vi.fn(),
  mockGetDocs: vi.fn(),
  mockAddDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockDeleteDoc: vi.fn(),
  mockQuery: vi.fn(),
  mockOrderBy: vi.fn(),
  mockWriteBatch: vi.fn(),
  mockUseAuth: vi.fn(() => ({ user: { uid: 'test-uid' } })),
}))

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({})), connectAuthEmulator: vi.fn() }))
vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  getDocs: mockGetDocs,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  query: mockQuery,
  orderBy: mockOrderBy,
  writeBatch: mockWriteBatch,
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
}))

vi.mock('../../lib/firebase', () => ({ db: {}, auth: {} }))
vi.mock('../useAuth', () => ({ useAuth: () => mockUseAuth() }))

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockCollection.mockReturnValue({ withConverter: vi.fn(() => 'converted-coll') })
  mockDoc.mockReturnValue({ withConverter: vi.fn(() => 'converted-doc') })
  mockQuery.mockImplementation((...args: unknown[]) => `query-${args[0]}`)
  mockOrderBy.mockReturnValue('order-clause')
  mockWriteBatch.mockReturnValue({ update: vi.fn(), commit: vi.fn().mockResolvedValue(undefined) })
  mockUseAuth.mockReturnValue({ user: { uid: 'test-uid' } })
})

describe('usePrompts', () => {
  it('returns empty array when no workflowId', async () => {
    const { result } = renderHook(() => usePrompts(undefined), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(result.current.data).toBeUndefined()
  })

  it('queries prompts ordered by position', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [{ id: 'p-1', data: () => ({ title: 'Prompt A', position: 0 }) }],
    })
    const { result } = renderHook(() => usePrompts('wf-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(mockOrderBy).toHaveBeenCalledWith('position', 'asc')
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useCreatePrompt', () => {
  it('creates a prompt and invalidates queries', async () => {
    mockAddDoc.mockResolvedValue({ id: 'new-p-id' })
    const { result } = renderHook(() => useCreatePrompt('wf-1'), { wrapper: createWrapper() })
    result.current.mutate({ title: 'New', content: 'content', model: 'gpt-4o', position: 0 })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockAddDoc).toHaveBeenCalled()
  })
})

describe('useUpdatePrompt', () => {
  it('updates a prompt', async () => {
    mockUpdateDoc.mockResolvedValue(undefined)
    const { result } = renderHook(() => useUpdatePrompt('wf-1'), { wrapper: createWrapper() })
    result.current.mutate({ promptId: 'p-1', data: { title: 'Updated' } })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockUpdateDoc).toHaveBeenCalled()
  })
})

describe('useDeletePrompt', () => {
  it('deletes a prompt', async () => {
    mockDeleteDoc.mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeletePrompt('wf-1'), { wrapper: createWrapper() })
    result.current.mutate('p-1')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockDeleteDoc).toHaveBeenCalled()
  })
})

describe('useReorderPrompts', () => {
  it('uses batch write to update positions', async () => {
    const batchUpdate = vi.fn()
    const batchCommit = vi.fn().mockResolvedValue(undefined)
    mockWriteBatch.mockReturnValue({ update: batchUpdate, commit: batchCommit })

    const { result } = renderHook(() => useReorderPrompts('wf-1'), { wrapper: createWrapper() })
    result.current.mutate(['p-1', 'p-2', 'p-3'])
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(batchUpdate).toHaveBeenCalledTimes(3)
    expect(batchCommit).toHaveBeenCalledOnce()
  })
})
