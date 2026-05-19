import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { StreamOptions, ModelInfo } from '../interface'

const { mockStreamText, mockGoogle } = vi.hoisted(() => ({
  mockStreamText: vi.fn(),
  mockGoogle: vi.fn(),
}))

vi.mock('ai', () => ({ streamText: mockStreamText }))
vi.mock('@ai-sdk/google', () => ({ google: mockGoogle }))

async function* makeStream(...chunks: string[]): AsyncIterable<string> {
  for (const c of chunks) yield c
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GoogleAdapter', () => {
  const createAdapter = async () => {
    const { GoogleAdapter } = await import('../google')
    return new GoogleAdapter()
  }

  describe('stream', () => {
    const defaultOpts: StreamOptions = { apiKey: 'gemini-key', model: 'gemini-2.0-flash' }

    it('calls streamText with mapped model id', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ model: mockGoogle('gemini-2.0-flash') }),
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
        expect.objectContaining({ model: mockGoogle('custom-model') }),
      )
    })

    it('passes systemPrompt to streamText', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, systemPrompt: 'be brief' })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ system: 'be brief' }))
    })

    it('uses default temperature of 1', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ temperature: 1 }))
    })

    it('uses default maxTokens of 8192 (different from other providers)', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ maxOutputTokens: 8192 }),
      )
    })

    it('passes custom maxTokens', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, maxTokens: 4096 })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ maxOutputTokens: 4096 }),
      )
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
    it('returns the 3 hardcoded Gemini model entries', async () => {
      const adapter = await createAdapter()
      const models: ModelInfo[] = adapter.models()
      expect(models).toHaveLength(3)
      expect(models.map((m) => m.id)).toEqual([
        'gemini-2.0-flash',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
      ])
    })
  })

  describe('validateApiKey', () => {
    it('returns true when streamText succeeds', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('ok') })
      const adapter = await createAdapter()
      await expect(adapter.validateApiKey('gemini-key')).resolves.toBe(true)
    })

    it('returns false when streamText throws', async () => {
      mockStreamText.mockImplementation(() => {
        throw new Error('invalid')
      })
      const adapter = await createAdapter()
      await expect(adapter.validateApiKey('bad-key')).resolves.toBe(false)
    })

    it('calls streamText with gemini-2.0-flash and 1 token', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('ok') })
      const adapter = await createAdapter()
      await adapter.validateApiKey('gemini-key')
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: mockGoogle('gemini-2.0-flash'),
          prompt: 'test',
          maxOutputTokens: 1,
        }),
      )
    })
  })

  describe('estimateCost', () => {
    it('calculates cost for gemini-2.0-flash', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gemini-2.0-flash', 1000, 500)
      expect(cost).toBe((1000 * 0.1 + 500 * 0.4) / 1_000_000)
    })

    it('calculates cost for gemini-1.5-pro', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gemini-1.5-pro', 1000, 500)
      expect(cost).toBe((1000 * 1.25 + 500 * 5) / 1_000_000)
    })

    it('calculates cost for gemini-1.5-flash', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('gemini-1.5-flash', 1000, 500)
      expect(cost).toBe((1000 * 0.075 + 500 * 0.3) / 1_000_000)
    })

    it('falls back to flash rates for unknown model', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('unknown-model', 1000, 500)
      expect(cost).toBe((1000 * 0.1 + 500 * 0.4) / 1_000_000)
    })
  })
})
