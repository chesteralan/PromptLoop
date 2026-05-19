import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../sheet'

vi.mock('@base-ui/react/dialog', () => ({
  Dialog: Object.assign(
    ({ children, ...props }: any) => (
      <div data-slot="sheet" {...props}>
        {children}
      </div>
    ),
    {
      Root: ({ children, open, ...props }: any) => (
        <div data-slot="sheet" data-open={open} {...props}>
          {children}
        </div>
      ),
      Trigger: ({ children, ...props }: any) => (
        <button data-slot="sheet-trigger" {...props}>
          {children}
        </button>
      ),
      Portal: ({ children }: any) => <>{children}</>,
      Close: ({ children, ...props }: any) => (
        <button data-slot="sheet-close" {...props}>
          {children}
        </button>
      ),
      Backdrop: ({ className, ...props }: any) => (
        <div data-slot="sheet-backdrop" className={className} {...props} />
      ),
      Popup: ({ children, className, side, ...props }: any) => (
        <div data-slot="sheet-content" className={className} data-side={side || 'right'} {...props}>
          {children}
        </div>
      ),
      Title: ({ children, className, ...props }: any) => (
        <h2 data-slot="sheet-title" className={className} {...props}>
          {children}
        </h2>
      ),
      Description: ({ children, className, ...props }: any) => (
        <p data-slot="sheet-description" className={className} {...props}>
          {children}
        </p>
      ),
    },
  ),
}))

describe('Sheet', () => {
  it('renders trigger', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>,
    )
    expect(container.querySelector('[data-slot="sheet-trigger"]')).toBeInTheDocument()
  })

  it('renders content with heading and description', () => {
    const { container } = render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
          <SheetFooter>Footer</SheetFooter>
        </SheetContent>
      </Sheet>,
    )
    expect(container.querySelector('[data-slot="sheet-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="sheet-title"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="sheet-description"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument()
  })

  it('defaults to right side', () => {
    const { container } = render(
      <Sheet open>
        <SheetContent>content</SheetContent>
      </Sheet>,
    )
    expect(container.querySelector('[data-slot="sheet-content"]')).toHaveAttribute(
      'data-side',
      'right',
    )
  })

  it('renders close button by default', () => {
    const { container } = render(
      <Sheet open>
        <SheetContent>content</SheetContent>
      </Sheet>,
    )
    expect(container.querySelector('[data-slot="sheet-close"]')).toBeInTheDocument()
  })

  it('hides close button when showCloseButton=false', () => {
    const { container } = render(
      <Sheet open>
        <SheetContent showCloseButton={false}>content</SheetContent>
      </Sheet>,
    )
    expect(container.querySelector('[data-slot="sheet-close"]')).not.toBeInTheDocument()
  })

  it('renders with custom side', () => {
    const { container } = render(
      <Sheet open>
        <SheetContent side="left">content</SheetContent>
      </Sheet>,
    )
    expect(container.querySelector('[data-slot="sheet-content"]')).toHaveAttribute(
      'data-side',
      'left',
    )
  })
})
