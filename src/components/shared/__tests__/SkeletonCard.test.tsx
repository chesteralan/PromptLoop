import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkeletonCard } from '../SkeletonCard'

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}))

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}))

describe('SkeletonCard', () => {
  it('renders card with header and content skeletons', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.querySelector('[data-testid="card"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="card-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="card-content"]')).toBeInTheDocument()
  })

  it('renders 2 skeletons in header and 2 in content', () => {
    const { container } = render(<SkeletonCard />)
    const skeletons = container.querySelectorAll('[data-testid="skeleton"]')
    expect(skeletons).toHaveLength(4)
  })
})
