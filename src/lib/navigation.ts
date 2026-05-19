import { LayoutDashboard, Play, Settings, Key } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workflows/new', label: 'New Workflow', icon: Play },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/settings/api-keys', label: 'API Keys', icon: Key },
]
