import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { StreamOptions, ModelInfo } from '../interface'

const { mockStreamText, mockAnthropic } = vi.hoisted(() => ({
  mockStreamText: vi.fn(),
  mockAnthropic: vi.fn(),
}))

vi.mock('ai', () => ({ streamText: mockStreamText }))
vi.mock('@ai-sdk/anthropic', () => ({ anthropic: mockAnthropic }))

async function* makeStream(...chunks: string[]): AsyncIterable<string> {
  for (const c of chunks) yield c
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AnthropicAdapter', () => {
  const createAdapter = async () => {
    const { AnthropicAdapter } = await import('../anthropic')
    return new AnthropicAdapter()
  }

  describe('stream', () => {
    const defaultOpts: StreamOptions = { apiKey: 'sk-ant-test', model: 'claude-3-5-sonnet' }

    it('calls streamText with mapped model id', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({ model: mockAnthropic('claude-3-5-sonnet-20241022') }),
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
        expect.objectContaining({ model: mockAnthropic('custom-model') }),
      )
    })

    it('passes systemPrompt to streamText', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter
        .stream('test', { ...defaultOpts, systemPrompt: 'be concise' })
        [Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ system: 'be concise' }))
    })

    it('uses default temperature of 1', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('hello') })
      const adapter = await createAdapter()
      const iterator = adapter.stream('test', defaultOpts)[Symbol.asyncIterator]()
      await iterator.next()
      expect(mockStreamText).toHaveBeenCalledWith(expect.objectContaining({ temperature: 1 }))
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
    it('returns the 3 hardcoded Claude model entries', async () => {
      const adapter = await createAdapter()
      const models: ModelInfo[] = adapter.models()
      expect(models).toHaveLength(3)
      expect(models.map((m) => m.id)).toEqual([
        'claude-3-5-sonnet',
        'claude-3-5-haiku',
        'claude-3-opus',
      ])
    })
  })

  describe('validateApiKey', () => {
    it('returns true when streamText succeeds', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('ok') })
      const adapter = await createAdapter()
      await expect(adapter.validateApiKey('sk-ant-test')).resolves.toBe(true)
    })

    it('returns false when streamText throws', async () => {
      mockStreamText.mockImplementation(() => {
        throw new Error('invalid')
      })
      const adapter = await createAdapter()
      await expect(adapter.validateApiKey('bad-key')).resolves.toBe(false)
    })

    it('calls streamText with claude-3-5-haiku and 1 token', async () => {
      mockStreamText.mockReturnValue({ textStream: makeStream('ok') })
      const adapter = await createAdapter()
      await adapter.validateApiKey('sk-ant-test')
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: mockAnthropic('claude-3-5-haiku-20241022'),
          prompt: 'test',
          maxOutputTokens: 1,
        }),
      )
    })
  })

  describe('estimateCost', () => {
    it('calculates cost for claude-3-5-sonnet', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('claude-3-5-sonnet', 1000, 500)
      expect(cost).toBe((1000 * 3 + 500 * 15) / 1_000_000)
    })

    it('calculates cost for claude-3-5-haiku', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('claude-3-5-haiku', 1000, 500)
      expect(cost).toBe((1000 * 0.8 + 500 * 4) / 1_000_000)
    })

    it('calculates cost for claude-3-opus', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('claude-3-opus', 1000, 500)
      expect(cost).toBe((1000 * 15 + 500 * 75) / 1_000_000)
    })

    it('falls back to sonnet rates for unknown model', async () => {
      const adapter = await createAdapter()
      const cost = adapter.estimateCost('unknown-model', 1000, 500)
      expect(cost).toBe((1000 * 3 + 500 * 15) / 1_000_000)
    })
  })
})
