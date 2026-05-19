import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../dialog'

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, className, ...props }: any) => (
    <button className={className} data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@base-ui/react/dialog', () => {
  const primitives = {
    Root: ({ children, ...props }: any) => (
      <div data-slot="dialog" {...props}>
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }: any) => (
      <button data-slot="dialog-trigger" {...props}>
        {children}
      </button>
    ),
    Portal: ({ children }: any) => <>{children}</>,
    Close: ({ children, ...props }: any) => (
      <button data-slot="dialog-close" {...props}>
        {children}
      </button>
    ),
    Backdrop: ({ className, ...props }: any) => (
      <div data-slot="dialog-overlay" className={className} {...props} />
    ),
    Popup: ({ children, className, ...props }: any) => (
      <div data-slot="dialog-content" className={className} {...props}>
        {children}
      </div>
    ),
    Title: ({ children, className, ...props }: any) => (
      <h2 data-slot="dialog-title" className={className} {...props}>
        {children}
      </h2>
    ),
    Description: ({ children, className, ...props }: any) => (
      <p data-slot="dialog-description" className={className} {...props}>
        {children}
      </p>
    ),
  }
  return {
    Dialog: Object.assign(
      ({ children, ...props }: any) => (
        <div data-slot="dialog" {...props}>
          {children}
        </div>
      ),
      primitives,
    ),
  }
})

describe('Dialog', () => {
  it('renders with data-slot', () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dialog-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dialog-title"]')).toBeInTheDocument()
  })

  it('renders close button by default', () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>content</DialogContent>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-close"]')).toBeInTheDocument()
  })

  it('hides close button when showCloseButton=false', () => {
    const { container } = render(
      <Dialog open>
        <DialogContent showCloseButton={false}>content</DialogContent>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-close"]')).not.toBeInTheDocument()
  })

  it('renders description', () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogDescription>desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-description"]')).toBeInTheDocument()
  })

  it('renders footer', () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogFooter>footer</DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-footer"]')).toBeInTheDocument()
  })

  it('renders trigger', () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>open</DialogTrigger>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-trigger"]')).toBeInTheDocument()
  })
})
