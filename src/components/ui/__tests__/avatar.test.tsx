import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from '../avatar'

vi.mock('@base-ui/react/avatar', () => ({
  Avatar: Object.assign(
    ({ className, children, ...props }: any) => (
      <div data-slot="avatar" className={className} {...props}>
        {children}
      </div>
    ),
    {
      Root: ({ className, children, ...props }: any) => (
        <div data-slot="avatar" className={className} {...props}>
          {children}
        </div>
      ),
      Image: (props: any) => <img data-slot="avatar-image" {...props} />,
      Fallback: ({ className, children, ...props }: any) => (
        <span data-slot="avatar-fallback" className={className} {...props}>
          {children}
        </span>
      ),
    },
  ),
}))

describe('Avatar', () => {
  it('renders with default size', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-size', 'default')
  })

  it('renders with sm size', () => {
    const { container } = render(
      <Avatar size="sm">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-size', 'sm')
  })

  it('renders with lg size', () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-size', 'lg')
  })

  it('renders fallback when no image', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument()
  })

  it('renders AvatarGroup with spacing', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    )
    expect(container.querySelector('[data-slot="avatar-group"]')).toBeInTheDocument()
  })

  it('renders AvatarBadge', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
        <AvatarBadge />
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar-badge"]')).toBeInTheDocument()
  })

  it('renders AvatarGroupCount', () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    )
    expect(container.querySelector('[data-slot="avatar-group-count"]')).toBeInTheDocument()
  })
})
