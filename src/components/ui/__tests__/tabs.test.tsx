import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs'

vi.mock('@base-ui/react/tabs', () => ({
  Tabs: Object.assign(
    ({ children, ...props }: any) => (
      <div data-slot="tabs" {...props}>
        {children}
      </div>
    ),
    {
      Root: ({ children, className, orientation, ...props }: any) => (
        <div data-slot="tabs" data-orientation={orientation} className={className} {...props}>
          {children}
        </div>
      ),
      List: ({ children, className, ...props }: any) => (
        <div data-slot="tabs-list" className={className} {...props}>
          {children}
        </div>
      ),
      Tab: ({ children, className, ...props }: any) => (
        <button data-slot="tabs-trigger" className={className} {...props} role="tab">
          {children}
        </button>
      ),
      Panel: ({ children, className, ...props }: any) => (
        <div data-slot="tabs-content" className={className} {...props} role="tabpanel">
          {children}
        </div>
      ),
    },
  ),
}))

describe('Tabs', () => {
  it('renders list with triggers', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-slot="tabs-trigger"]')).toHaveLength(2)
  })

  it('shows content', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )
    expect(container.querySelectorAll('[data-slot="tabs-content"]')).toHaveLength(2)
  })

  it('renders with orientation', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(container.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
  })
})
