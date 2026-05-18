import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  workflowConverter,
  promptConverter,
  executionConverter,
  type WorkflowData,
  type PromptData,
  type ExecutionData,
} from './converters'

function userPath(userId: string) {
  return {
    workflows: collection(db, 'users', userId, 'workflows').withConverter(workflowConverter),
    workflow: (id: string) =>
      doc(db, 'users', userId, 'workflows', id).withConverter(workflowConverter),
    prompts: (workflowId: string) =>
      collection(db, 'users', userId, 'workflows', workflowId, 'prompts').withConverter(
        promptConverter,
      ),
    prompt: (workflowId: string, promptId: string) =>
      doc(db, 'users', userId, 'workflows', workflowId, 'prompts', promptId).withConverter(
        promptConverter,
      ),
    executions: (workflowId: string) =>
      collection(db, 'users', userId, 'workflows', workflowId, 'executions').withConverter(
        executionConverter,
      ),
  }
}

export async function createWorkflow(
  userId: string,
  data: Omit<WorkflowData, 'createdAt' | 'updatedAt'>,
) {
  const now = new Date()
  const docRef = await addDoc(userPath(userId).workflows, {
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

export async function updateWorkflow(
  userId: string,
  workflowId: string,
  data: Partial<Omit<WorkflowData, 'createdAt' | 'updatedAt'>>,
) {
  await updateDoc(userPath(userId).workflow(workflowId), {
    ...data,
    updatedAt: new Date(),
  })
}

export async function deleteWorkflow(userId: string, workflowId: string) {
  await deleteDoc(userPath(userId).workflow(workflowId))
}

export async function createPrompt(
  userId: string,
  workflowId: string,
  data: Omit<PromptData, 'position' | 'createdAt' | 'updatedAt'>,
) {
  const existing = await getDocs(
    query(userPath(userId).prompts(workflowId), orderBy('position', 'desc')),
  )
  const nextPosition = existing.docs.length > 0 ? existing.docs[0].data().position + 1 : 0
  const now = new Date()
  const docRef = await addDoc(userPath(userId).prompts(workflowId), {
    ...data,
    position: nextPosition,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

export async function updatePrompt(
  userId: string,
  workflowId: string,
  promptId: string,
  data: Partial<Omit<PromptData, 'createdAt' | 'updatedAt'>>,
) {
  await updateDoc(userPath(userId).prompt(workflowId, promptId), {
    ...data,
    updatedAt: new Date(),
  })
}

export async function deletePrompt(userId: string, workflowId: string, promptId: string) {
  await deleteDoc(userPath(userId).prompt(workflowId, promptId))
}

export async function reorderPrompts(userId: string, workflowId: string, orderedIds: string[]) {
  const batch = writeBatch(db)
  const path = userPath(userId)
  orderedIds.forEach((id, index) => {
    batch.update(path.prompt(workflowId, id), { position: index, updatedAt: new Date() })
  })
  await batch.commit()
}

export async function createExecution(
  userId: string,
  workflowId: string,
  data: Omit<ExecutionData, 'createdAt'>,
) {
  const now = new Date()
  const docRef = await addDoc(userPath(userId).executions(workflowId), {
    ...data,
    createdAt: now,
  })
  return docRef.id
}
