import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Badge } from '../badge'

vi.mock('@base-ui/react/merge-props', () => ({
  mergeProps: (...args: any[]) => Object.assign({}, ...args),
}))
vi.mock('@base-ui/react/use-render', () => ({
  useRender: (opts: any) => {
    const { defaultTagName, props, render: renderProp } = opts
    const Tag = renderProp || defaultTagName
    return <Tag {...props} />
  },
}))

describe('Badge', () => {
  it('renders as span by default', () => {
    const { container } = render(<Badge>New</Badge>)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('applies default variant', () => {
    const { container } = render(<Badge>New</Badge>)
    const el = container.firstElementChild
    expect(el?.className).toContain('bg-primary')
  })

  it('supports all variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
    for (const variant of variants) {
      const { container } = render(<Badge variant={variant}>{variant}</Badge>)
      expect(container.firstElementChild).toBeInTheDocument()
    }
  })

  it('merges custom className', () => {
    const { container } = render(<Badge className="custom-class">New</Badge>)
    expect(container.firstElementChild?.className).toContain('custom-class')
  })
})
