import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Workflow, Activity, CheckCircle2, XCircle, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { PageHeader } from '../components/shared/PageHeader'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { WorkflowCard } from '../components/workflow/WorkflowCard'
import { useWorkflows, useDeleteWorkflow } from '../hooks/useWorkflows'
import { useExecutions } from '../hooks/useExecutions'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: workflows, isLoading: wfLoading } = useWorkflows()
  const { data: executions = [] } = useExecutions()
  const deleteWorkflow = useDeleteWorkflow()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  type ExecItem = Record<string, unknown>
  const execs = executions as ExecItem[]
  const totalRuns = execs.length
  const successRate =
    totalRuns > 0
      ? Math.round((execs.filter((e) => e.status === 'completed').length / totalRuns) * 100)
      : 0

  const failedToday = execs.filter((e) => {
    const today = new Date().toDateString()
    return (
      e.status === 'failed' &&
      typeof e.createdAt === 'string' &&
      new Date(e.createdAt).toDateString() === today
    )
  }).length

  const activeWorkflows = workflows?.filter((w) => w.status === 'running').length ?? 0

  const stats = [
    {
      label: 'Total Runs',
      value: totalRuns,
      icon: Activity,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: CheckCircle2,
      color:
        successRate > 80 ? 'text-green-500' : successRate > 50 ? 'text-yellow-500' : 'text-red-500',
      bg:
        successRate > 80
          ? 'bg-green-100 dark:bg-green-900/20'
          : successRate > 50
            ? 'bg-yellow-100 dark:bg-yellow-900/20'
            : 'bg-red-100 dark:bg-red-900/20',
    },
    {
      label: 'Active Now',
      value: activeWorkflows,
      icon: Play,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Failed Today',
      value: failedToday,
      icon: XCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ]

  async function handleDelete(id: string) {
    try {
      await deleteWorkflow.mutateAsync(id)
      toast.success('Workflow deleted')
    } catch {
      toast.error('Failed to delete workflow')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          workflows ? `${workflows.length} workflow${workflows.length !== 1 ? 's' : ''}` : undefined
        }
        actions={
          <Button size="sm" onClick={() => navigate('/workflows/new')}>
            <Plus className="mr-1.5 size-4" />
            New Workflow
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex size-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-semibold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wfLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !workflows || workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Workflow className="size-12 text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-medium">No workflows yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first workflow to get started.
            </p>
          </div>
          <Button onClick={() => navigate('/workflows/new')}>
            <Plus className="mr-1.5 size-4" />
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              id={wf.id}
              name={wf.name}
              status={wf.status}
              promptCount={0}
              loopMode={wf.loopMode}
              onStart={() => navigate(`/workflows/${wf.id}/execute`)}
              onStop={() => {
                window.electronAPI.stopWorkflow(wf.id).catch(() => {})
              }}
              onEdit={() => navigate(`/workflows/${wf.id}`)}
              onDelete={() => setDeletingId(wf.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title="Delete Workflow"
        message="Are you sure you want to delete this workflow?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
