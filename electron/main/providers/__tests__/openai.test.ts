import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { StreamOptions, ModelInfo } from '../interface'

const { mockStreamText, mockOpenai } = vi.hoisted(() => ({
  mockStreamText: vi.fn(),
  mockOpenai: vi.fn(),
}))

vi.mock('ai', () => ({ streamText: mockStreamText }))
vi.mock('@ai-sdk/openai', () => ({ openai: mockOpenai }))

async function* makeStream(...chunks: string[]): AsyncIterable<string> {
  for (const c of chunks) yield c
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('OpenAIAdapter', () => {
  const createAdapter = async () => {
    const { OpenAIAdapter } = await import('../openai')
    return new OpenAIAdapter()
  }

  describe('stream', () => {
    const defaultOpts: StreamOptions = { apiKey: 'sk-test', model: 'gpt-4o' }

    it('calls streamText with mapped model', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test prompt', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ model: mockOpenai('gpt-4o'), prompt: 'test prompt' }),
      )
    })

    it('passes through unknown model IDs without mapping', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, model: 'custom-model' })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ model: mockOpenai('custom-model') }),
      )
    })

    it('passes systemPrompt to streamText', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, systemPrompt: 'be helpful' })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ system: 'be helpful' }))
    })

    it('uses default temperature of 1', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ temperature: 1 }))
    })

    it('passes custom temperature', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, temperature: 0.3 })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ temperature: 0.3 }))
    })

    it('uses default maxTokens of 1024', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ maxOutputTokens: 1024 }),
      )
    })

    it('passes custom maxTokens', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, maxTokens: 2048 })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ maxOutputTokens: 2048 }),
      )
    })

    it('passes abortSignal', async () => {
      const signal = new AbortController().signal
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', { ...defaultOpts, signal })[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ abortSignal: signal }))
    })

    it('returns textStream from streamText result', async () => {
      const textStream = makeStream('chunk-1', 'chunk-2')
      mockStreamText.mockReturnValue({ textStream })
      const adapter = await createAdapter()
      const chunks: string[] = []
      for await (const c of adapter.stream('test', defaultOpts)) {
        chunks.push(c)
      }
      expect(chunks).toEqual(['chunk-1', 'chunk-2'])
    })
  })

  describe('models', () => {
    it('returns the 5 hardcoded GPT model entries', async () => {
      const adapter = await createAdapter()
      const models: ModelInfo[] = adapter.models()
      expect(models).toHaveLength(5)
      expect(models.map((m) => m.id)).toEqual([
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
      ])
    })
  })

  describe('validateApiKey', () => {
    it('returns true when streamText succeeds', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('ok') })
      const adapter = await createAdapter()
      await expect(adapter.validateApiKey('sk-test')).resolves.toBe(true)
    })

    it('returns false when streamText throws', async () => {
      mockStreamText.mockImplementation(() => {
        throw new Error('invalid API key')
      })
      const adapter = await createAdapter()
      await expect(adapter.validateApiKey('bad-key')).resolves.toBe(false)
    })

    it('calls streamText with gpt-4o-mini and 1 token', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('ok') })
      const adapter = await createAdapter()
      await adapter.validateApiKey('sk-test')
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: mockOpenai('gpt-4o-mini'),
          prompt: 'test',
          maxOutputTokens: 1,
        }),
      )
    })
  })

  describe('estimateCost', () => {
    it('calculates cost for gpt-4o using correct rates', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gpt-4o', 1000, 500)
      expect(cost).toBe((1000 * 2.5 + 500 * 10) / 1_000_000)
    })

    it('calculates cost for gpt-4o-mini', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gpt-4o-mini', 1000, 500)
      expect(cost).toBe((1000 * 0.15 + 500 * 0.6) / 1_000_000)
    })

    it('calculates cost for gpt-4-turbo', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gpt-4-turbo', 1000, 500)
      expect(cost).toBe((1000 * 10 + 500 * 30) / 1_000_000)
    })

    it('calculates cost for gpt-4', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gpt-4', 1000, 500)
      expect(cost).toBe((1000 * 30 + 500 * 60) / 1_000_000)
    })

    it('calculates cost for gpt-3.5-turbo', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gpt-3.5-turbo', 1000, 500)
      expect(cost).toBe((1000 * 0.5 + 500 * 1.5) / 1_000_000)
    })

    it('falls back to gpt-4o rates for unknown model', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('unknown-model', 1000, 500)
      expect(cost).toBe((1000 * 2.5 + 500 * 10) / 1_000_000)
    })
  })
})
