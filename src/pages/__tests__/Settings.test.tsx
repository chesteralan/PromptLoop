import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsPage } from '../Settings'

const mockSetTheme = vi.fn()
const mockToggleMinimizeToTray = vi.fn()

vi.mock('../../store/settingsStore', () => ({
  useSettingsStore: vi.fn(),
}))

import { useSettingsStore } from '../../store/settingsStore'

function mockStore(overrides: Record<string, unknown> = {}) {
  vi.mocked(useSettingsStore).mockImplementation((selector: any) =>
    selector({
      theme: 'system',
      setTheme: mockSetTheme,
      minimizeToTrayOnClose: false,
      toggleMinimizeToTray: mockToggleMinimizeToTray,
      ...overrides,
    }),
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  delete (window as any).electronAPI
})

describe('SettingsPage', () => {
  it('renders page header with title and description', () => {
    mockStore()
    render(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Customize your PromptLoop experience')).toBeInTheDocument()
  })

  it('shows 3 theme buttons', () => {
    mockStore()
    render(<SettingsPage />)
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('renders all 3 theme buttons regardless of active theme', () => {
    mockStore({ theme: 'dark' })
    render(<SettingsPage />)
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('calls setTheme when a theme button is clicked', () => {
    mockStore()
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Dark'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    fireEvent.click(screen.getByText('Light'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
    fireEvent.click(screen.getByText('System'))
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })

  it('renders window section when electronAPI is available', () => {
    mockStore()
    ;(window as any).electronAPI = {}
    render(<SettingsPage />)
    expect(screen.getByText('Window')).toBeInTheDocument()
    expect(screen.getByText('Minimize to tray')).toBeInTheDocument()
  })

  it('does not render window section in browser', () => {
    mockStore()
    render(<SettingsPage />)
    expect(screen.queryByText('Window')).not.toBeInTheDocument()
    expect(screen.queryByText('Minimize to tray')).not.toBeInTheDocument()
  })

  it('checkbox reflects minimizeToTrayOnClose state', () => {
    mockStore({ minimizeToTrayOnClose: true })
    ;(window as any).electronAPI = {}
    render(<SettingsPage />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('toggles minimize to tray on checkbox change', () => {
    mockStore()
    ;(window as any).electronAPI = {}
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(mockToggleMinimizeToTray).toHaveBeenCalledOnce()
  })
})
