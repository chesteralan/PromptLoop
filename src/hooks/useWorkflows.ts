import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'
import { workflowConverter, type WorkflowData } from '../lib/converters'

function workflowsRef(userId: string) {
  return collection(db, 'users', userId, 'workflows').withConverter(workflowConverter)
}

function workflowRef(userId: string, workflowId: string) {
  return doc(db, 'users', userId, 'workflows', workflowId).withConverter(workflowConverter)
}

export function useWorkflows() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['workflows', user?.uid],
    queryFn: async () => {
      if (!user) return []
      const q = query(workflowsRef(user.uid), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!user,
  })
}

export function useWorkflow(id: string | undefined) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['workflows', user?.uid, id],
    queryFn: async () => {
      if (!user || !id) return null
      const snapshot = await getDoc(workflowRef(user.uid, id))
      if (!snapshot.exists()) return null
      return { id: snapshot.id, ...snapshot.data() }
    },
    enabled: !!user && !!id,
  })
}

export function useCreateWorkflow() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<WorkflowData, 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('Not authenticated')
      const now = new Date()
      const docRef = await addDoc(workflowsRef(user.uid), {
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.uid] })
    },
  })
}

export function useUpdateWorkflow() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workflowId,
      data,
    }: {
      workflowId: string
      data: Partial<Omit<WorkflowData, 'createdAt' | 'updatedAt'>>
    }) => {
      if (!user) throw new Error('Not authenticated')
      await updateDoc(workflowRef(user.uid, workflowId), {
        ...data,
        updatedAt: new Date(),
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.uid] })
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.uid, variables.workflowId] })
    },
  })
}

export function useDeleteWorkflow() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (workflowId: string) => {
      if (!user) throw new Error('Not authenticated')
      await deleteDoc(workflowRef(user.uid, workflowId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.uid] })
    },
  })
}
