import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  GithubAuthProvider,
  browserPopupRedirectResolver,
} from 'firebase/auth'
import { auth } from './firebase'
import { isElectron } from './env'

export function createSignInProvider(providerName: 'google' | 'github') {
  return providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider()
}

export async function signInWithProvider(providerName: 'google' | 'github'): Promise<void> {
  const provider = createSignInProvider(providerName)
  if (isElectron) {
    return signInWithRedirect(auth, provider, browserPopupRedirectResolver)
  }
  return signInWithPopup(auth, provider).then(() => undefined)
}

export async function handleRedirectResult(): Promise<void> {
  if (!isElectron) return
  try {
    await getRedirectResult(auth, browserPopupRedirectResolver)
  } catch {
    // redirect result not available
  }
}
