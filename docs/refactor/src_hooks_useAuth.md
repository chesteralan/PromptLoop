# Refactoring Rules: `src/hooks/useAuth.ts`

## Purpose

Re-exports the `useAuth` hook from `AuthProvider` for convenient imports.

## Current Issues

1. **Re-export file** — only one line: `export { useAuth } from '../components/auth/AuthProvider'`
2. **Circular dependency risk** — if `AuthProvider.tsx` ever imports from `hooks/useAuth.ts`, this creates a cycle
3. **The actual hook lives in the component file** — hooks should be in `hooks/` and components in `components/`

## Refactoring Rules

1. **Move `useAuth` implementation** from `AuthProvider.tsx` to `hooks/useAuth.ts`
2. **Update `AuthProvider.tsx`** to import `useAuth` from `hooks/useAuth.ts`
3. **Remove the re-export** — `useAuth` is now defined here directly
4. **Update all imports** that currently reference `../components/auth/AuthProvider` for `useAuth`

## Dependencies

- `../components/auth/AuthProvider` (currently)
- Used by: all hooks and components that need auth context

## Verification

- `npm run lint`
- `npm run typecheck`
- Fix all import paths
- Test authentication flow still works
