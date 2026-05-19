import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkflowSettings } from '../WorkflowSettings'

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {React.Children.map(children, (child: any) => {
        if (child?.type?.displayName === 'SelectTrigger') {
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
        <option value="infinite">Infinite</option>
        <option value="fixed">Fixed</option>
        <option value="single">Single Pass</option>
        <option value="scheduled">Scheduled</option>
      </select>
    </div>
  ),
  SelectTrigger: Object.assign(
    ({ children, className, ...props }: any) => (
      <button data-slot="select-trigger" className={className} {...props}>
        {children}
        <span data-slot="select-value" />
      </button>
    ),
    { displayName: 'SelectTrigger' },
  ),
  SelectValue: ({ children, placeholder }: any) => (
    <span data-slot="select-value" data-placeholder={placeholder}>
      {children}
    </span>
  ),
  SelectContent: ({ children }: any) => <div data-slot="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-slot="select-item" data-value={value}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => (
    <label data-slot="label" {...props}>
      {children}
    </label>
  ),
}))

describe('WorkflowSettings', () => {
  it('renders loop mode select with current value', () => {
    render(
      <WorkflowSettings
        loopMode="infinite"
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'infinite')
  })

  it('calls onLoopModeChange when selection changes', () => {
    const onChange = vi.fn()
    render(
      <WorkflowSettings
        loopMode="infinite"
        onLoopModeChange={onChange}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByTestId('select-native'), { target: { value: 'fixed' } })
    expect(onChange).toHaveBeenCalledWith('fixed')
  })

  it('does not call onLoopModeChange for invalid values', () => {
    const onChange = vi.fn()
    render(
      <WorkflowSettings
        loopMode="infinite"
        onLoopModeChange={onChange}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByTestId('select-native'), { target: { value: 'invalid' } })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows max iterations input when loop mode is fixed', () => {
    render(
      <WorkflowSettings
        loopMode="fixed"
        maxIterations={5}
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement
    expect(numberInput).toBeInTheDocument()
    expect(numberInput.value).toBe('5')
  })

  it('hides max iterations input when loop mode is not fixed', () => {
    const { rerender } = render(
      <WorkflowSettings
        loopMode="infinite"
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    expect(document.querySelector('input[type="number"]')).toBeNull()

    rerender(
      <WorkflowSettings
        loopMode="single"
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    expect(document.querySelector('input[type="number"]')).toBeNull()

    rerender(
      <WorkflowSettings
        loopMode="scheduled"
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    expect(document.querySelector('input[type="number"]')).toBeNull()
  })

  it('calls onMaxIterationsChange when value changes', () => {
    const onChange = vi.fn()
    render(
      <WorkflowSettings
        loopMode="fixed"
        maxIterations={1}
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={onChange}
      />,
    )
    const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement
    fireEvent.change(numberInput, { target: { value: '10' } })
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('defaults maxIterations to 1 when undefined', () => {
    render(
      <WorkflowSettings
        loopMode="fixed"
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement
    expect(numberInput.value).toBe('1')
  })

  it('renders labels for all loop modes', () => {
    render(
      <WorkflowSettings
        loopMode="infinite"
        onLoopModeChange={vi.fn()}
        onMaxIterationsChange={vi.fn()}
      />,
    )
    expect(screen.getAllByText('Infinite').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Fixed').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Single Pass').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Scheduled').length).toBeGreaterThanOrEqual(1)
  })
})
