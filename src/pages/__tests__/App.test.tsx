import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../../App'

const { mockUseTheme, mockRouterShouldThrow } = vi.hoisted(() => ({
  mockUseTheme: vi.fn(),
  mockRouterShouldThrow: { value: false },
}))

vi.mock('../../routes', () => ({
  router: {},
}))

vi.mock('react-router-dom', () => ({
  RouterProvider: vi.fn(() => {
    if (mockRouterShouldThrow.value) throw new Error('test error')
    return <div data-testid="router-provider" />
  }),
}))

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
}))

vi.mock('../../components/ui/tooltip', () => ({
  TooltipProvider: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  )),
}))

vi.mock('sonner', () => ({
  Toaster: vi.fn(() => <div data-testid="toaster" />),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('App', () => {
  it('renders RouterProvider, TooltipProvider, and Toaster', () => {
    render(<App />)
    expect(screen.getByTestId('router-provider')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('calls useTheme', () => {
    render(<App />)
    expect(mockUseTheme).toHaveBeenCalled()
  })

  it('ErrorBoundary catches errors and shows reload button', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockRouterShouldThrow.value = true
    render(<App />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('test error')).toBeInTheDocument()
    expect(screen.getByText('Reload')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('ErrorBoundary reload button calls window.location.reload', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    })
    mockRouterShouldThrow.value = true
    render(<App />)
    fireEvent.click(screen.getByText('Reload'))
    expect(reloadSpy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
