import { Notification, BrowserWindow } from 'electron'

export function sendWorkflowCompleted(workflowName: string, iterations: number): void {
  const notification = new Notification({
    title: 'Workflow Complete',
    body: `"${workflowName}" finished after ${iterations} iteration${iterations !== 1 ? 's' : ''}.`,
    silent: false,
  })

  notification.on('click', () => {
    const wins = BrowserWindow.getAllWindows()
    if (wins.length > 0) {
      wins[0].show()
      wins[0].focus()
    }
  })

  notification.show()
}

export function sendWorkflowFailed(workflowName: string, errorMessage: string): void {
  const notification = new Notification({
    title: 'Workflow Failed',
    body: `"${workflowName}" encountered an error: ${errorMessage.slice(0, 100)}`,
    silent: false,
  })

  notification.on('click', () => {
    const wins = BrowserWindow.getAllWindows()
    if (wins.length > 0) {
      wins[0].show()
      wins[0].focus()
    }
  })

  notification.show()
}
