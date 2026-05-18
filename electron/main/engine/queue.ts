import type { PromptConfig } from './types'

export class QueueManager {
  private items: PromptConfig[] = []
  private isProcessing = false

  enqueue(prompt: PromptConfig): void {
    this.items.push(prompt)
  }

  dequeue(): PromptConfig | undefined {
    return this.items.shift()
  }

  clear(): void {
    this.items = []
    this.isProcessing = false
  }

  peek(): PromptConfig | undefined {
    return this.items[0]
  }

  get length(): number {
    return this.items.length
  }

  get processing(): boolean {
    return this.isProcessing
  }

  setProcessing(v: boolean): void {
    this.isProcessing = v
  }

  getAll(): PromptConfig[] {
    return [...this.items]
  }
}
