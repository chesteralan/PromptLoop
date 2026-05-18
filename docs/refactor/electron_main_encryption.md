# Refactoring Rules: `electron/main/encryption.ts`

## Purpose

Provides secure local encryption/decryption of API keys using Electron's `safeStorage`, with a JSON-based key store on disk.

## Current Issues

1. **Discriminated union return types** (`{ id, keyPrefix } | { error }`) are used throughout but TypeScript narrowing requires checking `'error' in result` everywhere — cleaner to use a `Result<T>` type
2. **`getApiKeyForProvider(provider: string)`** returns the first key for a provider, but there may be multiple keys per provider — ambiguous behavior
3. **`listApiKeys()`** manually selects fields from `StoredKey` — should use a pick utility or Omit type
4. **`encryptApiKey()`** calls `getPrefix(apiKey)` twice — once inline, once in return — store in variable
5. **No key deduplication** — same API key can be stored multiple times
6. **`saveStore()`** writes synchronously with `writeFileSync` — fine for small files, but could block event loop during frequent saves (e.g., `lastUsedAt` updates)
7. **No migration path** for `KeyStore.version` — version is set to 1 but never checked
8. **`decryptApiKey` updates `lastUsedAt`** on every decrypt call — this causes a disk write on every API call, potentially thousands of times

## Refactoring Rules

1. **Define a `Result<T, E>` type** (e.g., `{ ok: true; value: T } | { ok: false; error: E }`) for cleaner error handling
2. **Throttle `lastUsedAt` updates** — only write every N decrypts or at most once per minute
3. **Add key deduplication** — check if same key prefix + provider exists before adding
4. **Remove duplicate `getPrefix()` call** in `encryptApiKey`
5. **Cache the loaded store** in memory to reduce disk reads for `listApiKeys` and frequent calls
6. **Add store migration** based on `version` field
7. **Debounce `saveStore()`** calls to batch rapid writes
8. **Consider `getApiKeyForProvider` returning all keys** or rename to `getFirstApiKeyForProvider`

## Dependencies

- External: `electron` (`safeStorage`, `app`)
- Internal: none
- Used by: `../ipc/api-keys.ts`

## Verification

- `npm run typecheck` (electron)
- Test encrypt/decrypt round-trip
- Test key listing and deletion
- Test with `safeStorage.isEncryptionAvailable() === false`
- Verify store file contents on disk
