# Refactoring Rules: `src/lib/converters.ts`

## Purpose

Defines Firestore data converters for type-safe document serialization/deserialization between TypeScript `Date` objects and Firestore `Timestamp`s.

## Current Issues

1. **`migrateDocument`** function exists but is never imported anywhere — dead code
2. **`as Date` casts** in `toFirestore` methods (e.g., `model.createdAt as Date`) — these are unsafe; if a caller passes a non-Date value, it will silently corrupt data
3. **`as Timestamp` casts** in `fromFirestore` methods (e.g., `data.createdAt as Timestamp`) — unsafe; if Firestore returns data without the expected fields, this crashes
4. **`executionConverter.toFirestore`** stores `null` for `startedAt` / `completedAt` when they're `undefined` — Firestore doesn't accept `null` for Timestamp fields; should use `FieldValue.delete()` or omit the field
5. **All converters share** identical `createdAt`/`updatedAt` handling — could extract a date converter utility
6. **`promptConverter.toFirestore`** includes `workflowId` in the stored data — this is redundant since the document is already in a subcollection under the workflow
7. **No `id` field in data interfaces** — `id` is handled externally by the caller when mapping `snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))`

## Refactoring Rules

1. **Remove `migrateDocument`** if unused, or export and document its purpose
2. **Add runtime validation** in `fromFirestore` — check that `data.createdAt` is a `Timestamp` before calling `.toDate()`
3. **Replace `null`** with `FieldValue.delete()` for optional Timestamp fields
4. **Extract date conversion** helpers: `dateToTimestamp`, `timestampToDate`
5. **Remove `workflowId`** from `promptConverter.toFirestore` (document path already encodes it)
6. **Add `toFirestore` input validation** — ensure required fields exist
7. **Consider using Zod** schemas for runtime validation of Firestore data shapes

## Dependencies

- `firebase/firestore` (FirestoreDataConverter, Timestamp)
- `../../electron/shared/types`
- Used by: all firestore hooks, `firestore-helpers.ts`

## Verification

- `npm run lint`
- `npm run typecheck`
- Test round-trip serialization: Date → Firestore → Date
- Test with missing/optional fields
- Test `migrateDocument` (if kept)
