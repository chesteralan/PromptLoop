import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '../input'

vi.mock('@base-ui/react/input', () => ({
  Input: ({ className, ...props }: any) => (
    <input className={className} data-slot="input" {...props} />
  ),
}))

describe('Input', () => {
  it('renders with data-slot attribute', () => {
    render(<Input data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toHaveAttribute('data-slot', 'input')
  })

  it('supports disabled state', () => {
    render(<Input disabled data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toBeDisabled()
  })

  it('supports aria-invalid', () => {
    render(<Input aria-invalid={true} data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toHaveAttribute('aria-invalid', 'true')
  })

  it('passes type prop', () => {
    render(<Input type="password" data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'password')
  })
})
