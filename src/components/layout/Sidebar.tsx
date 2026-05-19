import { useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { PanelLeftClose, PanelLeft, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useSettingsStore } from '../../store/settingsStore'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NAV_ITEMS } from '../../lib/navigation'
import { THEMES } from '../../lib/theme-config'
import { THEME_ICON_MAP } from '../../lib/theme-config'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth()
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const navigate = useNavigate()

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
  }

  const ThemeIcon = THEME_ICON_MAP[theme]

  const handleSignOut = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [signOut, navigate])

  return (
    <aside
      className={`flex flex-col border-r bg-sidebar transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground">PromptLoop</span>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="text-sidebar-foreground">
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          className={`w-full text-sidebar-foreground hover:bg-sidebar-accent ${
            collapsed ? '' : 'justify-start gap-3 px-3'
          }`}
          title={`Theme: ${theme}`}
        >
          <ThemeIcon className="size-4 shrink-0" />
          {!collapsed && <span className="text-sm">Theme</span>}
        </Button>
      </div>

      <div className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex w-full cursor-default items-center gap-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent ${
              collapsed ? 'justify-center px-2 py-2' : 'justify-start px-3 py-2'
            }`}
          >
            <Avatar className="size-7">
              <AvatarImage src={user?.photoURL ?? undefined} />
              <AvatarFallback className="text-xs">
                {user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="truncate text-sm">{user?.displayName ?? user?.email}</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
