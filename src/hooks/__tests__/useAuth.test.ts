import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { useAuth } from '../useAuth'
import { AuthContext } from '../../components/auth/AuthProvider'

vi.mock('../../components/auth/AuthProvider', () => ({
  AuthContext: React.createContext(null),
}))

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider')
  })

  it('returns context value when used within AuthProvider', () => {
    const value = {
      user: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    }

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => React.createElement(AuthContext.Provider, { value }, children),
    })

    expect(result.current).toEqual(value)
  })
})
