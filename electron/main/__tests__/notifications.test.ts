import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockShow = vi.fn()
const mockOn = vi.fn()
const mockNotification = vi.fn()
let mockIsSupported = true

vi.mock('electron', () => ({
  Notification: Object.assign(
    function (...args: unknown[]) {
      mockNotification(...args)
      return { on: mockOn, show: mockShow }
    },
    { isSupported: () => mockIsSupported },
  ),
  BrowserWindow: {
    getAllWindows: () => [{ show: vi.fn(), focus: vi.fn() }],
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockIsSupported = true
})

describe('sendWorkflowCompleted', () => {
  it('creates notification with correct title and body', async () => {
    const { sendWorkflowCompleted } = await import('../notifications')
    sendWorkflowCompleted('My Workflow', 3)
    expect(mockNotification).toHaveBeenCalledWith({
      title: 'Workflow Complete',
      body: '"My Workflow" finished after 3 iterations.',
      silent: false,
    })
    expect(mockShow).toHaveBeenCalled()
  })

  it('uses singular "iteration" when count is 1', async () => {
    const { sendWorkflowCompleted } = await import('../notifications')
    sendWorkflowCompleted('Test', 1)
    expect(mockNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('1 iteration.'),
      }),
    )
  })

  it('registers click handler', async () => {
    const { sendWorkflowCompleted } = await import('../notifications')
    sendWorkflowCompleted('Test', 1)
    expect(mockOn).toHaveBeenCalledWith('click', expect.any(Function))
  })
})

describe('sendWorkflowFailed', () => {
  it('creates notification with truncated error', async () => {
    const { sendWorkflowFailed } = await import('../notifications')
    const longError = 'x'.repeat(300)
    sendWorkflowFailed('My Workflow', longError)
    expect(mockNotification).toHaveBeenCalledWith({
      title: 'Workflow Failed',
      body: expect.stringContaining('…'),
      silent: false,
    })
    expect(mockShow).toHaveBeenCalled()
  })
})

describe('notification support', () => {
  it('does not show when notifications are not supported', async () => {
    mockIsSupported = false
    const { sendWorkflowCompleted } = await import('../notifications')
    sendWorkflowCompleted('Test', 1)
    expect(mockShow).not.toHaveBeenCalled()
  })
})
