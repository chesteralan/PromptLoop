import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from '../separator'

vi.mock('@base-ui/react/separator', () => ({
  Separator: ({ className, orientation, ...props }: any) => (
    <div
      data-slot="separator"
      data-horizontal={orientation === 'horizontal' ? '' : undefined}
      data-vertical={orientation === 'vertical' ? '' : undefined}
      className={className}
      {...props}
    />
  ),
}))

describe('Separator', () => {
  it('renders horizontal by default', () => {
    const { container } = render(<Separator />)
    const el = container.firstElementChild
    expect(el).toHaveAttribute('data-slot', 'separator')
    expect(el).toHaveAttribute('data-horizontal', '')
  })

  it('renders vertical when specified', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const el = container.firstElementChild
    expect(el).toHaveAttribute('data-vertical', '')
  })
})
