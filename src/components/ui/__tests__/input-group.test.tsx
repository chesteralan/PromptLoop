import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../input-group'

vi.mock('../input', () => ({
  Input: ({ className, ...props }: any) => (
    <input className={className} data-slot="input-group-control" {...props} />
  ),
}))

describe('InputGroup', () => {
  it('renders with role group', () => {
    const { container } = render(<InputGroup />)
    expect(container.firstElementChild).toHaveAttribute('data-slot', 'input-group')
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
  })

  it('renders addon with align attribute', () => {
    const { container } = render(<InputGroupAddon>Search</InputGroupAddon>)
    const addon = container.firstElementChild
    expect(addon).toHaveAttribute('data-slot', 'input-group-addon')
    expect(addon).toHaveAttribute('data-align', 'inline-start')
  })

  it('renders addon with block-start align', () => {
    const { container } = render(<InputGroupAddon align="block-start">Top</InputGroupAddon>)
    expect(container.firstElementChild).toHaveAttribute('data-align', 'block-start')
  })

  it('renders addon with block-end align', () => {
    const { container } = render(<InputGroupAddon align="block-end">Bottom</InputGroupAddon>)
    expect(container.firstElementChild).toHaveAttribute('data-align', 'block-end')
  })

  it('renders addon with inline-end align', () => {
    const { container } = render(<InputGroupAddon align="inline-end">End</InputGroupAddon>)
    expect(container.firstElementChild).toHaveAttribute('data-align', 'inline-end')
  })

  it('renders InputGroupText', () => {
    const { container } = render(<InputGroupText>$</InputGroupText>)
    expect(container.firstElementChild).toBeInTheDocument()
  })

  it('renders input inside group', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput placeholder="text" />
      </InputGroup>,
    )
    expect(container.querySelector('[data-slot="input-group-control"]')).toBeInTheDocument()
  })
})
