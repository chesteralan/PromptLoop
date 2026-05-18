import { useState, useEffect } from 'react'

export function useConfiguredProviders() {
  const [providers, setProviders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    window.electronAPI
      .listApiKeys()
      .then((keys) => {
        if (!cancelled) {
          setProviders([...new Set(keys.map((k) => k.provider))])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { configuredProviders: providers, loading }
}
