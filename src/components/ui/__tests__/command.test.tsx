import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../command'

vi.mock('cmdk', () => ({
  Command: Object.assign(
    ({ children, ...props }: any) => (
      <div data-slot="command" {...props}>
        {children}
      </div>
    ),
    {
      Dialog: ({ children, ...props }: any) => (
        <div data-slot="command-dialog" {...props}>
          {children}
        </div>
      ),
      Input: ({ className, ...props }: any) => (
        <input data-slot="command-input" className={className} {...props} />
      ),
      List: ({ children, className, ...props }: any) => (
        <div data-slot="command-list" className={className} {...props}>
          {children}
        </div>
      ),
      Empty: ({ children, className, ...props }: any) => (
        <div data-slot="command-empty" className={className} {...props}>
          {children}
        </div>
      ),
      Group: ({ children, heading, className, ...props }: any) => (
        <div data-slot="command-group" className={className} data-heading={heading} {...props}>
          {children}
        </div>
      ),
      Item: ({ children, className, ...props }: any) => (
        <div data-slot="command-item" className={className} {...props}>
          {children}
        </div>
      ),
      Separator: ({ className, ...props }: any) => (
        <div data-slot="command-separator" className={className} {...props} />
      ),
    },
  ),
}))

vi.mock('../dialog', () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-slot="dialog" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className, ...props }: any) => (
    <div data-slot="dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children, className, ...props }: any) => (
    <div data-slot="dialog-header" className={className} {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, className, ...props }: any) => (
    <div data-slot="dialog-title" className={className} {...props}>
      {children}
    </div>
  ),
  DialogDescription: ({ children, className, ...props }: any) => (
    <div data-slot="dialog-description" className={className} {...props}>
      {children}
    </div>
  ),
}))

describe('Command', () => {
  it('renders command root', () => {
    const { container } = render(<Command />)
    expect(container.querySelector('[data-slot="command"]')).toBeInTheDocument()
  })

  it('renders input', () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
      </Command>,
    )
    expect(container.querySelector('[data-slot="command-input"]')).toBeInTheDocument()
  })

  it('renders list with empty state and groups', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Group 1">
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Group 2">
            <CommandItem>Item 3</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    expect(container.querySelector('[data-slot="command-list"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="command-empty"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-slot="command-group"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-slot="command-item"]')).toHaveLength(3)
    expect(container.querySelector('[data-slot="command-separator"]')).toBeInTheDocument()
  })

  it('renders command shortcut', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="Group">
            <CommandItem>
              Item<CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    expect(container.querySelector('[data-slot="command-shortcut"]')).toBeInTheDocument()
  })

  it('sets data-heading on groups', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="Fruits">
            <CommandItem>Apple</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    expect(container.querySelector('[data-slot="command-group"]')).toHaveAttribute(
      'data-heading',
      'Fruits',
    )
  })

  it('renders CommandDialog', () => {
    const { container } = render(<CommandDialog open>content</CommandDialog>)
    expect(container.querySelector('[data-slot="dialog"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dialog-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dialog-title"]')).toHaveTextContent(
      'Command Palette',
    )
    expect(container).toHaveTextContent('content')
  })
})
