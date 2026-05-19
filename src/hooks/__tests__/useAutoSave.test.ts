import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutoSave } from '../useAutoSave'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useAutoSave', () => {
  it('returns isDirty, isSaving, saveNow', () => {
    const { result } = renderHook(() =>
      useAutoSave({ data: { text: 'hello' }, isNew: false, save: vi.fn() }),
    )
    expect(result.current).toHaveProperty('isDirty')
    expect(result.current).toHaveProperty('isSaving')
    expect(result.current).toHaveProperty('saveNow')
  })

  describe('isNew === true', () => {
    it('never sets isDirty when data changes', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({ data, isNew: true, save: vi.fn() }),
        { initialProps: { data: { text: 'a' } } },
      )

      expect(result.current.isDirty).toBe(false)

      rerender({ data: { text: 'b' } })
      expect(result.current.isDirty).toBe(false)
    })

    it('saveNow does not call save', async () => {
      const save = vi.fn()
      const { result } = renderHook(() =>
        useAutoSave({ data: { text: 'test' }, isNew: true, save }),
      )

      await act(async () => {
        result.current.saveNow()
      })
      expect(save).not.toHaveBeenCalled()
    })
  })

  describe('isNew === false', () => {
    it('marks dirty when data changes', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({ data, isNew: false, save: vi.fn() }),
        { initialProps: { data: { text: 'a' } } },
      )

      rerender({ data: { text: 'b' } })
      expect(result.current.isDirty).toBe(true)
    })

    it('debounces save after default 2000ms delay', () => {
      const save = vi.fn()
      const { rerender } = renderHook(({ data }) => useAutoSave({ data, isNew: false, save }), {
        initialProps: { data: { text: 'a' } },
      })

      rerender({ data: { text: 'b' } })
      expect(save).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(save).toHaveBeenCalledTimes(1)
    })

    it('resets dirty flag after save completes', async () => {
      const save = vi.fn().mockResolvedValue(undefined)
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({ data, isNew: false, save }),
        { initialProps: { data: { text: 'a' } } },
      )

      rerender({ data: { text: 'b' } })
      expect(result.current.isDirty).toBe(true)

      act(() => {
        vi.advanceTimersByTime(2000)
      })
      await vi.waitFor(() => expect(result.current.isDirty).toBe(false))
    })

    it('sets isSaving during save', async () => {
      let resolveSave!: () => void
      const save = vi.fn().mockImplementation(
        () =>
          new Promise<void>((r) => {
            resolveSave = r
          }),
      )
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({ data, isNew: false, save }),
        { initialProps: { data: { text: 'a' } } },
      )

      rerender({ data: { text: 'b' } })
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      await vi.waitFor(() => expect(result.current.isSaving).toBe(true))

      act(() => {
        resolveSave()
      })
      await vi.waitFor(() => expect(result.current.isSaving).toBe(false))
    })

    it('does not mark dirty when data is unchanged (same JSON)', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({ data, isNew: false, save: vi.fn() }),
        { initialProps: { data: { text: 'a' } } },
      )

      rerender({ data: { text: 'a' } })
      expect(result.current.isDirty).toBe(false)
    })

    it('cancels save timer on unmount', () => {
      const save = vi.fn()
      const { rerender, unmount } = renderHook(
        ({ data }) => useAutoSave({ data, isNew: false, save }),
        { initialProps: { data: { text: 'a' } } },
      )

      rerender({ data: { text: 'b' } })
      unmount()

      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(save).not.toHaveBeenCalled()
    })

    it('saveNow triggers save immediately', async () => {
      const save = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() =>
        useAutoSave({ data: { text: 'test' }, isNew: false, save }),
      )

      await act(async () => {
        result.current.saveNow()
      })
      expect(save).toHaveBeenCalledOnce()
    })
  })

  describe('keyboard shortcut', () => {
    it('triggers saveNow on Cmd+S', () => {
      const save = vi.fn().mockResolvedValue(undefined)
      renderHook(() => useAutoSave({ data: { text: 'test' }, isNew: false, save }))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true }))
      })

      expect(save).toHaveBeenCalledOnce()
    })

    it('triggers saveNow on Ctrl+S', () => {
      const save = vi.fn().mockResolvedValue(undefined)
      renderHook(() => useAutoSave({ data: { text: 'test' }, isNew: false, save }))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }))
      })

      expect(save).toHaveBeenCalledOnce()
    })
  })
})
