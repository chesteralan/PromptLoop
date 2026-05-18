import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetVersion = vi.fn()

vi.mock('electron', () => ({
  app: {
    getVersion: mockGetVersion,
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockGetVersion.mockReturnValue('1.0.0')
})

describe('setupAutoUpdater', () => {
  it('logs the current app version', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { setupAutoUpdater } = await import('../updater')
    setupAutoUpdater()
    expect(mockGetVersion).toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('App version: 1.0.0')
    log.mockRestore()
  })
})
