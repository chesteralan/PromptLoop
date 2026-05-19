import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

function fireKey(key: string, opts: Partial<KeyboardEvent> = {}) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }))
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useKeyboardShortcuts', () => {
  it('navigates to /workflows/new on Cmd+N when input not focused', () => {
    renderHook(() => useKeyboardShortcuts())
    fireKey('n', { metaKey: true })
    expect(mockNavigate).toHaveBeenCalledWith('/workflows/new')
  })

  it('navigates to /workflows/new on Ctrl+N when input not focused', () => {
    renderHook(() => useKeyboardShortcuts())
    fireKey('n', { ctrlKey: true })
    expect(mockNavigate).toHaveBeenCalledWith('/workflows/new')
  })

  it('does not navigate on Cmd+N when input is focused', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    renderHook(() => useKeyboardShortcuts())
    fireKey('n', { metaKey: true })
    expect(mockNavigate).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })

  it('navigates to /settings on Cmd+,', () => {
    renderHook(() => useKeyboardShortcuts())
    fireKey(',', { metaKey: true })
    expect(mockNavigate).toHaveBeenCalledWith('/settings')
  })

  it('calls onSave on Cmd+S', () => {
    const onSave = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onSave }))
    fireKey('s', { metaKey: true })
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('clicks sheet-close or dialog-close on Escape', () => {
    const btn = document.createElement('button')
    btn.setAttribute('data-slot', 'sheet-close')
    const clickSpy = vi.fn()
    btn.addEventListener('click', clickSpy)
    document.body.appendChild(btn)

    renderHook(() => useKeyboardShortcuts())
    fireKey('Escape')
    expect(clickSpy).toHaveBeenCalledOnce()

    document.body.removeChild(btn)
  })

  it('calls onPlayPause on Space when input not focused', () => {
    const onPlayPause = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onPlayPause }))
    fireKey(' ')
    expect(onPlayPause).toHaveBeenCalledOnce()
  })

  it('does not call onPlayPause on Space when input is focused', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    const onPlayPause = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onPlayPause }))
    fireKey(' ')
    expect(onPlayPause).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts())
    unmount()

    fireKey('n', { metaKey: true })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
