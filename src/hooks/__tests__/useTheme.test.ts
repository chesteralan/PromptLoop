import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'

const mockSetTheme = vi.fn()

const { useSettingsStore } = vi.hoisted(() => ({
  useSettingsStore: vi.fn(),
}))

vi.mock('../../store/settingsStore', () => ({ useSettingsStore }))

beforeEach(() => {
  vi.clearAllMocks()
  document.documentElement.classList.remove('dark')
})

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<(e: { matches: boolean }) => void>()
  window.matchMedia = vi.fn().mockImplementation(() => ({
    get matches() {
      return matches
    },
    addEventListener: (_event: string, listener: (e: { matches: boolean }) => void) => {
      listeners.add(listener)
    },
    removeEventListener: vi.fn((listener) => listeners.delete(listener)),
  }))
  return {
    setMatches: (v: boolean) => {
      matches = v
      listeners.forEach((fn) => fn({ matches: v }))
    },
  }
}

describe('useTheme', () => {
  it('returns theme and setTheme from store', () => {
    useSettingsStore.mockImplementation((selector: (s: any) => any) =>
      selector({ theme: 'dark', setTheme: mockSetTheme }),
    )

    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(result.current.setTheme).toBe(mockSetTheme)
  })

  it('adds dark class when theme is dark', () => {
    useSettingsStore.mockImplementation((selector: (s: any) => any) =>
      selector({ theme: 'dark', setTheme: mockSetTheme }),
    )

    renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when theme is light', () => {
    useSettingsStore.mockImplementation((selector: (s: any) => any) =>
      selector({ theme: 'light', setTheme: mockSetTheme }),
    )

    renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('applies system preference when theme is system', () => {
    useSettingsStore.mockImplementation((selector: (s: any) => any) =>
      selector({ theme: 'system', setTheme: mockSetTheme }),
    )

    mockMatchMedia(true)

    renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('responds to system preference changes', () => {
    useSettingsStore.mockImplementation((selector: (s: any) => any) =>
      selector({ theme: 'system', setTheme: mockSetTheme }),
    )

    const { setMatches } = mockMatchMedia(false)

    renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    act(() => {
      setMatches(true)
    })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
