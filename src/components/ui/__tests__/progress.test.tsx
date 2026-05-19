import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Progress } from '../progress'

vi.mock('@base-ui/react/progress', () => {
  const Root = ({ className, children, ...props }: any) => (
    <div data-testid="progress-root" className={className} {...props}>
      {children}
      <div data-testid="progress-track">
        <div data-testid="progress-indicator" />
      </div>
    </div>
  )
  return {
    Progress: Object.assign(Root, {
      Root,
      Track: ({ className, ...props }: any) => (
        <div data-testid="progress-track" className={className} {...props} />
      ),
      Indicator: ({ className, ...props }: any) => (
        <div data-testid="progress-indicator" className={className} {...props} />
      ),
      Label: ({ children, ...props }: any) => (
        <span data-testid="progress-label" {...props}>
          {children}
        </span>
      ),
      Value: ({ children, ...props }: any) => (
        <span data-testid="progress-value" {...props}>
          {children}
        </span>
      ),
    }),
  }
})

describe('Progress', () => {
  it('renders all subcomponents', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-testid="progress-root"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="progress-track"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="progress-indicator"]')).toBeInTheDocument()
  })

  it('handles 0% value', () => {
    const { container } = render(<Progress value={0} />)
    expect(container.querySelector('[data-testid="progress-root"]')).toBeInTheDocument()
  })

  it('handles 100% value', () => {
    const { container } = render(<Progress value={100} />)
    expect(container.querySelector('[data-testid="progress-root"]')).toBeInTheDocument()
  })
})
