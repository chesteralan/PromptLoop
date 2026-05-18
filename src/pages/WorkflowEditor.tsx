import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FilePlus, Trash2, Workflow } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { PageHeader } from '../components/shared/PageHeader'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { EmptyState } from '../components/shared/EmptyState'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { WorkflowSettings } from '../components/workflow/WorkflowSettings'
import { PromptList } from '../components/workflow/PromptList'
import { PromptEditorPanel } from '../components/workflow/PromptEditorPanel'
import { AddPromptButton } from '../components/workflow/AddPromptButton'
import { SaveButton } from '../components/workflow/SaveButton'
import { ImportExportButtons } from '../components/workflow/ImportExportButtons'
import { useAutoSave } from '../hooks/useAutoSave'
import {
  useWorkflow,
  useCreateWorkflow,
  useUpdateWorkflow,
  useDeleteWorkflow,
} from '../hooks/useWorkflows'
import {
  usePrompts,
  useCreatePrompt,
  useUpdatePrompt,
  useDeletePrompt,
  useReorderPrompts,
} from '../hooks/usePrompts'
import type { LoopMode } from '../../electron/shared/types'
import type { PromptData } from '../lib/converters'

export function WorkflowEditorPage() {
  const { workflowId } = useParams<{ workflowId: string }>()
  const navigate = useNavigate()
  const isNew = workflowId === 'new'

  const { data: workflow, isLoading: workflowLoading } = useWorkflow(isNew ? undefined : workflowId)
  const { data: promptsData = [], isLoading: promptsLoading } = usePrompts(
    isNew ? undefined : workflowId,
  )
  const createWorkflow = useCreateWorkflow()
  const updateWorkflow = useUpdateWorkflow()
  const deleteWorkflow = useDeleteWorkflow()
  const createPrompt = useCreatePrompt(workflowId)
  const updatePrompt = useUpdatePrompt(workflowId)
  const deletePrompt = useDeletePrompt(workflowId)
  const reorderPrompts = useReorderPrompts(workflowId)

  const [name, setName] = useState('')
  const [loopMode, setLoopMode] = useState<LoopMode>('single')
  const [maxIterations, setMaxIterations] = useState<number | undefined>(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [localPrompts, setLocalPrompts] = useState<(PromptData & { id: string })[]>([])
  const isDirtyRef = useRef(false)

  useEffect(() => {
    if (workflow) {
      setName(workflow.name)
      setLoopMode(workflow.loopMode ?? 'single')
      setMaxIterations(workflow.maxIterations ?? 1)
    }
  }, [workflow])

  useEffect(() => {
    setLocalPrompts(promptsData)
  }, [promptsData])

  useEffect(() => {
    isDirtyRef.current = true
  }, [name, loopMode, maxIterations, localPrompts])

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirtyRef.current) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const workflowData = { name, loopMode, maxIterations }
  useAutoSave({
    data: workflowData,
    isNew,
    delay: 3000,
    save: async (d) => {
      if (!workflowId) return
      await updateWorkflow.mutateAsync({
        workflowId,
        data: {
          name: d.name.trim(),
          loopMode: d.loopMode,
          maxIterations: d.loopMode === 'fixed' ? d.maxIterations : undefined,
        },
      })
    },
  })

  async function handleSave() {
    if (!name.trim()) return
    setIsSaving(true)
    try {
      if (isNew) {
        const id = await createWorkflow.mutateAsync({
          name: name.trim(),
          status: 'idle',
          loopMode,
          maxIterations: loopMode === 'fixed' ? maxIterations : undefined,
        })
        navigate(`/workflows/${id}`, { replace: true })
      } else if (workflowId) {
        await updateWorkflow.mutateAsync({
          workflowId,
          data: {
            name: name.trim(),
            loopMode,
            maxIterations: loopMode === 'fixed' ? maxIterations : undefined,
          },
        })
      }
      isDirtyRef.current = false
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!workflowId || isNew) return
    await deleteWorkflow.mutateAsync(workflowId)
    navigate('/dashboard', { replace: true })
  }

  const handleCreatePrompt = useCallback(async () => {
    if (!workflowId || isNew) return
    const newId = await createPrompt.mutateAsync({
      workflowId,
      title: 'New Prompt',
      content: '',
      model: 'gpt-4o',
      position: localPrompts.length,
      enabled: true,
      temperature: 1.0,
      maxTokens: 1024,
    })
    setSelectedPromptId(newId)
    setEditorOpen(true)
  }, [workflowId, isNew, createPrompt, localPrompts.length])

  const handlePromptChange = useCallback(
    (id: string, data: Partial<Omit<PromptData, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setLocalPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    },
    [],
  )

  const handleImport = useCallback(
    async (importData: {
      name: string
      loopMode: string
      maxIterations?: number
      prompts: {
        title: string
        content?: string
        systemPrompt?: string
        model?: string
        enabled?: boolean
        temperature?: number
        maxTokens?: number
        delayMs?: number
        position: number
      }[]
    }) => {
      if (!workflowId) return
      const newName = importData.name === name ? `${importData.name} (imported)` : importData.name
      const newId = await createWorkflow.mutateAsync({
        name: newName,
        status: 'idle',
        loopMode: importData.loopMode as LoopMode,
        maxIterations: importData.maxIterations,
      })
      for (let i = 0; i < importData.prompts.length; i++) {
        const p = importData.prompts[i]
        await createPrompt.mutateAsync({
          workflowId: newId,
          title: p.title || 'Untitled',
          content: p.content || '',
          systemPrompt: p.systemPrompt,
          model: p.model || 'gpt-4o',
          position: i,
          enabled: p.enabled !== false,
          temperature: p.temperature ?? 1.0,
          maxTokens: p.maxTokens ?? 1024,
          delayMs: p.delayMs,
        })
      }
      navigate(`/workflows/${newId}`, { replace: true })
    },
    [workflowId, name, createWorkflow, createPrompt, navigate],
  )

  const selectedPrompt = localPrompts.find((p) => p.id === selectedPromptId) ?? null

  if (!isNew && workflowLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!isNew && !workflowLoading && !workflow) {
    return (
      <EmptyState
        icon={Workflow}
        title="Workflow not found"
        description="The workflow you're looking for doesn't exist or has been deleted."
        actionLabel="Back to Dashboard"
        onAction={() => navigate('/dashboard')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? 'Create Workflow' : (workflow?.name ?? 'Edit Workflow')}
        description={
          isNew
            ? 'Set up a new workflow'
            : `${localPrompts.length} prompt${localPrompts.length !== 1 ? 's' : ''}`
        }
        onBack={() => navigate('/dashboard')}
        actions={
          <div className="flex items-center gap-2">
            {!isNew && (
              <>
                <ImportExportButtons
                  workflowName={name}
                  loopMode={loopMode}
                  maxIterations={maxIterations}
                  prompts={localPrompts}
                  onImport={handleImport}
                />
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="mr-1.5 size-4" />
                  Delete
                </Button>
              </>
            )}
            <SaveButton
              isNew={isNew}
              isSaving={isSaving}
              disabled={!name.trim()}
              onClick={handleSave}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className="text-sm font-medium">Workflow Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Workflow"
              className="mt-1.5"
            />
          </div>

          <Separator />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Prompts</h2>
                <Badge variant="secondary">{localPrompts.length}</Badge>
              </div>
              <AddPromptButton
                onClick={handleCreatePrompt}
                disabled={isNew || createPrompt.isPending}
              />
            </div>

            {promptsLoading ? (
              <div className="space-y-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : localPrompts.length === 0 ? (
              <EmptyState
                icon={FilePlus}
                title="No prompts yet"
                description="Add your first prompt to start building this workflow."
                actionLabel="Add Prompt"
                onAction={handleCreatePrompt}
              />
            ) : (
              <PromptList
                prompts={localPrompts}
                selectedId={selectedPromptId}
                onSelect={(id) => {
                  setSelectedPromptId(id)
                  setEditorOpen(true)
                }}
                onToggle={(id, enabled) => {
                  setLocalPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)))
                  updatePrompt.mutate({ promptId: id, data: { enabled } })
                }}
                onDelete={(id) => {
                  deletePrompt.mutate(id)
                }}
                onReorder={(orderedIds) => {
                  setLocalPrompts((prev) => {
                    const reordered = orderedIds
                      .map((id) => prev.find((p) => p.id === id))
                      .filter(Boolean) as (PromptData & { id: string })[]
                    return reordered.map((p, i) => ({ ...p, position: i }))
                  })
                  reorderPrompts.mutate(orderedIds)
                }}
              />
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-sm font-semibold">Settings</h3>
            <WorkflowSettings
              loopMode={loopMode}
              maxIterations={maxIterations}
              onLoopModeChange={setLoopMode}
              onMaxIterationsChange={setMaxIterations}
            />
          </div>
        </div>
      </div>

      <PromptEditorPanel
        prompt={selectedPrompt}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onChange={handlePromptChange}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Workflow"
        message="Are you sure you want to delete this workflow? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}
