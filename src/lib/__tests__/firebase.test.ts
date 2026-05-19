import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockInitializeApp,
  mockGetAuth,
  mockConnectAuthEmulator,
  mockGetFirestore,
  mockConnectFirestoreEmulator,
} = vi.hoisted(() => ({
  mockInitializeApp: vi.fn(() => ({ mockApp: true })),
  mockGetAuth: vi.fn(() => ({ mockAuth: true })),
  mockConnectAuthEmulator: vi.fn(),
  mockGetFirestore: vi.fn(() => ({ mockDb: true })),
  mockConnectFirestoreEmulator: vi.fn(),
}))

vi.mock('firebase/app', () => ({ initializeApp: mockInitializeApp }))
vi.mock('firebase/auth', () => ({
  getAuth: mockGetAuth,
  connectAuthEmulator: mockConnectAuthEmulator,
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: mockGetFirestore,
  connectFirestoreEmulator: mockConnectFirestoreEmulator,
}))

const FIREBASE_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

function stubAllFirebaseVars() {
  for (const key of FIREBASE_VARS) {
    vi.stubEnv(key, `test-${key}`)
  }
}

function clearFirebaseVars() {
  for (const key of FIREBASE_VARS) {
    vi.stubEnv(key, '')
  }
}

describe('firebase.ts', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
    vi.clearAllMocks()
    clearFirebaseVars()
  })

  it('throws when VITE_FIREBASE_API_KEY is missing', async () => {
    await expect(import('../firebase')).rejects.toThrow(
      'Missing required env var: VITE_FIREBASE_API_KEY',
    )
  })

  it('throws when any required env var is missing', async () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'key')
    await expect(import('../firebase')).rejects.toThrow(
      'Missing required env var: VITE_FIREBASE_AUTH_DOMAIN',
    )
  })

  it('initializes app with all env vars present', async () => {
    stubAllFirebaseVars()
    vi.stubEnv('MODE', 'production')
    const mod = await import('../firebase')
    expect(mockInitializeApp).toHaveBeenCalledWith({
      apiKey: 'test-VITE_FIREBASE_API_KEY',
      authDomain: 'test-VITE_FIREBASE_AUTH_DOMAIN',
      projectId: 'test-VITE_FIREBASE_PROJECT_ID',
      storageBucket: 'test-VITE_FIREBASE_STORAGE_BUCKET',
      messagingSenderId: 'test-VITE_FIREBASE_MESSAGING_SENDER_ID',
      appId: 'test-VITE_FIREBASE_APP_ID',
    })
    expect(mockGetAuth).toHaveBeenCalledWith({ mockApp: true })
    expect(mockGetFirestore).toHaveBeenCalledWith({ mockApp: true })
    expect(mod.auth).toEqual({ mockAuth: true })
    expect(mod.db).toEqual({ mockDb: true })
  })

  it('connects to auth and firestore emulators in DEV mode', async () => {
    stubAllFirebaseVars()
    await import('../firebase')
    expect(mockConnectAuthEmulator).toHaveBeenCalledWith(
      { mockAuth: true },
      'http://localhost:9099',
      { disableWarnings: true },
    )
    expect(mockConnectFirestoreEmulator).toHaveBeenCalledWith({ mockDb: true }, 'localhost', 8080)
  })

  it('connects to emulators and handles connection errors silently', async () => {
    stubAllFirebaseVars()
    mockConnectAuthEmulator.mockImplementationOnce(() => {
      throw new Error('emulator not available')
    })
    await expect(import('../firebase')).resolves.toBeDefined()
  })
})
