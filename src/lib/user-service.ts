import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { userDocRef } from './firestore-refs'

export async function ensureUserDocument(user: User): Promise<void> {
  const ref = userDocRef(user.uid)
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
