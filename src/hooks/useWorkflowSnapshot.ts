import { useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'
import { useWorkflowStore } from '../store/workflowStore'
import { workflowConverter } from '../lib/converters'

export function useWorkflowSnapshot(workflowId: string | undefined) {
  const { user } = useAuth()
  const updateWorkflow = useWorkflowStore((s) => s.updateWorkflow)
  const setActiveWorkflow = useWorkflowStore((s) => s.setActiveWorkflow)

  useEffect(() => {
    if (!user || !workflowId) return

    setActiveWorkflow(workflowId)

    const unsub = onSnapshot(
      doc(db, 'users', user.uid, 'workflows', workflowId).withConverter(workflowConverter),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          updateWorkflow(workflowId, {
            id: workflowId,
            ...data,
            createdAt:
              data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt,
            updatedAt:
              data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt,
          })
        }
      },
      (error) => {
        console.warn('Workflow snapshot error:', error.message)
      },
    )

    return () => {
      unsub()
      setActiveWorkflow(null)
    }
  }, [user, workflowId, updateWorkflow, setActiveWorkflow])
}
