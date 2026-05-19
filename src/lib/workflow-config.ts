export type LoopMode = 'infinite' | 'fixed' | 'single' | 'scheduled'

export const LOOP_MODES = ['infinite', 'fixed', 'single', 'scheduled'] as const

export const LOOP_MODE_LABELS: Record<LoopMode, { label: string; description: string }> = {
  infinite: { label: 'Infinite', description: 'Continuously loop until manually stopped' },
  fixed: { label: 'Fixed', description: 'Loop a specific number of times' },
  single: { label: 'Single Pass', description: 'Execute prompts once' },
  scheduled: { label: 'Scheduled', description: 'Run on a schedule (coming soon)' },
}

export const DEFAULT_MAX_ITERATIONS = 1
export const MAX_ITERATIONS_BOUND = 9999

export function isValidLoopMode(v: string): v is LoopMode {
  return (LOOP_MODES as readonly string[]).includes(v)
}
