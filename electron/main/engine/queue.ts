import type { PromptConfig } from './types'

export class QueueManager {
  private items: PromptConfig[] = []

  enqueue(prompt: PromptConfig): void {
    this.items.push(prompt)
  }

  dequeue(): PromptConfig | undefined {
    return this.items.shift()
  }

  clear(): void {
    this.items = []
  }

  peek(): PromptConfig | undefined {
    return this.items[0]
  }

  get length(): number {
    return this.items.length
  }

  getAll(): PromptConfig[] {
    return [...this.items]
  }
}
