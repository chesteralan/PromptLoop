import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBar } from '../StatusBar'

const mockUseExecutionStore = vi.fn()
vi.mock('@/store/executionStore', () => ({
  useExecutionStore: (selector: any) => mockUseExecutionStore(selector),
}))

function getStatus(status: string) {
  return () => status
}

describe('StatusBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseExecutionStore.mockImplementation(getStatus('idle'))
    window.electronAPI = {
      getAppVersion: vi.fn().mockResolvedValue('1.2.3'),
    } as any
  })

  it('renders idle status by default', async () => {
    render(<StatusBar />)
    expect(await screen.findByText('idle')).toBeInTheDocument()
  })

  it('renders running status with green indicator', () => {
    mockUseExecutionStore.mockImplementation(getStatus('running'))
    const { container } = render(<StatusBar />)
    expect(screen.getByText('running')).toBeInTheDocument()
    const circle = container.querySelector('.text-green-500')
    expect(circle).toBeInTheDocument()
  })

  it('renders paused status with yellow indicator', () => {
    mockUseExecutionStore.mockImplementation(getStatus('paused'))
    const { container } = render(<StatusBar />)
    expect(screen.getByText('paused')).toBeInTheDocument()
    const circle = container.querySelector('.text-yellow-500')
    expect(circle).toBeInTheDocument()
  })

  it('renders completed status with blue indicator', () => {
    mockUseExecutionStore.mockImplementation(getStatus('completed'))
    render(<StatusBar />)
    expect(screen.getByText('completed')).toBeInTheDocument()
  })

  it('renders error status with red indicator', () => {
    mockUseExecutionStore.mockImplementation(getStatus('error'))
    const { container } = render(<StatusBar />)
    expect(screen.getByText('error')).toBeInTheDocument()
    const circle = container.querySelector('.text-red-500')
    expect(circle).toBeInTheDocument()
  })

  it('renders stopped status', () => {
    mockUseExecutionStore.mockImplementation(getStatus('stopped'))
    render(<StatusBar />)
    expect(screen.getByText('stopped')).toBeInTheDocument()
  })

  it('shows app version when available', async () => {
    render(<StatusBar />)
    expect(await screen.findByText('v1.2.3')).toBeInTheDocument()
  })

  it('does not show version when electronAPI is unavailable', () => {
    delete (window as any).electronAPI
    render(<StatusBar />)
    expect(screen.queryByText(/^v/)).not.toBeInTheDocument()
  })

  it('handles getAppVersion error gracefully', () => {
    window.electronAPI = {
      getAppVersion: vi.fn().mockRejectedValue(new Error('fail')),
    } as any
    render(<StatusBar />)
    expect(screen.queryByText(/^v/)).not.toBeInTheDocument()
  })
})
