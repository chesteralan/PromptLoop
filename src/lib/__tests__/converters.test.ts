import { describe, it, expect, vi } from 'vitest'

vi.mock('firebase/firestore', () => {
  class Timestamp {
    seconds: number
    nanoseconds: number
    constructor(seconds: number, nanoseconds: number) {
      this.seconds = seconds
      this.nanoseconds = nanoseconds
    }
    toDate() {
      return new Date(this.seconds * 1000 + this.nanoseconds / 1e6)
    }
    static fromDate(d: Date) {
      return new Timestamp(Math.floor(d.getTime() / 1000), (d.getTime() % 1000) * 1e6)
    }
    static now() {
      return Timestamp.fromDate(new Date())
    }
  }
  return { Timestamp }
})

import {
  workflowConverter,
  promptConverter,
  executionConverter,
  apiKeyConverter,
} from '../converters'
import { Timestamp } from 'firebase/firestore'

function makeSnapshot(data: Record<string, unknown>) {
  return { data: vi.fn(() => data) }
}

const baseDate = new Date('2025-01-01T00:00:00Z')
const ts = Timestamp.fromDate(baseDate)

describe('workflowConverter', () => {
  it('toFirestore serializes with timestamps', () => {
    const result = workflowConverter.toFirestore({
      name: 'test',
      status: 'active',
      loopMode: 'sequential',
      maxIterations: 5,
      createdAt: baseDate,
      updatedAt: baseDate,
    })
    expect(result.createdAt).toBeInstanceOf(Timestamp)
    expect(result.updatedAt).toBeInstanceOf(Timestamp)
    expect(result.name).toBe('test')
    expect(result.status).toBe('active')
  })

  it('toFirestore leaves undefined maxIterations as undefined', () => {
    const result = workflowConverter.toFirestore({
      name: 'test',
      status: 'active',
      loopMode: 'sequential',
      createdAt: baseDate,
      updatedAt: baseDate,
    })
    expect(result.maxIterations).toBeUndefined()
  })

  it('fromFirestore deserializes with dates', () => {
    const snapshot = makeSnapshot({
      name: 'test',
      status: 'active',
      loopMode: 'sequential',
      createdAt: ts,
      updatedAt: ts,
    })
    const result = workflowConverter.fromFirestore(snapshot as never, {} as never)
    expect(result.createdAt).toEqual(baseDate)
    expect(result.updatedAt).toEqual(baseDate)
    expect(result.name).toBe('test')
  })
})

describe('promptConverter', () => {
  it('toFirestore serializes with timestamps', () => {
    const result = promptConverter.toFirestore({
      workflowId: 'w1',
      title: 'prompt1',
      content: 'hello',
      model: 'gpt-4',
      position: 0,
      enabled: true,
      temperature: 0.7,
      createdAt: baseDate,
      updatedAt: baseDate,
    })
    expect(result.createdAt).toBeInstanceOf(Timestamp)
    expect(result.updatedAt).toBeInstanceOf(Timestamp)
    expect(result.model).toBe('gpt-4')
    expect(result.position).toBe(0)
    expect(result.temperature).toBe(0.7)
  })

  it('toFirestore leaves undefined optionals as undefined', () => {
    const result = promptConverter.toFirestore({
      workflowId: 'w1',
      title: 'p',
      content: 'c',
      model: 'gpt-4',
      position: 1,
      enabled: false,
      createdAt: baseDate,
      updatedAt: baseDate,
    })
    expect(result.systemPrompt).toBeUndefined()
    expect(result.temperature).toBeUndefined()
    expect(result.maxTokens).toBeUndefined()
    expect(result.delayMs).toBeUndefined()
  })

  it('fromFirestore deserializes with dates', () => {
    const snapshot = makeSnapshot({
      workflowId: 'w1',
      title: 'prompt1',
      content: 'hello',
      model: 'gpt-4',
      position: 0,
      enabled: true,
      createdAt: ts,
      updatedAt: ts,
    })
    const result = promptConverter.fromFirestore(snapshot as never, {} as never)
    expect(result.createdAt).toEqual(baseDate)
    expect(result.updatedAt).toEqual(baseDate)
  })
})

describe('executionConverter', () => {
  it('toFirestore serializes with timestamps', () => {
    const result = executionConverter.toFirestore({
      workflowId: 'w1',
      promptId: 'p1',
      status: 'running',
      createdAt: baseDate,
    })
    expect(result.createdAt).toBeInstanceOf(Timestamp)
    expect(result.startedAt).toBeNull()
    expect(result.completedAt).toBeNull()
  })

  it('toFirestore includes startedAt/completedAt when present', () => {
    const result = executionConverter.toFirestore({
      workflowId: 'w1',
      promptId: 'p1',
      status: 'completed',
      startedAt: baseDate,
      completedAt: baseDate,
      createdAt: baseDate,
    })
    expect(result.startedAt).toBeInstanceOf(Timestamp)
    expect(result.completedAt).toBeInstanceOf(Timestamp)
  })

  it('fromFirestore deserializes optional timestamps with optTS', () => {
    const snapshot = makeSnapshot({
      workflowId: 'w1',
      promptId: 'p1',
      status: 'running',
      startedAt: null,
      completedAt: null,
      createdAt: ts,
    })
    const result = executionConverter.fromFirestore(snapshot as never, {} as never)
    expect(result.createdAt).toEqual(baseDate)
    expect(result.startedAt).toBeUndefined()
    expect(result.completedAt).toBeUndefined()
  })

  it('fromFirestore deserializes present optional timestamps', () => {
    const snapshot = makeSnapshot({
      workflowId: 'w1',
      promptId: 'p1',
      status: 'completed',
      startedAt: ts,
      completedAt: ts,
      createdAt: ts,
    })
    const result = executionConverter.fromFirestore(snapshot as never, {} as never)
    expect(result.startedAt).toEqual(baseDate)
    expect(result.completedAt).toEqual(baseDate)
  })
})

describe('apiKeyConverter', () => {
  it('toFirestore serializes with timestamps', () => {
    const result = apiKeyConverter.toFirestore({
      provider: 'openai',
      keyPrefix: 'sk-***',
      encryptedKey: 'encrypted',
      createdAt: baseDate,
    })
    expect(result.createdAt).toBeInstanceOf(Timestamp)
    expect(result.lastUsedAt).toBeNull()
  })

  it('toFirestore includes lastUsedAt when present', () => {
    const result = apiKeyConverter.toFirestore({
      provider: 'openai',
      keyPrefix: 'sk-***',
      encryptedKey: 'encrypted',
      lastUsedAt: baseDate,
      createdAt: baseDate,
    })
    expect(result.lastUsedAt).toBeInstanceOf(Timestamp)
  })

  it('fromFirestore deserializes dates', () => {
    const snapshot = makeSnapshot({
      provider: 'openai',
      keyPrefix: 'sk-***',
      encryptedKey: 'encrypted',
      lastUsedAt: null,
      createdAt: ts,
    })
    const result = apiKeyConverter.fromFirestore(snapshot as never, {} as never)
    expect(result.createdAt).toEqual(baseDate)
    expect(result.lastUsedAt).toBeUndefined()
  })

  it('fromFirestore deserializes present lastUsedAt', () => {
    const snapshot = makeSnapshot({
      provider: 'openai',
      keyPrefix: 'sk-***',
      encryptedKey: 'encrypted',
      lastUsedAt: ts,
      createdAt: ts,
    })
    const result = apiKeyConverter.fromFirestore(snapshot as never, {} as never)
    expect(result.lastUsedAt).toEqual(baseDate)
  })
})
