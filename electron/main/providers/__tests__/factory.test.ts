import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockOpenAIInstance = { name: 'openai' }
const mockAnthropicInstance = { name: 'anthropic' }
const mockGoogleInstance = { name: 'google' }

const { MockOpenAIAdapter, MockAnthropicAdapter, MockGoogleAdapter } = vi.hoisted(() => ({
  MockOpenAIAdapter: vi.fn(),
  MockAnthropicAdapter: vi.fn(),
  MockGoogleAdapter: vi.fn(),
}))

vi.mock('../openai', () => ({ OpenAIAdapter: MockOpenAIAdapter }))
vi.mock('../anthropic', () => ({ AnthropicAdapter: MockAnthropicAdapter }))
vi.mock('../google', () => ({ GoogleAdapter: MockGoogleAdapter }))

beforeEach(() => {
  vi.resetModules()
  MockOpenAIAdapter.mockImplementation(function () {
    return mockOpenAIInstance
  })
  MockAnthropicAdapter.mockImplementation(function () {
    return mockAnthropicInstance
  })
  MockGoogleAdapter.mockImplementation(function () {
    return mockGoogleInstance
  })
})

describe('getProviderInfo', () => {
  it('returns openai adapter for gpt- model prefix', async () => {
    const { getProviderInfo } = await import('../factory')
    expect(getProviderInfo('gpt-4o')).toEqual({ name: 'openai', adapter: mockOpenAIInstance })
  })

  it('returns openai adapter for o- model prefix', async () => {
    const { getProviderInfo } = await import('../factory')
    expect(getProviderInfo('o1')).toEqual({ name: 'openai', adapter: mockOpenAIInstance })
  })

  it('returns anthropic adapter for claude- model prefix', async () => {
    const { getProviderInfo } = await import('../factory')
    expect(getProviderInfo('claude-3-5-sonnet')).toEqual({
      name: 'anthropic',
      adapter: mockAnthropicInstance,
    })
  })

  it('returns google adapter for gemini- model prefix', async () => {
    const { getProviderInfo } = await import('../factory')
    expect(getProviderInfo('gemini-2.0-flash')).toEqual({
      name: 'google',
      adapter: mockGoogleInstance,
    })
  })

  it('returns null for unknown model', async () => {
    const { getProviderInfo } = await import('../factory')
    expect(getProviderInfo('llama-3')).toBeNull()
  })
})

describe('getProviderAdapter', () => {
  it('returns adapter for known model', async () => {
    const { getProviderAdapter } = await import('../factory')
    expect(getProviderAdapter('gpt-4o')).toBe(mockOpenAIInstance)
  })

  it('returns null for unknown model', async () => {
    const { getProviderAdapter } = await import('../factory')
    expect(getProviderAdapter('llama-3')).toBeNull()
  })
})

describe('getProviderName', () => {
  it('returns name for known model', async () => {
    const { getProviderName } = await import('../factory')
    expect(getProviderName('claude-3-5-sonnet')).toBe('anthropic')
  })

  it('returns null for unknown model', async () => {
    const { getProviderName } = await import('../factory')
    expect(getProviderName('llama-3')).toBeNull()
  })
})

describe('getAllAdapters', () => {
  it('returns all 3 registered adapters', async () => {
    const { getAllAdapters } = await import('../factory')
    expect(getAllAdapters()).toEqual([
      mockOpenAIInstance,
      mockAnthropicInstance,
      mockGoogleInstance,
    ])
  })
})
