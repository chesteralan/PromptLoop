import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Sidebar } from '../Sidebar'

const mockSignOut = vi.fn()
const mockNavigate = vi.fn()
const mockSetTheme = vi.fn()

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockUseSettingsStore = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

vi.mock('@/store/settingsStore', () => ({
  useSettingsStore: mockUseSettingsStore,
}))

vi.mock('react-router-dom', () => {
  const MockNavLink = ({ children, to, className }: any) => {
    const cls = typeof className === 'function' ? className({ isActive: false }) : className
    return (
      <a href={to} className={cls} data-testid={`nav-link-${to}`}>
        {children}
      </a>
    )
  }
  MockNavLink.displayName = 'NavLink'
  return {
    NavLink: MockNavLink,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className}>{children}</div>,
  AvatarImage: (props: any) => <img {...props} />,
  AvatarFallback: ({ children, className }: any) => <span className={className}>{children}</span>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, className, onClick, title, ...props }: any) => (
    <button
      className={className}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, className }: any) => (
    <button className={className} data-testid="dropdown-trigger">
      {children}
    </button>
  ),
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick, variant }: any) => (
    <div data-testid="dropdown-item" data-variant={variant} onClick={onClick} role="menuitem">
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: any) => <div data-testid="dropdown-label">{children}</div>,
  DropdownMenuGroup: ({ children }: any) => <div data-testid="dropdown-group">{children}</div>,
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: { uid: '123', email: 'test@test.com', displayName: 'Test User', photoURL: null },
      signOut: mockSignOut,
    })
    mockUseSettingsStore.mockImplementation((selector: any) => {
      return selector({ theme: 'light', setTheme: mockSetTheme })
    })
  })

  it('renders collapsed state (w-16)', () => {
    const { container } = render(<Sidebar collapsed onToggle={() => {}} />)
    expect(container.querySelector('aside')?.className).toContain('w-16')
  })

  it('hides title when collapsed', () => {
    render(<Sidebar collapsed onToggle={() => {}} />)
    expect(screen.queryByText('PromptLoop')).not.toBeInTheDocument()
  })

  it('renders expanded state (w-60) with title', () => {
    const { container } = render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(container.querySelector('aside')?.className).toContain('w-60')
    expect(screen.getByText('PromptLoop')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByTestId('nav-link-/dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-/workflows/new')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-/settings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-/settings/api-keys')).toBeInTheDocument()
  })

  it('shows nav labels when expanded', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('API Keys')).toBeInTheDocument()
  })

  it('hides nav labels when collapsed', () => {
    render(<Sidebar collapsed onToggle={() => {}} />)
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('API Keys')).not.toBeInTheDocument()
  })

  it('calls onToggle when toggle button clicked', () => {
    const onToggle = vi.fn()
    render(<Sidebar collapsed={false} onToggle={onToggle} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('has theme button with correct title', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByTitle('Theme: light')).toBeInTheDocument()
  })

  it('cycles theme from light to dark', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    fireEvent.click(screen.getByTitle('Theme: light'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('cycles theme from dark to system', () => {
    mockUseSettingsStore.mockImplementation((selector: any) => {
      return selector({ theme: 'dark', setTheme: mockSetTheme })
    })
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    fireEvent.click(screen.getByTitle('Theme: dark'))
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })

  it('cycles theme from system to light', () => {
    mockUseSettingsStore.mockImplementation((selector: any) => {
      return selector({ theme: 'system', setTheme: mockSetTheme })
    })
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    fireEvent.click(screen.getByTitle('Theme: system'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('shows display name when expanded', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows email when no display name', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '123', email: 'test@test.com', displayName: null, photoURL: null },
      signOut: mockSignOut,
    })
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    const emails = screen.getAllByText('test@test.com')
    expect(emails.length).toBeGreaterThanOrEqual(1)
  })

  it('shows initial letter in avatar fallback', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('shows "U" when no email or display name', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '123', email: null, displayName: null, photoURL: null },
      signOut: mockSignOut,
    })
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('renders sign out menu item', () => {
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('calls signOut and navigates on sign out click', async () => {
    mockSignOut.mockResolvedValue(undefined)
    render(<Sidebar collapsed={false} onToggle={() => {}} />)
    fireEvent.click(screen.getByText('Sign Out'))
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})
