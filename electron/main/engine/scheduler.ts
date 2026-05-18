// TODO: Implement scheduled workflow execution
// Planned behavior:
// - Accept cron expressions or ISO 8601 intervals
// - Use node-cron or a similar library for scheduling
// - Integrate with WorkflowRunner to trigger executions on schedule
// - Persist schedules to disk so they survive app restarts
export class ScheduleWorker {
  start(): void {
    console.warn('ScheduleWorker.start() is not yet implemented')
  }
  stop(): void {
    console.warn('ScheduleWorker.stop() is not yet implemented')
  }
}
