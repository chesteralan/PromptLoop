# Refactoring Rules: `src/lib/firebase.ts`

## Purpose

Initializes Firebase app, Auth, and Firestore with optional emulator connections in development mode.

## Current Issues

1. **`firebaseConfig` reads `import.meta.env`** — VITE* env vars are prefixed with `VITE*`(correct). However, if any required var is missing (e.g.,`VITE_FIREBASE_API_KEY`), Firebase will throw an error at initialization
2. **Emulator connection** is always attempted in `DEV` mode — if emulators aren't running, `connectAuthEmulator` and `connectFirestoreEmulator` will throw unhandled errors
3. **No validation** of config before initializing — missing fields cause cryptic Firebase errors
4. **No `getAnalytics`** — analytics is optional but commonly included
5. **Single bucket `storageBucket`** in config but no `getStorage` — storage bucket is configured but Firebase Storage is never initialized
6. **No app name** — uses default app name; fine for single-app setup

## Refactoring Rules

1. **Add config validation** — check that required env vars exist before initializing
2. **Wrap emulator connection** in try/catch to prevent app crash when emulators aren't running
3. **Add `getAnalytics`** initialization (optional, with env var guard)
4. **Add `getStorage`** export if storage is planned
5. **Add type-safe env var accessor** for Firebase config
6. **Add a delay or retry** for emulator connection to handle startup race condition

## Dependencies

- `firebase/app`, `firebase/auth`, `firebase/firestore`
- Used by: all hooks, components, and lib files that need Firebase access

## Verification

- `npm run lint`
- `npm run typecheck`
- Test app initializes with valid env vars
- Test app handles missing env vars gracefully
- Test emulator connection in dev mode
