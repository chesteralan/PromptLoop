import { describe, it, expect, vi } from 'vitest'
import { ScheduleWorker } from '../scheduler'

describe('ScheduleWorker', () => {
  it('start logs not implemented warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const worker = new ScheduleWorker()
    worker.start()
    expect(warn).toHaveBeenCalledWith('ScheduleWorker.start() is not yet implemented')
    warn.mockRestore()
  })

  it('stop logs not implemented warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const worker = new ScheduleWorker()
    worker.stop()
    expect(warn).toHaveBeenCalledWith('ScheduleWorker.stop() is not yet implemented')
    warn.mockRestore()
  })
})
