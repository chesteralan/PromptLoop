import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '../card'

describe('Card', () => {
  it('renders with default size', () => {
    const { container } = render(<Card>content</Card>)
    const el = container.firstElementChild
    expect(el).toHaveAttribute('data-slot', 'card')
    expect(el).toHaveAttribute('data-size', 'default')
    expect(el).toHaveAttribute('role', 'region')
  })

  it('renders with sm size', () => {
    const { container } = render(<Card size="sm">content</Card>)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'sm')
  })

  it('renders all subcomponents', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
  })
})
