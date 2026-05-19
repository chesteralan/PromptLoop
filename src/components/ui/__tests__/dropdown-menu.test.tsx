import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '../dropdown-menu'

vi.mock('@base-ui/react/menu', () => ({
  Menu: Object.assign(
    ({ children, ...props }: any) => (
      <div data-slot="dropdown-menu" {...props}>
        {children}
      </div>
    ),
    {
      Root: ({ children, ...props }: any) => (
        <div data-slot="dropdown-menu" {...props}>
          {children}
        </div>
      ),
      Portal: ({ children }: any) => <>{children}</>,
      Trigger: ({ children, ...props }: any) => (
        <button data-slot="dropdown-menu-trigger" {...props}>
          {children}
        </button>
      ),
      Positioner: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      Popup: ({ children, className, ...props }: any) => (
        <div data-slot="dropdown-menu-content" className={className} {...props}>
          {children}
        </div>
      ),
      Group: ({ children, ...props }: any) => (
        <div data-slot="dropdown-menu-group" {...props}>
          {children}
        </div>
      ),
      GroupLabel: ({ children, className, ...props }: any) => (
        <div data-slot="dropdown-menu-label" className={className} {...props}>
          {children}
        </div>
      ),
      Item: ({ children, className, ...props }: any) => (
        <div data-slot="dropdown-menu-item" className={className} {...props}>
          {children}
        </div>
      ),
      Separator: ({ className, ...props }: any) => (
        <div data-slot="dropdown-menu-separator" className={className} {...props} />
      ),
    },
  ),
}))

describe('DropdownMenu', () => {
  it('renders trigger', () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      </DropdownMenu>,
    )
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')).toBeInTheDocument()
  })

  it('renders content with items', () => {
    const { container } = render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(container.querySelector('[data-slot="dropdown-menu-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dropdown-menu-label"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dropdown-menu-item"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dropdown-menu-separator"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dropdown-menu-shortcut"]')).toBeInTheDocument()
  })

  it('sets destructive variant on items', () => {
    const { container } = render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const item = container.querySelector('[data-slot="dropdown-menu-item"]')
    expect(item).toHaveAttribute('data-variant', 'destructive')
  })
})
