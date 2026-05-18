# Zustand Stores — Testing Rules

## 1. `src/store/executionStore.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Initial state: `activeWorkflowId: null`, `executionStatus: 'idle'`, `currentPromptIndex: 0`, `responseBuffer: ''`, `loopIteration: 0`, `recentLogs: []`
  - `setActiveWorkflow(id)` updates active workflow ID
  - `setExecutionStatus(status)` updates status (valid: idle, running, paused, completed, stopped, error)
  - `setCurrentPromptIndex(index)` updates current index
  - `setLoopIteration(iteration)` updates loop iteration
  - `appendResponseChunk(chunk)` concatenates to responseBuffer
  - `clearResponse()` resets responseBuffer to ''
  - `addLog(log)` prepends log with generated UUID; caps `recentLogs` at 100 entries
  - `resetExecution()` restores initial state (all fields to defaults)
- **Mocking requirements:** None (pure Zustand store)
- **Coverage targets:** All 9 actions; log cap at exactly 100; UUID generation uniqueness
- **Suggested test file location:** `src/test/store/executionStore.test.ts`

## 2. `src/store/workflowStore.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Initial state: `workflows: []`, `activeWorkflowId: null`
  - `setWorkflows(workflows)` replaces entire workflow list
  - `addWorkflow(workflow)` appends to list
  - `updateWorkflow(id, data)` merges partial data into matching workflow by id (no-op if id not found)
  - `removeWorkflow(id)` filters out matching workflow (no-op if id not found)
  - `setActiveWorkflow(id)` sets active workflow ID (including null)
- **Mocking requirements:** None (pure Zustand store)
- **Coverage targets:** All 6 actions; update non-existent id; remove non-existent id
- **Suggested test file location:** `src/test/store/workflowStore.test.ts`

## 3. `src/store/settingsStore.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Initial state: `theme: 'system'`, `windowMode: 'full'`, `minimizeToTrayOnClose: false`, `notificationsEnabled: true`, `startOnBoot: false`, `user: null`
  - `setTheme(theme)` updates theme
  - `setWindowMode(mode)` updates window mode
  - `toggleMinimizeToTray()` flips boolean
  - `toggleNotifications()` flips boolean
  - `setStartOnBoot(enabled)` sets start on boot
  - `setUser(user)` stores user object
  - `clearUser()` sets user to null
  - Persisted via `zustand/middleware/persist` with key `promptloop-settings`
  - `partialize` whitelists: theme, windowMode, minimizeToTrayOnClose, notificationsEnabled, startOnBoot (user NOT persisted)
- **Mocking requirements:** None (pure Zustand store; test persist middleware separately)
- **Coverage targets:** All 7 actions; persist partialize (5 fields whitelisted, user excluded)
- **Suggested test file location:** `src/test/store/settingsStore.test.ts`

## 4. `src/store/index.ts`

- **Test type:** Unit
- **Key scenarios:**
  - Re-exports `useExecutionStore`, `useWorkflowStore`, `useSettingsStore` from their respective modules
- **Mocking requirements:** None
- **Coverage targets:** All 3 exports resolved correctly
- **Suggested test file location:** `src/test/store/index.test.ts`
