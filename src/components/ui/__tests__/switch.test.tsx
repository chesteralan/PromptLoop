import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Switch } from '../switch'

vi.mock('@base-ui/react/switch', () => ({
  Switch: Object.assign((props: any) => <div>{props.children}</div>, {
    Root: vi.fn(({ children, checked, onCheckedChange, className, disabled, ...props }: any) => (
      <button
        role="switch"
        aria-checked={checked}
        data-slot="switch"
        className={className}
        data-disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        {...props}
      >
        {children}
      </button>
    )),
    Thumb: ({ className, ...props }: any) => (
      <span data-slot="switch-thumb" className={className} {...props} />
    ),
  }),
}))

describe('Switch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with data-slot', () => {
    const { container } = render(<Switch />)
    expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="switch-thumb"]')).toBeInTheDocument()
  })

  it('has role switch with correct aria state', () => {
    const { container } = render(<Switch checked />)
    expect(container.querySelector('[role="switch"]')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onCheckedChange on click', () => {
    const onChange = vi.fn()
    const { container } = render(<Switch onCheckedChange={onChange} />)
    fireEvent.click(container.querySelector('[role="switch"]')!)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('passes checked to onCheckedChange', () => {
    const onChange = vi.fn()
    const { container } = render(<Switch checked onCheckedChange={onChange} />)
    fireEvent.click(container.querySelector('[role="switch"]')!)
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('accepts className', () => {
    const { container } = render(<Switch className="custom-class" />)
    expect(container.querySelector('[role="switch"]')).toHaveClass('custom-class')
  })
})
