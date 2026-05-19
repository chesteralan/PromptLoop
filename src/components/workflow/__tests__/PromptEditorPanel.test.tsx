import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PromptEditorPanel } from '../PromptEditorPanel'

const mockPrompt = {
  id: 'p1',
  workflowId: 'w1',
  title: 'Test Prompt',
  content: 'Hello world',
  systemPrompt: 'Be helpful',
  model: 'gpt-4',
  position: 0,
  enabled: true,
  temperature: 0.7,
  maxTokens: 2048,
  delayMs: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
}

vi.mock('@/components/ui/sheet', () => {
  const Sheet = ({ children, open }: any) =>
    open ? <div data-testid="sheet">{children}</div> : null
  const SheetContent = ({ children, side, className }: any) => (
    <div data-testid="sheet-content" data-side={side} className={className}>
      {children}
    </div>
  )
  const SheetHeader = ({ children }: any) => <div data-testid="sheet-header">{children}</div>
  const SheetTitle = ({ children }: any) => <h2 data-testid="sheet-title">{children}</h2>
  return { Sheet, SheetContent, SheetHeader, SheetTitle }
})

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-slot="input" {...props} />,
}))

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea data-slot="textarea" {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => (
    <label data-slot="label" {...props}>
      {children}
    </label>
  ),
}))

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <button
      role="switch"
      aria-checked={checked}
      data-testid="switch"
      onClick={() => onCheckedChange?.(!checked)}
    />
  ),
}))

vi.mock('@/components/workflow/ModelSelector', () => ({
  ModelSelector: ({ value, onChange }: any) => (
    <select data-testid="model-selector" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="gpt-4">GPT-4</option>
    </select>
  ),
}))

describe('PromptEditorPanel', () => {
  const baseHandlers = {
    open: true,
    onOpenChange: vi.fn(),
    onChange: vi.fn(),
  }

  it('shows placeholder when prompt is null', () => {
    render(<PromptEditorPanel prompt={null} {...baseHandlers} />)
    expect(screen.getByText('Select a prompt to edit')).toBeInTheDocument()
  })

  it('does not show placeholder when prompt exists', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    expect(screen.queryByText('Select a prompt to edit')).not.toBeInTheDocument()
  })

  it('shows prompt title in sheet header', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    expect(screen.getByText('Test Prompt')).toBeInTheDocument()
  })

  it('shows "Untitled Prompt" when title is empty', () => {
    render(<PromptEditorPanel prompt={{ ...mockPrompt, title: '' }} {...baseHandlers} />)
    expect(screen.getByText('Untitled Prompt')).toBeInTheDocument()
  })

  it('renders title input with correct value', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    const titleInput = screen.getByDisplayValue('Test Prompt')
    expect(titleInput).toBeInTheDocument()
  })

  it('renders content textarea with correct value', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    const contentArea = screen.getByDisplayValue('Hello world')
    expect(contentArea).toBeInTheDocument()
  })

  it('renders system prompt textarea', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    const systemPromptArea = screen.getByDisplayValue('Be helpful')
    expect(systemPromptArea).toBeInTheDocument()
  })

  it('renders model selector', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    expect(screen.getByTestId('model-selector')).toBeInTheDocument()
  })

  it('renders temperature range input', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    const rangeInput = document.querySelector('input[type="range"]')
    expect(rangeInput).toBeInTheDocument()
    expect(rangeInput).toHaveValue('0.7')
  })

  it('renders enabled switch', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange when title changes', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    const titleInput = screen.getByDisplayValue('Test Prompt')
    fireEvent.change(titleInput, { target: { value: 'New Title' } })
    expect(baseHandlers.onChange).toHaveBeenCalledWith('p1', { title: 'New Title' })
  })

  it('calls onChange when enabled is toggled', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(baseHandlers.onChange).toHaveBeenCalledWith('p1', { enabled: false })
  })

  it('renders temperature labels', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    expect(screen.getByText('Precise (0)')).toBeInTheDocument()
    expect(screen.getByText('Creative (2)')).toBeInTheDocument()
  })

  it('renders max tokens input', () => {
    render(<PromptEditorPanel prompt={mockPrompt} {...baseHandlers} />)
    const maxTokensInput = screen.getByDisplayValue('2048')
    expect(maxTokensInput).toBeInTheDocument()
  })
})
