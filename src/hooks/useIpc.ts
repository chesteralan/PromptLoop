import { useEffect } from 'react'

export function useExecutionListener() {
  useEffect(() => {
    const cleanupChunk = window.electronAPI.onExecutionChunk((data) => {
      console.log('chunk:', data)
    })
    const cleanupCompleted = window.electronAPI.onExecutionCompleted((data) => {
      console.log('completed:', data)
    })
    const cleanupFailed = window.electronAPI.onExecutionFailed((data) => {
      console.log('failed:', data)
    })

    return () => {
      cleanupChunk()
      cleanupCompleted()
      cleanupFailed()
    }
  }, [])
}
