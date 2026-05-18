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

function ts(d: Date): Timestamp {
  return Timestamp.fromDate(d)
}

function fromTS(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate()
  if (v instanceof Date) return v
  return new Date()
}

function optTS(v: unknown): Date | undefined {
  if (v == null) return undefined
  return fromTS(v)
}

const workflowConverter: FirestoreDataConverter<WorkflowData> = {
  toFirestore(model) {
    return {
      name: model.name,
      status: model.status,
      loopMode: model.loopMode,
      maxIterations: model.maxIterations,
      createdAt: ts(model.createdAt as Date),
      updatedAt: ts(model.updatedAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      createdAt: fromTS(data.createdAt),
      updatedAt: fromTS(data.updatedAt),
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
      createdAt: ts(model.createdAt as Date),
      updatedAt: ts(model.updatedAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      createdAt: fromTS(data.createdAt),
      updatedAt: fromTS(data.updatedAt),
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
      startedAt: model.startedAt ? ts(model.startedAt as Date) : null,
      completedAt: model.completedAt ? ts(model.completedAt as Date) : null,
      createdAt: ts(model.createdAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      startedAt: optTS(data.startedAt),
      completedAt: optTS(data.completedAt),
      createdAt: fromTS(data.createdAt),
    } as ExecutionData
  },
}

const apiKeyConverter: FirestoreDataConverter<ApiKeyData> = {
  toFirestore(model) {
    return {
      provider: model.provider,
      keyPrefix: model.keyPrefix,
      encryptedKey: model.encryptedKey,
      lastUsedAt: model.lastUsedAt ? ts(model.lastUsedAt as Date) : null,
      createdAt: ts(model.createdAt as Date),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)
    return {
      ...data,
      lastUsedAt: optTS(data.lastUsedAt),
      createdAt: fromTS(data.createdAt),
    } as ApiKeyData
  },
}

export { workflowConverter, promptConverter, executionConverter, apiKeyConverter }
