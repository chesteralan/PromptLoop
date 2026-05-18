# Electron Main Process Refactor Rules

Files: `electron/main/index.ts`, `electron/main/window.ts`, `electron/main/updater.ts`, `electron/main/sentry.ts`, `electron/main/tray.ts`, `electron/main/notifications.ts`, `electron/main/shortcuts.ts`, `electron/main/encryption.ts`

## Standards Violated

### 6 — TypeScript Standards (any, loose types)

- **Specific issues:**
  - `index.ts:33` — `trayActions` uses `Record<string, () => void>` instead of a typed union key
  - `window.ts:18-19` — `minimizeToTray` and `windowMode` are plain mutable module-level variables with inferred types
  - `encryption.ts:38` — `JSON.parse(readFileSync(...)) as KeyStore` — unsafe cast
- **Fix:** Use proper discriminated unions; avoid raw `as` casts on parsed JSON
- **Priority:** Medium

### 11 — Error Handling (silent failures)

- **Specific issues:**
  - `encryption.ts:78` — `.some()` for duplicate check throws on missing field
- **Fix:** Add explicit validation and error boundaries
- **Priority:** Low

### 17 — Code Smells to Eliminate

- **Specific issues:**
  - `window.ts:90` — `debounceTimer` module-level mutable state, used across resize/move handlers
  - `window.ts:18-19` — Module-level mutable state (`minimizeToTray`, `windowMode`) scattered across file
  - `updater.ts:6` — `console.log` left behind (dead code)
  - `tray.ts:8-18` — Inline SVG string construction in `generateIcon` (magic numbers)
  - `encryption.ts:23-24` — `cachedStore` and `saveTimer` module-level mutable state with no encapsulation
  - `encryption.ts:108-111` — `lastUsedAtCounter` modulo-based save schedule is fragile magic logic
- **Fix:** Encapsulate module state in classes or exported factory functions; remove `console.log`; extract SVG to constants
- **Priority:** High

### 1 — General Principles (readability, dead code)

- **Specific issues:**
  - `updater.ts:4-7` — Stub function with placeholder comment and `console.log`
  - `window.ts` — 186 lines, moderate; debounce logic duplicated for resize/move
- **Fix:** Remove stub dead code or implement; deduplicate debounce logic
- **Priority:** Medium
