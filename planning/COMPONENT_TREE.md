# Component Tree & Routing

**Product:** PromptLoop
**Version:** 1.0
**Last Updated:** 2026-05-17

---

## Table of Contents

- [1. Route Structure](#1-route-structure)
- [2. Component Tree](#2-component-tree)
- [3. Page Specifications](#3-page-specifications)
- [4. Shared Components](#4-shared-components)
- [5. Props & State Patterns](#5-props--state-patterns)
- [6. Keyboard Shortcuts](#6-keyboard-shortcuts)

---

## 1. Route Structure

```
/login                          → LoginPage
/                               → DashboardPage (redirect to /dashboard)
/dashboard                      → DashboardPage
/workflows/new                  → WorkflowEditorPage (create)
/workflows/:id                  → WorkflowEditorPage (edit)
/workflows/:id/execute          → ExecutionViewerPage
/settings                       → SettingsPage
/settings/api-keys              → ApiKeysPage
```

### Route Definitions

```typescript
// src/routes.tsx
import { createHashRouter } from 'react-router-dom';

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,       // Protected layout with sidebar
    loader: authLoader,            // Redirect to /login if not authenticated
    children: [
      {
        index: true,
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'workflows/new',
        element: <WorkflowEditorPage />,
      },
      {
        path: 'workflows/:workflowId',
        element: <WorkflowEditorPage />,
      },
      {
        path: 'workflows/:workflowId/execute',
        element: <ExecutionViewerPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'settings/api-keys',
        element: <ApiKeysPage />,
      },
    ],
  },
]);
```

Note: Using `HashRouter` because Electron loads files from `file://` protocol, which doesn't support HTML5 history API routing.

---

## 2. Component Tree

```
<App>
├── <AuthProvider>                        // Firebase auth context
│   ├── <Toaster />                       // Toast notifications
│   └── <RouterProvider router={router} />
│
├── [Route: /login]
│   └── <LoginPage>
│       ├── <LoginForm>
│       │   ├── <EmailInput />
│       │   ├── <PasswordInput />
│       │   └── <SubmitButton />
│       ├── <Divider text="or" />
│       ├── <OAuthButtons>
│       │   ├── <GoogleSignInButton />
│       │   └── <GitHubSignInButton />
│       └── <PasswordResetLink />
│
├── [Route: / (authenticated)]
│   └── <AppLayout>
│       ├── <Sidebar>
│       │   ├── <AppLogo />
│       │   ├── <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
│       │   ├── <NavItem to="/workflows/new" icon={PlusCircle} label="New Workflow" />
│       │   ├── <NavItem to="/settings" icon={Settings} label="Settings" />
│       │   ├── <Spacer />
│       │   └── <UserMenu>
│       │       ├── <Avatar />
│       │       ├── <DisplayName />
│       │       └── <SignOutButton />
│       ├── <MainContent>
│       │   └── <Outlet />               // Route children render here
│       └── <StatusBar>
│           ├── <ExecutionStatusIndicator />
│           └── <AppVersion />
│
│   ├── [Route: /dashboard]
│   │   └── <DashboardPage>
│       ├── <PageHeader title="Dashboard" />
│       ├── <WorkflowList>
│       │   ├── <WorkflowCard>            // One per workflow
│       │   │   ├── <WorkflowName />
│       │   │   ├── <WorkflowStatusBadge />
│       │   │   ├── <PromptCount />
│       │   │   ├── <LastExecutionInfo />
│       │   │   └── <WorkflowActions>
│       │   │       ├── <StartButton />
│       │   │       ├── <EditButton />
│       │   │       └── <DeleteButton />
│       │   └── <EmptyState />           // When no workflows exist
│       └── <QuickStats>
│           ├── <StatCard label="Total Runs" value={count} />
│           ├── <StatCard label="Success Rate" value={`${rate}%`} />
│           └── <StatCard label="Active" value={active} />
│
│   ├── [Route: /workflows/new, /workflows/:id]
│   │   └── <WorkflowEditorPage>
│       ├── <PageHeader>
│       │   ├── <WorkflowNameInput />
│       │   ├── <SaveButton />
│       │   └── <WorkflowActions>
│       │       ├── <TestRunButton />     // Run once without saving
│       │       └── <DeleteButton />
│       ├── <WorkflowSettings>
│       │   ├── <LoopModeSelector />
│       │   ├── <MaxIterationsInput />    // Shown only for fixed mode
│       │   ├── <ScheduleSection>
│       │   │   ├── <ScheduleTypeRadio />
│       │   │   ├── <DateTimePicker />    // For once mode
│       │   │   └── <DayOfWeekSelector /> // For weekly mode
│       │   └── <ImportExportButtons />
│       ├── <PromptList>
│       │   ├── <DragDropContext>          // @hello-pangea/dnd
│       │   │   ├── <PromptCard>           // Draggable, one per prompt
│       │   │   │   ├── <DragHandle />
│       │   │   │   ├── <PromptTitle />
│       │   │   │   ├── <PromptModel />
│       │   │   │   ├── <PromptEnabledToggle />
│       │   │   │   └── <PromptActions>
│       │   │   │       ├── <EditButton />    // Opens panel or inline edit
│       │   │   │       └── <DeleteButton />
│       │   │   └── <DroppableArea />
│       │   └── <AddPromptButton />
│       └── <PromptEditorPanel>            // Slide-over or dialog
│           ├── <PromptContentTextarea />
│           ├── <SystemPromptInput />
│           ├── <ModelSelector>
│           │   ├── <ProviderGroup label="OpenAI">
│           │   │   ├── <ModelOption value="gpt-4" />
│           │   │   ├── <ModelOption value="gpt-4o" />
│           │   │   └── <ModelOption value="gpt-3.5-turbo" />
│           │   ├── <ProviderGroup label="Anthropic">
│           │   │   ├── <ModelOption value="claude-3-opus" />
│           │   │   ├── <ModelOption value="claude-3-sonnet" />
│           │   │   └── <ModelOption value="claude-3-haiku" />
│           │   └── <ProviderGroup label="Google">
│           │       ├── <ModelOption value="gemini-1.5-pro" />
│           │       └── <ModelOption value="gemini-1.5-flash" />
│           ├── <AdvancedSettings collapsible>
│           │   ├── <TemperatureSlider />
│           │   ├── <MaxTokensInput />
│           │   ├── <DelayMsInput />
│           │   └── <VariableEditor>
│           │       ├── <VariableRow>      // One per variable
│           │       │   ├── <VariableNameInput />
│           │       │   └── <VariableValueInput />
│           │       └── <AddVariableButton />
│           └── <PromptActions>
│               ├── <SavePromptButton />
│               └── <TestPromptButton />   // Sends prompt immediately
│
│   ├── [Route: /workflows/:id/execute]
│   │   └── <ExecutionViewerPage>
│       ├── <ExecutionHeader>
│       │   ├── <WorkflowName />
│       │   ├── <ExecutionStatusBadge />
│       │   ├── <ExecutionControls>
│       │   │   ├── <StartButton />
│       │   │   ├── <PauseButton />
│       │   │   ├── <StopButton />
│       │   │   └── <RetryButton />        // Visible only on error
│       │   └── <LoopInfo>
│       │       ├── <IterationCounter />
│       │       └── <LoopModeIndicator />
│       ├── <ExecutionProgress>
│       │   ├── <PromptProgressBar />       // Shows overall workflow progress
│       │   └── <PromptQueueList>
│       │       ├── <QueueItem status="completed" />    // Green
│       │       ├── <QueueItem status="running" />      // Blue + animated
│       │       ├── <QueueItem status="pending" />      // Gray
│       │       └── <QueueItem status="failed" />       // Red
│       ├── <CurrentResponse>
│       │   ├── <ResponseHeader>
│       │   │   ├── <PromptTitle />
│       │   │   ├── <TokenCount />
│       │   │   └── <Duration />
│       │   └── <ResponseContent>
│       │       ├── <StreamingText />       // Typewriter effect for real-time
│       │       └── <CopyButton />
│       └── <ExecutionLogs>
│           ├── <LogToolbar>
│           │   ├── <LogFilter />           // All | Completed | Failed
│           │   └── <ClearButton />
│           └── <LogTable>
│               ├── <LogRow>                // One per execution
│               │   ├── <LogTimestamp />
│               │   ├── <LogPromptTitle />
│               │   ├── <LogStatus />
│               │   ├── <LogDuration />
│               │   ├── <LogTokens />
│               │   └── <LogError />        // Tooltip on error
│               └── <LogRowSkeleton />      // Loading state
│
│   └── [Route: /settings, /settings/api-keys]
│       └── <SettingsPage>
│           ├── <SettingsSidebar>
│           │   ├── <SettingsNavItem to="/settings" label="General" />
│           │   └── <SettingsNavItem to="/settings/api-keys" label="API Keys" />
│           └── <SettingsContent>
│               ├── [Route: /settings]
│               │   └── <GeneralSettings>
│               │       ├── <ThemeSelector />          // Light / Dark / System
│               │       ├── <BehaviorSection>
│               │       │   ├── <MinimizeToTrayToggle />
│               │       │   ├── <StartOnBootToggle />
│               │       │   └── <NotificationsToggle />
│               │       ├── <AccountSection>
│               │       │   ├── <UserEmail />
│               │       │   └── <SignOutButton />
│               │       └── <AboutSection>
│               │           ├── <AppVersion />
│               │           ├── <CheckForUpdatesButton />
│               │           └── <LicenseInfo />
│               └── [Route: /settings/api-keys]
│                   └── <ApiKeysSettings>
│                       ├── <ApiKeyList>
│                       │   ├── <ApiKeyCard>
│                       │   │   ├── <ProviderIcon />
│                       │   │   ├── <KeyPrefix />
│                       │   │   ├── <LastUsedInfo />
│                       │   │   └── <DeleteButton />
│                       │   └── <EmptyKeysState />
│                       └── <AddApiKeyDialog>
│                           ├── <ProviderSelect />
│                           ├── <ApiKeyInput type="password" />
│                           └── <SaveKeyButton />
```

---

## 3. Page Specifications

### 3.1 Login Page

**File:** `src/pages/Login.tsx`

**States:**
| State | Behavior |
|-------|----------|
| Loading | Buttons disabled, spinner shown; Firebase Auth state initializing |
| Ready | All sign-in methods available |
| Error | Error message displayed below form; buttons re-enabled |
| Already authenticated | Redirect to `/dashboard` |

**Behavior:**
- On successful login, navigate to `/dashboard`
- On error, show inline error (not toast) for form errors
- Password reset sends email; show confirmation toast

### 3.2 Dashboard Page

**File:** `src/pages/Dashboard.tsx`

**Data Fetching:**
- `useQuery(['workflows'])` on mount
- `onSnapshot` listener for real-time status updates on active workflows

**States:**
| State | Display |
|-------|---------|
| Loading | Skeleton cards (3) |
| Empty | Empty state with illustration + "Create your first workflow" CTA |
| Data | Workflow cards in a responsive grid (2 columns desktop, 1 mobile) |
| Error | Error message + retry button |

### 3.3 Workflow Editor Page

**File:** `src/pages/WorkflowEditor.tsx`

**Data Fetching:**
- If editing (`:workflowId`), load workflow + prompts via TanStack Query
- If creating (`/new`), initialize empty workflow in Zustand

**States:**
| State | Display |
|-------|---------|
| Loading (edit mode) | Full page skeleton |
| Not found (edit mode) | "Workflow not found" with back button |
| Ready | Full editor UI |
| Saving | Save button shows spinner |
| Dirty indicator | Unsaved changes indicator in header |

**Behavior:**
- Auto-save after 2 seconds of inactivity (debounced)
- Drag-and-drop reorder updates position locally, writes to Firestore on drop
- Prompt editor panel replaces `<PromptCard>` selection with expand/collapse
- Test prompt button sends prompt immediately (bypasses execution engine)
- Delete with confirmation dialog

### 3.4 Execution Viewer Page

**File:** `src/pages/ExecutionViewer.tsx`

**Data Flow:**
- IPC listeners register on mount, cleanup on unmount
- Firestore writes handled by main process; renderer reads via IPC events
- Execution logs loaded via TanStack Query on mount

**States:**
| State | Display |
|-------|---------|
| Not started | Workflow summary + Start button |
| Running | Live streaming response + animated queue |
| Paused | Paused overlay on response area; Resume button |
| Completed | Final response + summary |
| Error | Error message + Retry button |
| No prompt data | "This workflow has no active prompts" |

**Edge Cases:**
- Network disconnect during streaming: show "Reconnecting..." then fall back to error
- Workflow deleted during execution: stop engine, show error
- Firestore write failure: buffer log locally, show warning

### 3.5 Settings Page

**File:** `src/pages/Settings.tsx`

**Data Fetching:**
- Settings loaded from Zustand persisted store (instant)
- API keys loaded from main process via IPC

**States:**
| State | Display |
|-------|---------|
| Ready | All settings sections |
| Saving | Individual save buttons show spinner |
| Error | Toast notification |

---

## 4. Shared Components

### 4.1 UI Primitives (shadcn/ui)

These are copied into `src/components/ui/` and customized:

```
src/components/ui/
├── button.tsx
├── input.tsx
├── select.tsx
├── dialog.tsx
├── sheet.tsx
├── dropdown-menu.tsx
├── tabs.tsx
├── tooltip.tsx
├── toast.tsx         → replaced by sonner
├── progress.tsx
├── badge.tsx
├── card.tsx
├── table.tsx
├── separator.tsx
├── switch.tsx
├── slider.tsx
├── skeleton.tsx
├── textarea.tsx
├── label.tsx
├── avatar.tsx
├── scroll-area.tsx
└── command.tsx
```

### 4.2 App-Specific Shared Components

```
src/components/
├── layout/
│   ├── AppLayout.tsx           // Sidebar + MainContent + StatusBar
│   ├── Sidebar.tsx             // Navigation sidebar
│   ├── StatusBar.tsx           // Bottom bar with execution status
│   └── ProtectedRoute.tsx     // Auth guard
├── workflow/
│   ├── WorkflowCard.tsx        // Dashboard workflow card
│   ├── WorkflowStatusBadge.tsx // Status badge (colored dot + label)
│   ├── PromptCard.tsx          // Draggable prompt card
│   ├── PromptEditorPanel.tsx   // Slide-over panel for editing prompt
│   ├── PromptProgressBar.tsx   // Execution progress indicator
│   └── QueueItem.tsx           // Execution queue item
├── execution/
│   ├── ExecutionControls.tsx   // Start/Pause/Stop/Retry buttons
│   ├── StreamingText.tsx       // Real-time text display with typewriter
│   ├── ResponseContent.tsx     // Formatted AI response display
│   └── ExecutionLogTable.tsx   // Execution history table
├── auth/
│   ├── AuthProvider.tsx        // Firebase auth context provider
│   ├── LoginForm.tsx           // Email/password form
│   └── OAuthButtons.tsx        // Google/GitHub sign-in buttons
├── settings/
│   ├── ApiKeyCard.tsx          // API key display card
│   └── AddApiKeyDialog.tsx     // Dialog to add new API key
└── shared/
    ├── EmptyState.tsx          // Empty state with illustration and CTA
    ├── ConfirmDialog.tsx       // Generic confirmation dialog
    ├── PageHeader.tsx          // Page title + actions
    └── SkeletonCard.tsx        // Loading skeleton
```

---

## 5. Props & State Patterns

### 5.1 Component Data Flow

```
Firestore ──► TanStack Query ──► Component props
                                        │
IPC Events ──► Zustand Store ──► useSelector() hooks
                                        │
User Input ──► Local state (useState) ──► Component render
```

### 5.2 When to Use What

| Data | Tool | Reason |
|------|------|--------|
| Workflow/prompt CRUD | TanStack Query | Caching, refetching, mutations |
| Execution status | Zustand + IPC listeners | Real-time, not persisted in renderer |
| UI state (dialogs, panels) | useState | Local to component, not shared |
| Theme, preferences | Zustand persist | Persisted to disk, shared across components |
| Auth state | Firebase onAuthStateChanged | Wrapped in React context |
| Form state | react-hook-form | Complex forms with validation |

### 5.3 IPC Hook

```typescript
// src/hooks/useIpc.ts

function useExecutionListener() {
  const appendChunk = useExecutionStore(s => s.appendResponseChunk);
  const addLog = useExecutionStore(s => s.addLog);
  const setStatus = useExecutionStore(s => s.setExecutionStatus);

  useEffect(() => {
    const cleanupChunk = window.electronAPI.onExecutionChunk((data) => {
      appendChunk(data.chunk);
    });
    const cleanupCompleted = window.electronAPI.onExecutionCompleted((data) => {
      addLog({ status: 'completed', ...data });
    });
    const cleanupFailed = window.electronAPI.onExecutionFailed((data) => {
      addLog({ status: 'failed', ...data });
      setStatus('error');
    });

    return () => {
      cleanupChunk();
      cleanupCompleted();
      cleanupFailed();
    };
  }, []);
}
```

---

## 6. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Enter` | Start workflow execution |
| `Cmd+Shift+Enter` | Pause/resume workflow |
| `Cmd+.` | Stop workflow |
| `Cmd+N` | New workflow |
| `Cmd+S` | Save workflow |
| `Cmd+,` | Open settings |
| `Cmd+W` | Close window (minimize to tray if enabled) |
| `Cmd+Q` | Quit app |
| `Cmd+1-9` | Navigate to workflow at list index |
| `Cmd+K` | Command palette (future) |
| `Escape` | Close panel / dialog |
| `Space` | Toggle play/pause when execution viewer is focused |

Shortcuts are disabled when editing text inputs to prevent conflicts.
