import { useState, useCallback } from 'react'

export function useConfirmDelete() {
  const [showDelete, setShowDelete] = useState(false)

  const requestConfirm = useCallback(() => setShowDelete(true), [])
  const cancelConfirm = useCallback(() => setShowDelete(false), [])

  return { showDelete, requestConfirm, cancelConfirm }
}
