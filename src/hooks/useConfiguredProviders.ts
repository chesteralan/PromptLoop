import { useState, useEffect, useCallback } from 'react'

export function useConfiguredProviders() {
  const [providers, setProviders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)

    const timeout = setTimeout(() => {
      if (!signal?.aborted) {
        setError('Request timed out')
        setLoading(false)
      }
    }, 10_000)

    try {
      const keys = await window.electronAPI.listApiKeys()
      if (!signal?.aborted) {
        setProviders([...new Set(keys.map((k) => k.provider))])
      }
    } catch {
      if (!signal?.aborted) setError('Failed to fetch configured providers')
    } finally {
      clearTimeout(timeout)
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    fetchProviders(ac.signal)
    return () => ac.abort()
  }, [fetchProviders])

  return { configuredProviders: providers, loading, error, refetch: fetchProviders }
}
