import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    const { container } = render(<Textarea />)
    const el = container.firstElementChild
    expect(el?.tagName).toBe('TEXTAREA')
    expect(el).toHaveAttribute('data-slot', 'textarea')
  })

  it('supports disabled state', () => {
    const { container } = render(<Textarea disabled />)
    expect(container.firstElementChild).toBeDisabled()
  })

  it('supports aria-invalid', () => {
    const { container } = render(<Textarea aria-invalid={true} />)
    expect(container.firstElementChild).toHaveAttribute('aria-invalid', 'true')
  })
})
