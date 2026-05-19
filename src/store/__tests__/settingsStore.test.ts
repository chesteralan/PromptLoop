import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settingsStore'

beforeEach(() => {
  useSettingsStore.setState({
    theme: 'system',
    windowMode: 'full',
    minimizeToTrayOnClose: false,
    notificationsEnabled: true,
    startOnBoot: false,
    user: null,
  })
})

describe('settingsStore', () => {
  it('has correct initial state', () => {
    const state = useSettingsStore.getState()
    expect(state.theme).toBe('system')
    expect(state.windowMode).toBe('full')
    expect(state.minimizeToTrayOnClose).toBe(false)
    expect(state.notificationsEnabled).toBe(true)
    expect(state.startOnBoot).toBe(false)
    expect(state.user).toBeNull()
  })

  it('setTheme updates theme', () => {
    useSettingsStore.getState().setTheme('dark')
    expect(useSettingsStore.getState().theme).toBe('dark')
    useSettingsStore.getState().setTheme('light')
    expect(useSettingsStore.getState().theme).toBe('light')
  })

  it('setWindowMode updates window mode', () => {
    useSettingsStore.getState().setWindowMode('compact')
    expect(useSettingsStore.getState().windowMode).toBe('compact')
  })

  it('toggleMinimizeToTray flips boolean', () => {
    useSettingsStore.getState().toggleMinimizeToTray()
    expect(useSettingsStore.getState().minimizeToTrayOnClose).toBe(true)
    useSettingsStore.getState().toggleMinimizeToTray()
    expect(useSettingsStore.getState().minimizeToTrayOnClose).toBe(false)
  })

  it('toggleNotifications flips boolean', () => {
    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false)
    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notificationsEnabled).toBe(true)
  })

  it('setStartOnBoot sets start on boot', () => {
    useSettingsStore.getState().setStartOnBoot(true)
    expect(useSettingsStore.getState().startOnBoot).toBe(true)
  })

  it('setUser stores user object', () => {
    const user = { uid: 'u1', email: 'test@example.com' }
    useSettingsStore.getState().setUser(user)
    expect(useSettingsStore.getState().user).toEqual(user)
  })

  it('clearUser sets user to null', () => {
    useSettingsStore.getState().setUser({ uid: 'u1', email: 'test@example.com' })
    useSettingsStore.getState().clearUser()
    expect(useSettingsStore.getState().user).toBeNull()
  })
})
