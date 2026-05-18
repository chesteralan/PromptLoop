import {
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
} from 'firebase/firestore'
import type { WorkflowStatus, ExecutionStatus, LoopMode } from '../../electron/shared/types'

export interface WorkflowData {
  name: string
  status: WorkflowStatus
  loopMode: LoopMode
  maxIterations?: number
  createdAt: Date
  updatedAt: Date
}

export interface PromptData {
  workflowId: string
  title: string
  content: string
  systemPrompt?: string
  model: string
  position: number
  enabled: boolean
  temperature?: number
  maxTokens?: number
  delayMs?: number
  createdAt: Date
  updatedAt: Date
}

export interface ExecutionData {
  workflowId: string
  promptId: string
  status: ExecutionStatus
  input?: string
  output?: string
  tokensIn?: number
  tokensOut?: number
  durationMs?: number
  error?: string
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
}

export interface ApiKeyData {
  provider: string
  keyPrefix: string
  encryptedKey: string
  createdAt: Date
  lastUsedAt?: Date
}

const workflowConverter: FirestoreDataConverter<WorkflowData> = {
  toFirestore(model) {
    return {
      name: model.name,
      status: model.status,
      loopMode: model.loopMode,
      maxIterations: model.maxIterations,
      createdAt: Timestamp.fromDate(model.createdAt as Date),
      updatedAt: Timestamp.fromDate(model.updatedAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as WorkflowData
  },
}

const promptConverter: FirestoreDataConverter<PromptData> = {
  toFirestore(model) {
    return {
      workflowId: model.workflowId,
      title: model.title,
      content: model.content,
      systemPrompt: model.systemPrompt,
      model: model.model,
      position: model.position,
      enabled: model.enabled,
      temperature: model.temperature,
      maxTokens: model.maxTokens,
      delayMs: model.delayMs,
      createdAt: Timestamp.fromDate(model.createdAt as Date),
      updatedAt: Timestamp.fromDate(model.updatedAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as PromptData
  },
}

const executionConverter: FirestoreDataConverter<ExecutionData> = {
  toFirestore(model) {
    return {
      workflowId: model.workflowId,
      promptId: model.promptId,
      status: model.status,
      input: model.input,
      output: model.output,
      tokensIn: model.tokensIn,
      tokensOut: model.tokensOut,
      durationMs: model.durationMs,
      error: model.error,
      startedAt: model.startedAt ? Timestamp.fromDate(model.startedAt as Date) : null,
      completedAt: model.completedAt ? Timestamp.fromDate(model.completedAt as Date) : null,
      createdAt: Timestamp.fromDate(model.createdAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      startedAt: (data.startedAt as Timestamp | undefined)?.toDate(),
      completedAt: (data.completedAt as Timestamp | undefined)?.toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
    } as ExecutionData
  },
}

const apiKeyConverter: FirestoreDataConverter<ApiKeyData> = {
  toFirestore(model) {
    return {
      provider: model.provider,
      keyPrefix: model.keyPrefix,
      encryptedKey: model.encryptedKey,
      lastUsedAt: model.lastUsedAt ? Timestamp.fromDate(model.lastUsedAt as Date) : null,
      createdAt: Timestamp.fromDate(model.createdAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      lastUsedAt: (data.lastUsedAt as Timestamp | undefined)?.toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
    } as ApiKeyData
  },
}

function migrateDocument<T extends { version?: number }>(doc: T): T {
  let current = { ...doc }
  if (!current.version || current.version < 1) {
    current = { ...current, version: 1 }
  }
  return current
}

export { workflowConverter, promptConverter, executionConverter, apiKeyConverter, migrateDocument }
