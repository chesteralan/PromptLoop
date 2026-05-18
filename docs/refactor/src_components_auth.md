# Auth Components Refactor Rules

Files: `src/components/auth/AuthProvider.tsx`, `src/components/auth/OAuthButtons.tsx`

## Standards Violated

### 11 — Error Handling (silent failures)

- **Specific issues:**
  - `AuthProvider.tsx:65` — `getRedirectResult(...).catch(() => {})` — fully silent, swallows errors
  - `AuthProvider.tsx:73` — `ensureUserDocument(user).catch(() => {})` — fully silent, user doc creation failures are invisible
  - `AuthProvider.tsx:73` — Fire-and-forget promise with no error reporting
- **Fix:** Log errors or surface via toast; at minimum use `console.warn` with context
- **Priority:** High

### 3 — React Component Standards

- **Specific issues:**
  - `AuthProvider.tsx:92` — Component at 92 lines, reasonable
- **Fix:** None
- **Priority:** None

### 7 — Styling Standards

- **Specific issues:**
  - `OAuthButtons.tsx` — Inline SVG for Google/GitHub icons (acceptable for brand icons, but could be extracted)
- **Fix:** Consider extracting SVG icon components to `src/components/ui/icons.tsx`
- **Priority:** Low

### 14 — Accessibility

- **Specific issues:**
  - `OAuthButtons.tsx:11` — `aria-busy={isLoading}` on the container is good
  - `OAuthButtons.tsx:17,43` — `aria-label` on buttons is good
- **Fix:** None — already compliant
- **Priority:** None
