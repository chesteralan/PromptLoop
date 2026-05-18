import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Workflow, Activity, CheckCircle2, XCircle, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { PageHeader } from '../components/shared/PageHeader'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { WorkflowCard } from '../components/workflow/WorkflowCard'
import { EmptyState } from '../components/shared/EmptyState'
import { useWorkflows, useDeleteWorkflow } from '../hooks/useWorkflows'
import { useExecutions } from '../hooks/useExecutions'

function statColor(value: number): { color: string; bg: string } {
  if (value > 80) return { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' }
  if (value > 50) return { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' }
  return { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' }
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: workflows, isLoading: wfLoading } = useWorkflows()
  const { data: executions = [] } = useExecutions()
  const deleteWorkflow = useDeleteWorkflow()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalRuns = executions.length
    const successRate =
      totalRuns > 0
        ? Math.round((executions.filter((e) => e.status === 'completed').length / totalRuns) * 100)
        : 0

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const failedToday = executions.filter(
      (e) => e.status === 'failed' && e.createdAt >= todayStart,
    ).length

    const activeWorkflows = workflows?.filter((w) => w.status === 'running').length ?? 0
    const sc = statColor(successRate)

    return [
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
        ...sc,
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
  }, [executions, workflows])

  async function handleDelete(id: string) {
    try {
      await deleteWorkflow.mutateAsync(id)
      toast.success('Workflow deleted')
    } catch {
      toast.error('Failed to delete workflow')
    }
    setDeletingId(null)
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
        <EmptyState
          icon={Workflow}
          title="No workflows yet"
          description="Create your first workflow to get started."
          actionLabel="Create Workflow"
          onAction={() => navigate('/workflows/new')}
        />
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
