import { useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import type { PromptData } from '../../lib/converters'
import { showSaveDialog, showOpenDialog, writeFile, readFile } from '../../lib/file-service'

interface WorkflowExport {
  version: number
  name: string
  loopMode: string
  maxIterations?: number
  prompts: Omit<PromptData, 'workflowId' | 'createdAt' | 'updatedAt'>[]
}

interface ImportExportButtonsProps {
  workflowName: string
  loopMode: string
  maxIterations?: number
  prompts: (PromptData & { id: string })[]
  onImport: (data: WorkflowExport) => Promise<void>
}

export function ImportExportButtons({
  workflowName,
  loopMode,
  maxIterations,
  prompts,
  onImport,
}: ImportExportButtonsProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    const data: WorkflowExport = {
      version: 1,
      name: workflowName,
      loopMode,
      maxIterations,
      prompts: prompts.map(
        ({ id: _id, workflowId: _wid, createdAt: _c, updatedAt: _u, ...rest }) => rest,
      ),
    }

    const result = await showSaveDialog({
      title: 'Export Workflow',
      defaultPath: `${workflowName.replace(/[^a-zA-Z0-9]/g, '_')}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })

    if (result.canceled || !result.filePath) return

    const writeResult = await writeFile(result.filePath, JSON.stringify(data, null, 2))

    if (writeResult.success) {
      toast.success('Workflow exported successfully')
    } else {
      toast.error(`Export failed: ${writeResult.error}`)
    }
  }

  async function handleImport() {
    const result = await showOpenDialog({
      title: 'Import Workflow',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile'],
    })

    if (result.canceled || result.filePaths.length === 0) return

    setLoading(true)
    try {
      const readResult = await readFile(result.filePaths[0])
      if (!readResult.success || !readResult.content) {
        toast.error('Failed to read file')
        return
      }

      const data = JSON.parse(readResult.content) as WorkflowExport

      if (!data.version || !data.name || !Array.isArray(data.prompts)) {
        toast.error('Invalid workflow file format')
        return
      }

      const invalidPrompts = data.prompts.filter(
        (p) => !p.title || !p.model || typeof p.position !== 'number',
      )
      if (invalidPrompts.length > 0) {
        const names = invalidPrompts.map((p) => `"${p.title || 'untitled'}"`).join(', ')
        toast.error(`Invalid prompt data in file: ${names}`)
        return
      }

      await onImport(data)
      toast.success(`Imported "${data.name}" with ${data.prompts.length} prompts`)
    } catch (error) {
      toast.error('Import failed: invalid JSON file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
        <Download className="mr-1.5 size-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={handleImport} disabled={loading}>
        <Upload className="mr-1.5 size-4" />
        Import
      </Button>
    </div>
  )
}
