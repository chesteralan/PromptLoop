import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

export function useExecutions(workflowId?: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['executions', user?.uid, workflowId],
    queryFn: async () => {
      if (!user) return []
      const q = workflowId
        ? query(
            collection(db, 'users', user.uid, 'executions'),
            orderBy('createdAt', 'desc'),
            limit(100),
          )
        : query(
            collection(db, 'users', user.uid, 'executions'),
            orderBy('createdAt', 'desc'),
            limit(100),
          )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!user,
  })
}
