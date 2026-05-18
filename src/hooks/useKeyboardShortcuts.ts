import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface UseKeyboardShortcutsOptions {
  onSave?: () => void
  onPlayPause?: () => void
}

const INPUT_SELECTOR = 'input, textarea, select, [contenteditable]'

function isInputFocused(): boolean {
  return document.activeElement?.matches(INPUT_SELECTOR) ?? false
}

export function useKeyboardShortcuts(options?: UseKeyboardShortcutsOptions) {
  const navigate = useNavigate()
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey

      if (isCmd && e.key === 'n') {
        e.preventDefault()
        if (!isInputFocused()) navigate('/workflows/new')
        return
      }

      if (isCmd && e.key === ',') {
        e.preventDefault()
        if (!isInputFocused()) navigate('/settings')
        return
      }

      if (isCmd && e.key === 's') {
        e.preventDefault()
        optionsRef.current?.onSave?.()
        return
      }

      if (e.key === 'Escape') {
        const closeBtn = document.querySelector<HTMLButtonElement>(
          '[data-slot="sheet-close"], [data-slot="dialog-close"]',
        )
        closeBtn?.click()
        return
      }

      if (e.key === ' ' && !isInputFocused()) {
        e.preventDefault()
        optionsRef.current?.onPlayPause?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}
