import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModelSelector } from '../ModelSelector'

const hoisted = vi.hoisted(() => {
  const mockConfiguredProviders = vi.fn()
  const mockModels = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'openai', maxTokens: 8192 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 4096 },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', maxTokens: 200000 },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic', maxTokens: 200000 },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google', maxTokens: 30720 },
  ]
  return { mockConfiguredProviders, mockModels }
})

vi.mock('@/hooks/useConfiguredProviders', () => ({
  useConfiguredProviders: hoisted.mockConfiguredProviders,
}))

vi.mock('@/lib/models', () => ({
  MODELS: hoisted.mockModels,
  PROVIDER_LABELS: { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google' },
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {React.Children.map(children, (child: any) => {
        if (child?.props?.children) {
          return React.cloneElement(child, { 'data-value': value })
        }
        return child
      })}
      <select
        data-testid="select-native"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        style={{ display: 'none' }}
      >
        {hoisted.mockModels.map((m: any) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  ),
  SelectTrigger: Object.assign(
    ({ children, className, disabled, ...props }: any) => (
      <button data-slot="select-trigger" className={className} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    { displayName: 'SelectTrigger' },
  ),
  SelectValue: ({ children }: any) => <span data-slot="select-value">{children}</span>,
  SelectContent: ({ children, align, className }: any) => (
    <div data-slot="select-content" data-align={align} className={className}>
      {children}
    </div>
  ),
  SelectGroup: ({ children, ...props }: any) => (
    <div data-slot="select-group" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-slot="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectLabel: ({ children }: any) => <div data-slot="select-label">{children}</div>,
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-slot="input" {...props} />,
}))

describe('ModelSelector', () => {
  beforeEach(() => {
    hoisted.mockConfiguredProviders.mockReturnValue({
      configuredProviders: ['openai', 'anthropic'],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
  })

  it('renders with selected model info', () => {
    render(<ModelSelector value="gpt-4" onChange={vi.fn()} />)
    expect(screen.getAllByText('GPT-4').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/\(8k tokens\)/)).toBeInTheDocument()
  })

  it('shows "Select a model" when no value', () => {
    render(<ModelSelector value="" onChange={vi.fn()} />)
    expect(screen.getByText('Select a model')).toBeInTheDocument()
  })

  it('shows "Add an API key first" when no keys configured', () => {
    hoisted.mockConfiguredProviders.mockReturnValue({
      configuredProviders: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    render(<ModelSelector value="" onChange={vi.fn()} />)
    expect(screen.getByText('Add an API key first')).toBeInTheDocument()
  })

  it('disables trigger when no keys configured', () => {
    hoisted.mockConfiguredProviders.mockReturnValue({
      configuredProviders: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    const { container } = render(<ModelSelector value="" onChange={vi.fn()} />)
    const trigger = container.querySelector('[data-slot="select-trigger"]')
    expect(trigger).toBeDisabled()
  })

  it('shows "No API keys configured" in dropdown when no keys', () => {
    hoisted.mockConfiguredProviders.mockReturnValue({
      configuredProviders: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    render(<ModelSelector value="" onChange={vi.fn()} />)
    expect(screen.getByText('No API keys configured')).toBeInTheDocument()
  })

  it('groups models by provider', () => {
    const { container } = render(<ModelSelector value="gpt-4" onChange={vi.fn()} />)
    const groups = container.querySelectorAll('[data-slot="select-group"]')
    expect(groups.length).toBeGreaterThanOrEqual(1)
  })

  it('shows provider labels', () => {
    render(<ModelSelector value="" onChange={vi.fn()} />)
    expect(screen.getAllByText('OpenAI').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Anthropic').length).toBeGreaterThanOrEqual(1)
  })

  it('renders max tokens info below select when model selected', () => {
    render(<ModelSelector value="gpt-4" onChange={vi.fn()} />)
    expect(screen.getByText(/Max tokens/)).toBeInTheDocument()
  })

  it('does not render max tokens info when no model selected', () => {
    render(<ModelSelector value="" onChange={vi.fn()} />)
    expect(screen.queryByText(/Max tokens/)).not.toBeInTheDocument()
  })

  it('calls onChange with model ID on selection change', () => {
    const onChange = vi.fn()
    render(<ModelSelector value="" onChange={onChange} />)
    fireEvent.change(screen.getByTestId('select-native'), { target: { value: 'gpt-4' } })
    expect(onChange).toHaveBeenCalledWith('gpt-4')
  })

  it('filters to only configured providers', () => {
    hoisted.mockConfiguredProviders.mockReturnValue({
      configuredProviders: ['openai'],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    render(<ModelSelector value="" onChange={vi.fn()} />)
    expect(screen.getAllByText('OpenAI').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Anthropic')).not.toBeInTheDocument()
  })
})
