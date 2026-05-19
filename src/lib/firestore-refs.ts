import { collection, doc } from 'firebase/firestore'
import { db } from './firebase'
import { workflowConverter } from './converters'
import { promptConverter } from './converters'
import { executionConverter } from './converters'

export function workflowsRef(userId: string) {
  return collection(db, 'users', userId, 'workflows').withConverter(workflowConverter)
}

export function workflowRef(userId: string, workflowId: string) {
  return doc(db, 'users', userId, 'workflows', workflowId).withConverter(workflowConverter)
}

export function promptsRef(userId: string, workflowId: string) {
  return collection(db, 'users', userId, 'workflows', workflowId, 'prompts').withConverter(
    promptConverter,
  )
}

export function promptRef(userId: string, workflowId: string, promptId: string) {
  return doc(db, 'users', userId, 'workflows', workflowId, 'prompts', promptId).withConverter(
    promptConverter,
  )
}

export function executionsRef(userId: string) {
  return collection(db, 'users', userId, 'executions').withConverter(executionConverter)
}

export function userDocRef(userId: string) {
  return doc(db, 'users', userId)
}
