import { useExecutionStore } from '@/store/executionStore'
import { useWorkflowStore } from '@/store/workflowStore'
import { useSettingsStore } from '@/store/settingsStore'

export function resetExecutionStore() {
  useExecutionStore.setState({
    activeWorkflowId: null,
    executionStatus: 'idle',
    currentPromptIndex: 0,
    responseBuffer: '',
    loopIteration: 0,
    recentLogs: [],
  })
}

export function resetWorkflowStore() {
  useWorkflowStore.setState({
    workflows: [],
    activeWorkflowId: null,
  })
}

export function resetSettingsStore() {
  useSettingsStore.setState({
    theme: 'system',
    windowMode: 'full',
    minimizeToTrayOnClose: false,
    notificationsEnabled: true,
    startOnBoot: false,
    user: null,
  })
}

export function resetAllStores() {
  resetExecutionStore()
  resetWorkflowStore()
  resetSettingsStore()
}
