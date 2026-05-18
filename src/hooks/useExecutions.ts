import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, limit, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'
import { executionConverter, type ExecutionData } from '../lib/converters'

export function useExecutions(workflowId?: string, resultLimit = 100) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['executions', user?.uid, workflowId, resultLimit],
    queryFn: async () => {
      if (!user) return []
      const ref = collection(db, 'users', user.uid, 'executions').withConverter(executionConverter)
      const q = workflowId
        ? query(
            ref,
            where('workflowId', '==', workflowId),
            orderBy('createdAt', 'desc'),
            limit(resultLimit),
          )
        : query(ref, orderBy('createdAt', 'desc'), limit(resultLimit))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (ExecutionData & {
        id: string
      })[]
    },
    enabled: !!user,
  })
}
