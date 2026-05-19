import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '../button'

vi.mock('@base-ui/react/button', () => ({
  Button: ({ className, children, ...props }: any) => (
    <button className={className} data-slot="button" {...props}>
      {children}
    </button>
  ),
}))

describe('Button', () => {
  it('renders with default variant and size', () => {
    const { container } = render(<Button>Click</Button>)
    const el = container.firstElementChild
    expect(el).toHaveAttribute('data-slot', 'button')
    expect(el?.className).toContain('bg-primary')
    expect(el?.className).toContain('h-8')
  })

  it('applies variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    expect(container.firstElementChild?.className).toContain('text-destructive')
  })

  it('applies size classes', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstElementChild?.className).toContain('h-7')
  })

  it('merges custom className', () => {
    const { container } = render(<Button className="custom-btn">Click</Button>)
    expect(container.firstElementChild?.className).toContain('custom-btn')
  })

  it('renders as disabled', () => {
    const { container } = render(<Button disabled>Click</Button>)
    expect(container.firstElementChild).toBeDisabled()
  })
})
