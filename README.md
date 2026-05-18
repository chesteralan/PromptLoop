# PromptLoop

A desktop app for orchestrating sequential AI prompts across multiple providers (OpenAI, Anthropic, Google Gemini).

## Development

```bash
# Install dependencies
yarn

# Copy environment variables
cp .env.example .env
# Fill in your Firebase project values in .env

# Start dev server (Electron + Vite HMR)
yarn dev

# Run tests
yarn test

# Type-check
yarn typecheck

# Lint
yarn lint
```

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Google, GitHub)
3. Create a Firestore database
4. Register a Web app to get config values
5. Add `http://localhost` as an authorized domain in Authentication > Settings
6. Run `yarn firebase deploy --only firestore:rules,firestore:indexes`

## Architecture

- **Renderer**: React 19 + TypeScript + Tailwind v4 + shadcn/ui (Base UI)
- **State**: Zustand stores + TanStack Query
- **Main Process**: Electron with IPC handlers for workflow execution, API key encryption (safeStorage), system tray, desktop notifications
- **AI**: Vercel AI SDK (@ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google)
