/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  browserPopupRedirectResolver,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import { isElectron } from '../../lib/env'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

async function ensureUserDocument(user: User): Promise<void> {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName ?? '',
      email: user.email ?? '',
      photoURL: user.photoURL ?? '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      onboardingComplete: false,
    })
  } else {
    await setDoc(ref, { lastLoginAt: serverTimestamp() }, { merge: true })
  }
}

function createSignInProvider(providerName: 'google' | 'github') {
  return providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider()
}

function signInWithProvider(providerName: 'google' | 'github'): Promise<void> {
  const provider = createSignInProvider(providerName)
  if (isElectron) {
    return signInWithRedirect(auth, provider, browserPopupRedirectResolver)
  }
  return signInWithPopup(auth, provider).then(() => undefined)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isElectron) {
      getRedirectResult(auth, browserPopupRedirectResolver).catch(() => {})
    }
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

  const signInWithGoogle = useCallback(() => signInWithProvider('google'), [])
  const signInWithGitHub = useCallback(() => signInWithProvider('github'), [])
  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signInWithGitHub, signOut }),
    [user, loading, signInWithGoogle, signInWithGitHub, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
