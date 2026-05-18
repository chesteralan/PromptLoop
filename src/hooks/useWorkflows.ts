import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

export function useWorkflows() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['workflows', user?.uid],
    queryFn: async () => {
      if (!user) return []
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'workflows'))
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!user,
  })
}
