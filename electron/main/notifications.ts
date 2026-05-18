import { Notification, BrowserWindow } from 'electron'

function focusMainWindow(): void {
  const wins = BrowserWindow.getAllWindows()
  if (wins.length > 0) {
    wins[0].show()
    wins[0].focus()
  }
}

function truncateWithEllipsis(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '…'
}

function showNotification(title: string, body: string): void {
  if (!Notification.isSupported()) return
  const notification = new Notification({ title, body, silent: false })
  notification.on('click', focusMainWindow)
  notification.show()
}

export function sendWorkflowCompleted(workflowName: string, iterations: number): void {
  showNotification(
    'Workflow Complete',
    `"${workflowName}" finished after ${iterations} iteration${iterations !== 1 ? 's' : ''}.`,
  )
}

export function sendWorkflowFailed(workflowName: string, errorMessage: string): void {
  showNotification(
    'Workflow Failed',
    `"${workflowName}" encountered an error: ${truncateWithEllipsis(errorMessage, 200)}`,
  )
}
