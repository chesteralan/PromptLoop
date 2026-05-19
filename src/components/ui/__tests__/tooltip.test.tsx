import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tooltip, TooltipTrigger, TooltipContent } from '../tooltip'

vi.mock('@base-ui/react/tooltip', () => ({
  Tooltip: Object.assign(
    ({ children, ...props }: any) => (
      <div data-slot="tooltip" {...props}>
        {children}
      </div>
    ),
    {
      Provider: ({ children, ...props }: any) => (
        <div data-slot="tooltip-provider" {...props}>
          {children}
        </div>
      ),
      Root: ({ children, ...props }: any) => (
        <div data-slot="tooltip" {...props}>
          {children}
        </div>
      ),
      Trigger: ({ children, ...props }: any) => (
        <span data-slot="tooltip-trigger" {...props}>
          {children}
        </span>
      ),
      Positioner: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      Portal: ({ children }: any) => <>{children}</>,
      Popup: ({ children, className, ...props }: any) => (
        <div data-slot="tooltip-content" className={className} {...props}>
          {children}
        </div>
      ),
      Arrow: (props: any) => <div data-slot="tooltip-arrow" {...props} />,
    },
  ),
}))

describe('Tooltip', () => {
  it('renders trigger', () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
      </Tooltip>,
    )
    expect(container.querySelector('[data-slot="tooltip-trigger"]')).toBeInTheDocument()
  })

  it('renders content', () => {
    const { container } = render(
      <Tooltip open>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>,
    )
    expect(container.querySelector('[data-slot="tooltip-content"]')).toBeInTheDocument()
  })
})
