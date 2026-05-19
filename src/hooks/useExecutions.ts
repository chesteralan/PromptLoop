import { useQuery } from '@tanstack/react-query'
import { getDocs, orderBy, query, limit, where } from 'firebase/firestore'
import { useAuth } from './useAuth'
import { type ExecutionData } from '../lib/converters'
import { executionsRef } from '../lib/firestore-refs'
import { executionKeys } from '../lib/query-keys'

export function useExecutions(workflowId?: string, resultLimit = 100) {
  const { user } = useAuth()

  return useQuery({
    queryKey: executionKeys.all(user?.uid, workflowId, resultLimit),
    queryFn: async () => {
      if (!user) return []
      const ref = executionsRef(user.uid)
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
