import { ipcMain } from 'electron'

export function registerWorkflowIpc(): void {
  ipcMain.handle('workflow:start', async (_event, { workflowId }: { workflowId: string }) => {
    return { workflowId }
  })

  ipcMain.handle('workflow:pause', async (_event, { workflowId }: { workflowId: string }) => {
    return { workflowId }
  })

  ipcMain.handle('workflow:stop', async (_event, { workflowId }: { workflowId: string }) => {
    return { workflowId }
  })

  ipcMain.handle('workflow:retry', async (_event, { workflowId }: { workflowId: string }) => {
    return { workflowId }
  })
}
