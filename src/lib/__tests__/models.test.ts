import { describe, it, expect } from 'vitest'
import { MODELS, PROVIDER_LABELS } from '../models'

describe('MODELS', () => {
  it('has 11 model entries', () => {
    expect(MODELS).toHaveLength(11)
  })

  it('each entry has the correct shape', () => {
    for (const model of MODELS) {
      expect(model).toHaveProperty('id')
      expect(model).toHaveProperty('name')
      expect(model).toHaveProperty('provider')
      expect(model).toHaveProperty('maxTokens')
      expect(typeof model.id).toBe('string')
      expect(typeof model.name).toBe('string')
      expect(typeof model.maxTokens).toBe('number')
    }
  })

  it('has 5 OpenAI models', () => {
    const openai = MODELS.filter((m) => m.provider === 'openai')
    expect(openai).toHaveLength(5)
    expect(openai.map((m) => m.id)).toEqual([
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
    ])
  })

  it('has 3 Anthropic models', () => {
    const anthropic = MODELS.filter((m) => m.provider === 'anthropic')
    expect(anthropic).toHaveLength(3)
    expect(anthropic.map((m) => m.id)).toEqual([
      'claude-3-5-sonnet',
      'claude-3-5-haiku',
      'claude-3-opus',
    ])
  })

  it('has 3 Google models', () => {
    const google = MODELS.filter((m) => m.provider === 'google')
    expect(google).toHaveLength(3)
    expect(google.map((m) => m.id)).toEqual([
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ])
  })
})

describe('PROVIDER_LABELS', () => {
  it('has labels for all 3 providers', () => {
    expect(Object.keys(PROVIDER_LABELS)).toHaveLength(3)
  })

  it('maps providers to display names', () => {
    expect(PROVIDER_LABELS.openai).toBe('OpenAI')
    expect(PROVIDER_LABELS.anthropic).toBe('Anthropic')
    expect(PROVIDER_LABELS.google).toBe('Google')
  })
})
