import { describe, it, expect } from 'vitest'
import { router } from '../../routes'
import type { Router } from '@remix-run/router'

describe('routes', () => {
  it('exports a createHashRouter router', () => {
    expect(router).toBeDefined()
    expect(typeof (router as Router).navigate).toBe('function')
    expect(typeof (router as Router).state).toBe('object')
  })

  it('has root layout with children', () => {
    const r = router as Router
    const rootRoute = r.routes.find((route: any) => route.path === '/')
    expect(rootRoute).toBeDefined()
    expect(rootRoute!.children).toBeDefined()
  })

  it('has login route at top level', () => {
    const r = router as Router
    const loginRoute = r.routes.find((route: any) => route.path === '/login')
    expect(loginRoute).toBeDefined()
  })

  it('has onboarding route at top level', () => {
    const r = router as Router
    const route = r.routes.find((route: any) => route.path === '/onboarding')
    expect(route).toBeDefined()
  })
})
