import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

export function useOnboardingRedirect() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user) {
      setChecking(false)
      return
    }
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists() && snap.data().onboardingComplete === false) {
          navigate('/onboarding', { replace: true })
        }
      })
      .catch((err) => console.warn('Failed to check onboarding status:', err))
      .finally(() => setChecking(false))
  }, [user, navigate])

  return { checking }
}
