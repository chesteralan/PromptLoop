import { useEffect } from 'react'
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'
import { useWorkflowStore } from '../store/workflowStore'

export function useWorkflowSnapshot(workflowId: string | undefined) {
  const { user } = useAuth()
  const updateWorkflow = useWorkflowStore((s) => s.updateWorkflow)
  const setActiveWorkflow = useWorkflowStore((s) => s.setActiveWorkflow)

  useEffect(() => {
    if (!user || !workflowId) return

    setActiveWorkflow(workflowId)

    const unsub = onSnapshot(
      doc(db, 'users', user.uid, 'workflows', workflowId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as DocumentData
          updateWorkflow(workflowId, { id: workflowId, ...data })
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
