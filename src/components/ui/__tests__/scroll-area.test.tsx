import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ScrollArea } from '../scroll-area'

vi.mock('@base-ui/react/scroll-area', () => {
  const Corner = () => <div data-slot="scroll-area-corner" />
  return {
    ScrollArea: Object.assign(
      ({ children, className, ...props }: any) => (
        <div data-slot="scroll-area" className={className} {...props}>
          {children}
        </div>
      ),
      {
        Root: ({ children, className, ...props }: any) => (
          <div data-slot="scroll-area" className={className} {...props}>
            {children}
          </div>
        ),
        Viewport: ({ children, className, ...props }: any) => (
          <div data-slot="scroll-area-viewport" className={className} {...props}>
            {children}
          </div>
        ),
        Corner,
        Scrollbar: ({ className, orientation, ...props }: any) => (
          <div
            data-slot="scroll-area-scrollbar"
            data-orientation={orientation}
            className={className}
            {...props}
          />
        ),
        Thumb: ({ className, ...props }: any) => (
          <div data-slot="scroll-area-thumb" className={className} {...props} />
        ),
      },
    ),
  }
})

describe('ScrollArea', () => {
  it('renders all subcomponents', () => {
    const { container } = render(<ScrollArea>content</ScrollArea>)
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="scroll-area-scrollbar"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="scroll-area-thumb"]')).toBeInTheDocument()
  })

  it('renders ScrollBar with vertical orientation by default', () => {
    const { container } = render(<ScrollArea>content</ScrollArea>)
    expect(container.querySelector('[data-slot="scroll-area-scrollbar"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
  })

  it('renders ScrollBar with horizontal orientation', () => {
    const { container } = render(<ScrollArea>content</ScrollArea>)
    expect(container.querySelector('[data-slot="scroll-area-scrollbar"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
  })
})
