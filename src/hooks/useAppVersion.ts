import { useState, useEffect } from 'react'

export function useAppVersion() {
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    window.electronAPI
      ?.getAppVersion()
      .then(setAppVersion)
      .catch(() => {})
  }, [])

  return { appVersion }
}
