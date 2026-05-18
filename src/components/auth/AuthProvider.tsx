/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
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
import { useSettingsStore } from '../../store/settingsStore'

const isElectron = typeof window !== 'undefined' && 'electronAPI' in window

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

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
    })
  } else {
    await setDoc(ref, { lastLoginAt: serverTimestamp() }, { merge: true })
  }
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      useSettingsStore.getState().setUser(user)
      if (user) {
        ensureUserDocument(user).catch(() => {})
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    if (isElectron) {
      await signInWithRedirect(auth, provider, browserPopupRedirectResolver)
    } else {
      await signInWithPopup(auth, provider)
    }
  }

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider()
    if (isElectron) {
      await signInWithRedirect(auth, provider, browserPopupRedirectResolver)
    } else {
      await signInWithPopup(auth, provider)
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
