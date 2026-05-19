import { vi } from 'vitest'

export function simulateAuth(
  mockFn: ReturnType<typeof vi.fn>,
  user: Record<string, string> | null,
) {
  mockFn.mockImplementation((_auth: unknown, cb: (user: unknown) => void) => {
    cb(user)
    return vi.fn()
  })
}

export function simulateUnauthenticated(mockFn: ReturnType<typeof vi.fn>) {
  simulateAuth(mockFn, null)
}

export function simulateAuthenticated(
  mockFn: ReturnType<typeof vi.fn>,
  overrides?: Record<string, string>,
) {
  simulateAuth(mockFn, { uid: '123', email: 'test@example.com', ...overrides })
}

export function createMockUser(overrides?: { uid?: string; email?: string }) {
  return { uid: '123', email: 'test@example.com', ...overrides }
}
