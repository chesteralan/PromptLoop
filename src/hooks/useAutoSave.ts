import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoSaveOptions<T> {
  data: T
  isNew: boolean
  save: (data: T) => Promise<void>
  delay?: number
  onSaveStart?: () => void
  onSaveEnd?: () => void
}

export function useAutoSave<T>({
  data,
  isNew,
  save,
  delay = 2000,
  onSaveStart,
  onSaveEnd,
}: UseAutoSaveOptions<T>) {
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef(JSON.stringify(data))

  const saveNow = useCallback(async () => {
    if (isNew) return
    setIsSaving(true)
    onSaveStart?.()
    try {
      await save(data)
      lastSavedRef.current = JSON.stringify(data)
      setIsDirty(false)
    } finally {
      setIsSaving(false)
      onSaveEnd?.()
    }
  }, [data, isNew, save, onSaveStart, onSaveEnd])

  useEffect(() => {
    if (isNew) return

    const current = JSON.stringify(data)
    if (current === lastSavedRef.current) {
      setIsDirty(false)
      return
    }

    setIsDirty(true)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(saveNow, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, delay, isNew, saveNow])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        saveNow()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveNow])

  return { isDirty, isSaving, saveNow }
}
