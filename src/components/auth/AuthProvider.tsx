/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import { signOut as firebaseSignOut, onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { ensureUserDocument } from '../../lib/user-service'
import {
  signInWithProvider as authSignInWithProvider,
  handleRedirectResult,
} from '../../lib/auth-service'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    handleRedirectResult()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        ensureUserDocument(user).catch(() => {})
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = useCallback(() => authSignInWithProvider('google'), [])
  const signInWithGitHub = useCallback(() => authSignInWithProvider('github'), [])
  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signInWithGitHub, signOut }),
    [user, loading, signInWithGoogle, signInWithGitHub, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
