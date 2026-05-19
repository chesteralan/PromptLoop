import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PromptList } from '../PromptList'

const mockPrompts = [
  {
    id: 'p1',
    workflowId: 'w1',
    title: 'Prompt 1',
    content: 'c1',
    model: 'gpt-4',
    position: 0,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'p2',
    workflowId: 'w1',
    title: 'Prompt 2',
    content: 'c2',
    model: 'gpt-3.5',
    position: 1,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

let dragDropContextOnDragEnd: any = null

vi.mock('@/components/workflow/PromptCard', () => ({
  PromptCard: ({ prompt, index, isSelected, onSelect, onToggle, onDelete }: any) => (
    <div
      data-testid="prompt-card"
      data-id={prompt.id}
      data-index={index}
      data-selected={String(isSelected)}
    >
      <span>{prompt.title}</span>
      <button data-testid={`select-${prompt.id}`} onClick={onSelect}>
        Select
      </button>
      <button data-testid={`toggle-${prompt.id}`} onClick={() => onToggle(!prompt.enabled)}>
        Toggle
      </button>
      <button data-testid={`delete-${prompt.id}`} onClick={onDelete}>
        Delete
      </button>
    </div>
  ),
}))

vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }: any) => {
    dragDropContextOnDragEnd = onDragEnd
    return <div data-testid="drag-context">{children}</div>
  },
  Droppable: ({ children }: any) => {
    const provided = {
      innerRef: vi.fn(),
      droppableProps: { 'data-testid': 'droppable' },
      placeholder: <div data-testid="droppable-placeholder" />,
    }
    return children(provided)
  },
}))

describe('PromptList', () => {
  const baseHandlers = {
    selectedId: null,
    onSelect: vi.fn(),
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onReorder: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    dragDropContextOnDragEnd = null
  })

  it('renders all prompts', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    const cards = screen.getAllByTestId('prompt-card')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Prompt 2')).toBeInTheDocument()
  })

  it('renders drag context', () => {
    const { container } = render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    expect(container.querySelector('[data-testid="drag-context"]')).toBeInTheDocument()
  })

  it('renders droppable placeholder', () => {
    const { container } = render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    expect(container.querySelector('[data-testid="droppable-placeholder"]')).toBeInTheDocument()
  })

  it('passes isSelected to PromptCard', () => {
    render(
      <PromptList
        prompts={mockPrompts}
        selectedId="p1"
        onSelect={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    const cards = screen.getAllByTestId('prompt-card')
    expect(cards[0]).toHaveAttribute('data-selected', 'true')
    expect(cards[1]).toHaveAttribute('data-selected', 'false')
  })

  it('passes correct index to PromptCards', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    const cards = screen.getAllByTestId('prompt-card')
    expect(cards[0]).toHaveAttribute('data-index', '0')
    expect(cards[1]).toHaveAttribute('data-index', '1')
  })

  it('calls onSelect when select button clicked', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    screen.getByTestId('select-p1').click()
    expect(baseHandlers.onSelect).toHaveBeenCalledWith('p1')
  })

  it('calls onToggle when toggle button clicked', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    screen.getByTestId('toggle-p1').click()
    expect(baseHandlers.onToggle).toHaveBeenCalledWith('p1', false)
  })

  it('calls onDelete when delete button clicked', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    screen.getByTestId('delete-p1').click()
    expect(baseHandlers.onDelete).toHaveBeenCalledWith('p1')
  })

  it('handles drag end with valid destination', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    expect(dragDropContextOnDragEnd).toBeDefined()
    dragDropContextOnDragEnd({
      source: { index: 0 },
      destination: { index: 1 },
    })
    expect(baseHandlers.onReorder).toHaveBeenCalledWith(['p2', 'p1'])
  })

  it('ignores drag end when no destination', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    dragDropContextOnDragEnd({
      source: { index: 0 },
      destination: null,
    })
    expect(baseHandlers.onReorder).not.toHaveBeenCalled()
  })

  it('ignores drag end when same index', () => {
    render(<PromptList prompts={mockPrompts} {...baseHandlers} />)
    dragDropContextOnDragEnd({
      source: { index: 0 },
      destination: { index: 0 },
    })
    expect(baseHandlers.onReorder).not.toHaveBeenCalled()
  })

  it('renders empty state when no prompts', () => {
    const { container } = render(<PromptList prompts={[]} {...baseHandlers} />)
    const cards = container.querySelectorAll('[data-testid="prompt-card"]')
    expect(cards).toHaveLength(0)
  })
})
