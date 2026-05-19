import { describe, it, expect } from 'vitest'
import { QueueManager } from '../queue'

const makePrompt = (id: string) => ({
  id,
  title: `Prompt ${id}`,
  content: 'test',
  model: 'gpt-4o',
  position: 0,
  enabled: true,
})

describe('QueueManager', () => {
  it('starts empty', () => {
    const q = new QueueManager()
    expect(q.length).toBe(0)
    expect(q.dequeue()).toBeUndefined()
    expect(q.peek()).toBeUndefined()
  })

  it('enqueues and dequeues in FIFO order', () => {
    const q = new QueueManager()
    q.enqueue(makePrompt('a'))
    q.enqueue(makePrompt('b'))
    expect(q.length).toBe(2)
    expect(q.dequeue()?.id).toBe('a')
    expect(q.dequeue()?.id).toBe('b')
    expect(q.length).toBe(0)
  })

  it('peek returns first item without removal', () => {
    const q = new QueueManager()
    q.enqueue(makePrompt('a'))
    q.enqueue(makePrompt('b'))
    expect(q.peek()?.id).toBe('a')
    expect(q.length).toBe(2)
  })

  it('clear empties all items', () => {
    const q = new QueueManager()
    q.enqueue(makePrompt('a'))
    q.enqueue(makePrompt('b'))
    q.clear()
    expect(q.length).toBe(0)
    expect(q.dequeue()).toBeUndefined()
  })

  it('getAll returns a copy', () => {
    const q = new QueueManager()
    q.enqueue(makePrompt('a'))
    const items = q.getAll()
    items.push(makePrompt('b'))
    expect(q.length).toBe(1)
  })

  it('dequeue returns undefined on empty queue', () => {
    const q = new QueueManager()
    expect(q.dequeue()).toBeUndefined()
  })

  it('peek returns undefined on empty queue', () => {
    const q = new QueueManager()
    expect(q.peek()).toBeUndefined()
  })
})
