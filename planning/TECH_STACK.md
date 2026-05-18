# Tech Stack Decisions

**Product:** PromptLoop
**Version:** 1.0
**Last Updated:** 2026-05-17

---

## 1. Overview

This document captures all technology decisions for PromptLoop, including the rationale for each choice and rejected alternatives.

---

## 2. Desktop Shell

### Chosen: Electron + Vite

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| Desktop Framework | **Electron** | Tauri, NW.js, Proton Native | Mature ecosystem, extensive docs, easiest path from web to desktop for a React developer. Chromium-based renderer ensures full CSS/JS compatibility. |
| Bundler | **Vite** | Webpack, esbuild, Parcel | Fastest dev server with HMR, first-class TypeScript support, excellent Electron integration via `electron-vite` or `vite-plugin-electron`. |

### Why not Tauri?
Tauri (Rust backend) would give a smaller binary and better memory usage, but adds Rust to the stack. For a solo React developer, Electron eliminates the need to learn a new systems language.

### Why not Electron Forge/CRA?
Vite provides significantly faster development iteration. `electron-vite` bridges the gap cleanly.

---

## 3. Frontend Framework

### Chosen: React 18 + TypeScript

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Library | **React 18** | User's stated preference. Concurrent features, Suspense, streaming SSR-compatible patterns. |
| Language | **TypeScript** | Type safety across the entire codebase (main + renderer). Catches IPC type mismatches at compile time. |
| Routing | **React Router v6** | Standard choice for SPAs. Nested routes, loaders, and actions fit the app's page structure. |
| State Management | **Zustand** | Lightweight (1.1kB), no boilerplate, works outside React components (useful for IPC event handlers that need to update state). |
| Data Fetching | **TanStack Query** | Automatic caching, deduplication, and background refetching for Firestore reads. |
| Styling | **Tailwind CSS** | Utility-first, rapid prototyping, tree-shaking in production, consistent design system. |

### Why Zustand over Context/Redux?
Redux adds too much boilerplate for an app this size. React Context would work but causes unnecessary re-renders. Zustand provides a simple store API that works both in and outside of React components — critical for the IPC event handlers that run outside the React tree.

### Why TanStack Query?
Firestore has its own real-time listeners (`onSnapshot`), but TanStack Query provides caching, deduplication, and a declarative API that integrates better with the React component lifecycle. Firestore listeners are used for real-time execution updates, while TanStack Query handles CRUD read operations.

---

## 4. Authentication

### Chosen: Firebase Auth

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| Auth Provider | **Firebase Auth** | Auth0, Clerk, Supabase Auth | Free tier includes email/password + Google/GitHub OAuth. No backend needed — client SDK works directly in Electron. Built-in session management and token refresh. |

### Supported Providers (V1)
1. **Email/Password** — Standard email registration and login
2. **Google** — OAuth via Firebase popup or redirect
3. **GitHub** — OAuth via Firebase popup or redirect

### What about Auth0 or Clerk?
Both are excellent but introduce additional cost and complexity. Firebase Auth's free tier (10,000 monthly active users) is more than sufficient for a desktop app. Clerk's React SDK is newer and less battle-tested in Electron.

### Electron + Firebase Auth Considerations
Firebase's `signInWithPopup` and `signInWithRedirect` work differently in Electron. We use `signInWithRedirect` or the OAuth custom flow:

1. Open a separate browser window for OAuth
2. Firebase Auth handles the callback via the redirect URL
3. On success, the ID token is exchanged and the user is signed in
4. The Electron app receives the auth state via `onAuthStateChanged`

---

## 5. Database

### Chosen: Firestore

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| Database | **Cloud Firestore** | SQLite, PostgreSQL, Supabase, IndexedDB | Real-time sync, offline support, no server management. Subcollections model the workflow > prompts hierarchy naturally. Firestore triggers enable future features like webhook notifications. |

### Why not SQLite?
SQLite (via `better-sqlite3`) would give zero network latency and simpler queries. However, it lacks the real-time sync and cloud persistence that Firestore provides. The user explicitly requested Firestore.

### Why not Supabase?
Supabase is excellent but requires a PostgreSQL backend. Firestore's document model maps more naturally to the unstructured prompt/execution data. Supabase also doesn't have native offline support in the same way Firestore does.

### Data Locality
Firestore is the source of truth. However, the app maintains a local cache for:
- API keys (encrypted on disk via `safeStorage`)
- UI preferences (Zustand persist middleware)
- Recent execution logs (in-memory buffer)

---

## 6. AI Provider SDK

### Chosen: Vercel AI SDK

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| AI SDK | **Vercel AI SDK** | LangChain, OpenRouter, Custom fetch calls | Unified API across OpenAI, Anthropic, and Google. Built-in streaming support. Framework-agnostic — the `streamText` function works directly in Node.js (main process). |

### Why not LangChain?
LangChain is designed for complex agent chains and RAG pipelines. PromptLoop only needs simple text generation. Vercel AI SDK provides a much simpler abstraction over the same providers.

### Provider Configuration

The SDK wraps each provider's native API:

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const modelMap = {
  'gpt-4': openai('gpt-4'),
  'gpt-4o': openai('gpt-4o'),
  'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
  'claude-3-opus': anthropic('claude-3-opus-20240229'),
  'claude-3-sonnet': anthropic('claude-3-sonnet-20240229'),
  'claude-3-haiku': anthropic('claude-3-haiku-20240307'),
  'gemini-1.5-pro': google('gemini-1.5-pro'),
  'gemini-1.5-flash': google('gemini-1.5-flash'),
};

async function streamPrompt(modelKey: string, prompt: string, options: StreamOptions) {
  const model = modelMap[modelKey];
  if (!model) throw new Error(`Unknown model: ${modelKey}`);

  const result = await streamText({
    model,
    prompt,
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    abortSignal: options.signal,
  });

  return result.textStream; // AsyncIterable<string>
}
```

---

## 7. UI Component Library

### Chosen: shadcn/ui (Radix Primitives)

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| Components | **shadcn/ui** | Material UI, Ant Design, Chakra UI, Mantine | Copy-paste components (no dependency), built on Radix UI primitives (accessible), Tailwind-styled, tree-shakeable by default. |

### Why shadcn over MUI/Ant Design?
- **No dependency burden**: Components are copied into the project, not imported as a library
- **Full control**: Every component can be modified directly
- **Size**: No 50kB+ component library — only what you use
- **Tailwind**: All components use Tailwind classes, consistent with the styling approach

### Core Components Needed
| Component | Purpose |
|-----------|---------|
| Button, Input, Select | Forms, controls |
| Dialog, Sheet | Modals, slide-over panels |
| DropdownMenu | Tray context menu equivalent in-app |
| Command (cmdk) | Quick actions / command palette |
| Table | Execution logs |
| Tabs | Workflow builder sections |
| Tooltip | Hover hints for icons |
| Toast | In-app notifications |
| Progress | Execution progress bar |
| ScrollArea | Log viewer |

---

## 8. Build & Package

### Chosen: electron-builder

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Packaging | **electron-builder** | Mature, supports macOS (dmg), Windows (nsis/portable), Linux (AppImage/deb). Auto-update integration. |
| Auto-update | **electron-updater** | Ships with electron-builder. GitHub Releases as update server. Differential updates supported. |
| Code Signing | **macOS: Notarization** + **Windows: Authenticode** | Required for Gatekeeper and SmartScreen. Configured via env vars in CI. |

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/release.yml
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run publish
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
          WIN_CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
          WIN_CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
```

---

## 9. Development Tools

| Tool | Purpose |
|------|---------|
| VS Code | IDE |
| ESLint + Prettier | Code formatting and linting |
| Husky + lint-staged | Pre-commit hooks |
| Firebase Emulator Suite | Local Firebase development (auth + firestore) |
| Vitest | Unit testing (renderer + main process) |
| Playwright | E2E testing of the Electron app |
| Sentry | Error tracking (main + renderer) |
| Electron DevTools | Chrome DevTools for the renderer process |

---

## 10. NPM Dependencies

### Production Dependencies

| Package | Purpose | Approx Size |
|---------|---------|-------------|
| `react` + `react-dom` | UI framework | 6.5 kB (gzip) |
| `react-router-dom` | Routing | 6 kB |
| `zustand` | State management | 1.1 kB |
| `@tanstack/react-query` | Data fetching | 8 kB |
| `firebase` | Auth + Firestore | 30 kB (tree-shaken) |
| `ai` + `@ai-sdk/*` | AI provider SDK | 15 kB |
| `tailwindcss` | Styling (build time) | - |
| `lucide-react` | Icons | tree-shakable |
| `sonner` | Toast notifications | 2 kB |
| `@radix-ui/*` | UI primitives | varies |
| `clsx` + `tailwind-merge` | Class utilities | < 1 kB |
| `date-fns` | Date formatting | 3 kB |
| `@sentry/electron` | Error tracking | 10 kB |
| `electron-updater` | Auto-updates | 15 kB |
| `electron-store` | Persistent settings | 5 kB |
| `uuid` | ID generation | 1.5 kB |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `electron` | Desktop shell |
| `electron-builder` | Packaging |
| `vite` | Bundler |
| `@vitejs/plugin-react` | React support |
| `electron-vite` or `vite-plugin-electron` | Electron + Vite integration |
| `typescript` | Type checking |
| `vitest` | Unit tests |
| `@playwright/test` | E2E tests |
| `eslint` + `prettier` | Linting / formatting |
| `husky` + `lint-staged` | Git hooks |
| `firebase-tools` | Firebase emulator |

---

## 11. Project Structure

```
promptloop/
├── electron/
│   ├── main/               # Main process
│   │   ├── index.ts        # Entry point
│   │   ├── window.ts       # Window manager
│   │   ├── tray.ts         # System tray
│   │   ├── ipc/            # IPC handlers
│   │   │   ├── workflow.ts
│   │   │   ├── execution.ts
│   │   │   ├── api-keys.ts
│   │   │   └── app.ts
│   │   ├── engine/         # Execution engine
│   │   │   ├── runner.ts
│   │   │   ├── queue.ts
│   │   │   ├── retry.ts
│   │   │   └── scheduler.ts
│   │   ├── providers/      # AI provider adapters
│   │   │   ├── interface.ts
│   │   │   ├── openai.ts
│   │   │   ├── anthropic.ts
│   │   │   └── google.ts
│   │   ├── encryption.ts   # Key management
│   │   ├── updater.ts      # Auto-updater
│   │   └── sentry.ts       # Error reporting
│   ├── preload/
│   │   └── index.ts        # Preload script
│   └── shared/
│       └── types.ts        # IPC type definitions
├── src/                    # Renderer (React app)
│   ├── main.tsx            # Entry point
│   ├── App.tsx             # Root component
│   ├── routes.tsx          # Route definitions
│   ├── components/         # Shared components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── layout/         # Sidebar, titlebar, etc.
│   │   └── workflow/       # Workflow-specific components
│   ├── pages/              # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── WorkflowEditor.tsx
│   │   ├── ExecutionViewer.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useWorkflows.ts
│   │   ├── usePrompts.ts
│   │   ├── useExecutions.ts
│   │   ├── useIpc.ts
│   │   └── useAuth.ts
│   ├── store/              # Zustand stores
│   │   ├── index.ts
│   │   ├── executionStore.ts
│   │   ├── workflowStore.ts
│   │   └── settingsStore.ts
│   ├── lib/                # Utilities
│   │   ├── firebase.ts
│   │   ├── ipc.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css     # Tailwind imports
├── package.json
├── electron-builder.yml
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── firebase.json           # Firebase emulator config
```
