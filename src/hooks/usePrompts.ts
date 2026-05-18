import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

export function usePrompts(workflowId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['prompts', user?.uid, workflowId],
    queryFn: async () => {
      if (!user) return []
      const q = query(
        collection(db, 'users', user.uid, 'workflows', workflowId, 'prompts'),
        orderBy('position', 'asc'),
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!user && !!workflowId,
  })
}
