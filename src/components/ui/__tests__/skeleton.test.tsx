import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '../skeleton'

describe('Skeleton', () => {
  it('renders with correct data attribute and base classes', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild
    expect(el).toHaveAttribute('data-slot', 'skeleton')
    expect(el?.className).toContain('animate-pulse')
    expect(el?.className).toContain('rounded-md')
    expect(el?.className).toContain('bg-muted')
  })

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)
    expect(container.firstElementChild?.className).toContain('h-10')
    expect(container.firstElementChild?.className).toContain('w-full')
  })
})
