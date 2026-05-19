import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../select'

vi.mock('@base-ui/react/select', () => ({
  Select: Object.assign(
    ({ children, ...props }: any) => (
      <div data-slot="select" {...props}>
        {children}
      </div>
    ),
    {
      Root: ({ children, ...props }: any) => (
        <div data-slot="select" {...props}>
          {children}
        </div>
      ),
      Trigger: ({ children, className, ...props }: any) => (
        <button data-slot="select-trigger" className={className} {...props}>
          {children}
        </button>
      ),
      Value: ({ children, className, ...props }: any) => (
        <span data-slot="select-value" className={className} {...props}>
          {children}
        </span>
      ),
      Icon: (props: any) => <span data-slot="select-icon" {...props} />,
      Portal: ({ children }: any) => <>{children}</>,
      Positioner: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      Popup: ({ children, className, ...props }: any) => (
        <div data-slot="select-content" className={className} {...props}>
          {children}
        </div>
      ),
      List: ({ children }: any) => <>{children}</>,
      Group: ({ children, ...props }: any) => (
        <div data-slot="select-group" {...props}>
          {children}
        </div>
      ),
      GroupLabel: ({ children, className, ...props }: any) => (
        <div data-slot="select-label" className={className} {...props}>
          {children}
        </div>
      ),
      Item: ({ children, className, ...props }: any) => (
        <div data-slot="select-item" className={className} {...props}>
          {children}
        </div>
      ),
      ItemText: ({ children, className, ...props }: any) => (
        <span className={className} {...props}>
          {children}
        </span>
      ),
      ItemIndicator: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      Separator: ({ className, ...props }: any) => (
        <div data-slot="select-separator" className={className} {...props} />
      ),
      ScrollUpArrow: ({ className, ...props }: any) => (
        <div data-slot="select-scroll-up" className={className} {...props} />
      ),
      ScrollDownArrow: ({ className, ...props }: any) => (
        <div data-slot="select-scroll-down" className={className} {...props} />
      ),
    },
  ),
}))

describe('Select', () => {
  it('renders trigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="select-value"]')).toBeInTheDocument()
  })

  it('shows placeholder when no value', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-value"]')).toBeInTheDocument()
  })

  it('renders content with items', () => {
    const { container } = render(
      <Select open>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="select-group"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="select-label"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="select-item"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="select-separator"]')).toBeInTheDocument()
  })

  it('renders all items', () => {
    const { container } = render(
      <Select open>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelectorAll('[data-slot="select-item"]')).toHaveLength(2)
  })
})
