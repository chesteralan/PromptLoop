import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore'
import { toast } from 'sonner'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'
import { type PromptData } from '../lib/converters'
import { promptsRef, promptRef } from '../lib/firestore-refs'
import { promptKeys } from '../lib/query-keys'

function promptsRefWithConverter(userId: string, workflowId: string) {
  return promptsRef(userId, workflowId)
}

function promptRefWithConverter(userId: string, workflowId: string, promptId: string) {
  return promptRef(userId, workflowId, promptId)
}

type CreatePromptInput = Omit<PromptData, 'workflowId' | 'createdAt' | 'updatedAt'>
type UpdatePromptInput = {
  promptId: string
  data: Partial<Omit<PromptData, 'createdAt' | 'updatedAt'>>
}

export function usePrompts(workflowId: string | undefined) {
  const { user } = useAuth()

  return useQuery({
    queryKey: promptKeys.all(user?.uid, workflowId),
    queryFn: async () => {
      if (!user || !workflowId) return []
      const q = query(promptsRefWithConverter(user.uid, workflowId), orderBy('position', 'asc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!user && !!workflowId,
  })
}

export function useCreatePrompt(workflowId: string | undefined) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePromptInput) => {
      if (!user || !workflowId) throw new Error('Not authenticated or missing workflow')
      const now = new Date()
      const docRef = await addDoc(promptsRefWithConverter(user.uid, workflowId), {
        ...data,
        workflowId,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all(user?.uid, workflowId) })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create prompt')
    },
  })
}

export function useUpdatePrompt(workflowId: string | undefined) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ promptId, data }: UpdatePromptInput) => {
      if (!user || !workflowId) throw new Error('Not authenticated or missing workflow')
      await updateDoc(promptRefWithConverter(user.uid, workflowId, promptId), {
        ...data,
        updatedAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all(user?.uid, workflowId) })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update prompt')
    },
  })
}

export function useDeletePrompt(workflowId: string | undefined) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (promptId: string) => {
      if (!user || !workflowId) throw new Error('Not authenticated or missing workflow')
      await deleteDoc(promptRefWithConverter(user.uid, workflowId, promptId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all(user?.uid, workflowId) })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete prompt')
    },
  })
}

export function useReorderPrompts(workflowId: string | undefined) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      if (!user || !workflowId) throw new Error('Not authenticated or missing workflow')
      const batch = writeBatch(db)
      orderedIds.forEach((id, index) => {
        const ref = promptRefWithConverter(user.uid, workflowId, id)
        batch.update(ref, { position: index, updatedAt: new Date() })
      })
      await batch.commit()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all(user?.uid, workflowId) })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to reorder prompts')
    },
  })
}
