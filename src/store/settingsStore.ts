import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface StoredUser {
  uid: string
  email: string | null
}

interface SettingsStore {
  theme: Theme
  windowMode: 'full' | 'compact'
  minimizeToTrayOnClose: boolean
  notificationsEnabled: boolean
  startOnBoot: boolean
  user: StoredUser | null

  setTheme: (theme: Theme) => void
  setWindowMode: (mode: 'full' | 'compact') => void
  toggleMinimizeToTray: () => void
  toggleNotifications: () => void
  setStartOnBoot: (enabled: boolean) => void
  setUser: (user: StoredUser | null) => void
  clearUser: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'system',
      windowMode: 'full',
      minimizeToTrayOnClose: false,
      notificationsEnabled: true,
      startOnBoot: false,
      user: null,

      setTheme: (theme) => set({ theme }),
      setWindowMode: (mode) => set({ windowMode: mode }),
      toggleMinimizeToTray: () => set((s) => ({ minimizeToTrayOnClose: !s.minimizeToTrayOnClose })),
      toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      setStartOnBoot: (startOnBoot) => set({ startOnBoot }),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'promptloop-settings',
      partialize: (state) => ({
        theme: state.theme,
        windowMode: state.windowMode,
        minimizeToTrayOnClose: state.minimizeToTrayOnClose,
        notificationsEnabled: state.notificationsEnabled,
        startOnBoot: state.startOnBoot,
      }),
    },
  ),
)
