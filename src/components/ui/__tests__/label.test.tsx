import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Label } from '../label'

describe('Label', () => {
  it('renders a label element', () => {
    const { container } = render(<Label>Name</Label>)
    const el = container.firstElementChild
    expect(el?.tagName).toBe('LABEL')
    expect(el).toHaveAttribute('data-slot', 'label')
    expect(el).toHaveTextContent('Name')
  })

  it('merges custom className', () => {
    const { container } = render(<Label className="font-bold">Name</Label>)
    expect(container.firstElementChild?.className).toContain('font-bold')
  })
})
