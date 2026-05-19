import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useConfiguredProviders } from '../useConfiguredProviders'

const mockListApiKeys = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  mockListApiKeys.mockResolvedValue([
    { id: '1', provider: 'openai', keyPrefix: 'sk-', createdAt: '2024-01-01' },
    { id: '2', provider: 'openai', keyPrefix: 'sk-', createdAt: '2024-01-02' },
    { id: '3', provider: 'anthropic', keyPrefix: 'sk-ant-', createdAt: '2024-01-03' },
  ])
  window.electronAPI = { listApiKeys: mockListApiKeys } as any
})

describe('useConfiguredProviders', () => {
  it('fetches keys and deduplicates by provider on mount', async () => {
    const { result } = renderHook(() => useConfiguredProviders())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(mockListApiKeys).toHaveBeenCalledOnce()
    expect(result.current.configuredProviders).toEqual(['openai', 'anthropic'])
    expect(result.current.error).toBeNull()
  })

  it('sets error on timeout after 10 seconds', async () => {
    vi.useFakeTimers()
    mockListApiKeys.mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useConfiguredProviders())

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.error).toBe('Request timed out')
    expect(result.current.loading).toBe(false)
    vi.useRealTimers()
  })

  it('sets error when fetch fails', async () => {
    mockListApiKeys.mockRejectedValue(new Error('network error'))
    const { result } = renderHook(() => useConfiguredProviders())

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch configured providers')
    })
    expect(result.current.loading).toBe(false)
  })

  it('does not update state after unmount via abort signal', async () => {
    const { result, unmount } = renderHook(() => useConfiguredProviders())

    expect(mockListApiKeys).toHaveBeenCalledOnce()
    unmount()

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(true)
    })
  })

  it('refetch re-fetches providers', async () => {
    mockListApiKeys.mockResolvedValue([])
    const { result } = renderHook(() => useConfiguredProviders())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.configuredProviders).toEqual([])

    mockListApiKeys.mockResolvedValue([
      { id: '4', provider: 'google', keyPrefix: 'gemini-', createdAt: '2024-02-01' },
    ])

    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.configuredProviders).toEqual(['google'])
    })
  })
})
