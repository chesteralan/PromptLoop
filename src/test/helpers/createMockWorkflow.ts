import type { WorkflowStatus } from '@/lib/status-config'
import type { LoopMode } from '@/lib/workflow-config'

interface MockWorkflow {
  id: string
  name: string
  status: WorkflowStatus
  loopMode?: LoopMode
  maxIterations?: number
  createdAt: string
  updatedAt: string
}

export function createMockWorkflow(overrides?: Partial<MockWorkflow>): MockWorkflow {
  return {
    id: '1',
    name: 'Test Workflow',
    status: 'idle',
    loopMode: 'single',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}
