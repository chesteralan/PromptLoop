import { useRef, useEffect } from 'react'

export function useAutoScroll(deps: unknown) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [deps])

  return { scrollRef }
}
