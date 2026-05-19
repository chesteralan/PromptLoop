import { Sun, Moon, Monitor } from 'lucide-react'

export type Theme = 'light' | 'dark' | 'system'

export const THEMES: Array<Theme> = ['light', 'dark', 'system']

export const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
]

export const THEME_ICON_MAP: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}
