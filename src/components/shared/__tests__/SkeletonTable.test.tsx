import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkeletonTable } from '../SkeletonTable'

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}))

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}))

describe('SkeletonTable', () => {
  it('renders with default dimensions (5 rows x 4 cols)', () => {
    const { container } = render(<SkeletonTable />)
    const rows = container.querySelectorAll('tr')
    // header row + 5 body rows
    expect(rows).toHaveLength(6)
    expect(container.querySelectorAll('td')).toHaveLength(20)
    expect(container.querySelectorAll('th')).toHaveLength(4)
  })

  it('renders with custom rows and columns', () => {
    const { container } = render(<SkeletonTable rows={3} columns={2} />)
    const rows = container.querySelectorAll('tr')
    // header row + 3 body rows
    expect(rows).toHaveLength(4)
    expect(container.querySelectorAll('td')).toHaveLength(6)
    expect(container.querySelectorAll('th')).toHaveLength(2)
  })

  it('sets aria-busy on container', () => {
    const { container } = render(<SkeletonTable />)
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
  })
})
