import { useState, useMemo } from 'react'
import { MODELS, type ModelInfo } from '../lib/models'
import { useConfiguredProviders } from './useConfiguredProviders'

export function useModelSearch() {
  const [search, setSearch] = useState('')
  const { configuredProviders, loading } = useConfiguredProviders()

  const groupedModels = useMemo(
    () =>
      Object.entries(
        MODELS.reduce<Record<string, ModelInfo[]>>((acc, m) => {
          ;(acc[m.provider] ??= []).push(m)
          return acc
        }, {}),
      ),
    [],
  )

  const visibleGroups = useMemo(
    () => groupedModels.filter(([provider]) => configuredProviders.includes(provider)),
    [groupedModels, configuredProviders],
  )

  const filtered = useMemo(
    () =>
      search
        ? visibleGroups
            .map(
              ([provider, models]) =>
                [
                  provider,
                  models.filter(
                    (m) =>
                      m.name.toLowerCase().includes(search.toLowerCase()) ||
                      m.id.toLowerCase().includes(search.toLowerCase()),
                  ),
                ] as const,
            )
            .filter(([, models]) => models.length > 0)
        : visibleGroups,
    [search, visibleGroups],
  )

  const noKeysConfigured = !loading && configuredProviders.length === 0

  return { search, setSearch, filtered, noKeysConfigured, groupedModels: visibleGroups }
}
