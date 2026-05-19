export const workflowKeys = {
  all: (userId: string | undefined) => ['workflows', userId] as const,
  detail: (userId: string | undefined, id: string | undefined) =>
    ['workflows', userId, id] as const,
}

export const promptKeys = {
  all: (userId: string | undefined, workflowId: string | undefined) =>
    ['prompts', userId, workflowId] as const,
}

export const executionKeys = {
  all: (userId: string | undefined, workflowId?: string, resultLimit?: number) =>
    ['executions', userId, workflowId, resultLimit] as const,
}
