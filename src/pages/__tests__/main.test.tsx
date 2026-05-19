import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreateRoot, mockRender, mockInjectElectronMock, mockInitSentry } = vi.hoisted(() => {
  const render = vi.fn()
  return {
    mockCreateRoot: vi.fn(() => ({ render })),
    mockRender: render,
    mockInjectElectronMock: vi.fn(),
    mockInitSentry: vi.fn(),
  }
})

const mockQueryClient = { _mock: true }

vi.mock('react-dom/client', () => ({
  default: { createRoot: mockCreateRoot },
  createRoot: mockCreateRoot,
}))

vi.mock('@/lib/electron-mock', () => ({ injectElectronMock: mockInjectElectronMock }))
vi.mock('@/lib/sentry', () => ({ initRendererSentry: mockInitSentry }))
vi.mock('@/lib/firebase', () => ({ auth: {}, db: {} }))
vi.mock('@/lib/query-client', () => ({
  createQueryClient: () => mockQueryClient,
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn() }, Toaster: () => null }))

vi.mock('react-router-dom', () => ({
  createHashRouter: () => ({}),
  RouterProvider: () => null,
  Navigate: () => null,
  Outlet: () => null,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/', search: '' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}))

describe('main.tsx', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('evaluates module with all startup side effects', async () => {
    document.body.innerHTML = '<div id="root"></div>'
    await import('../../main')
    expect(mockInjectElectronMock).toHaveBeenCalled()
    expect(mockInitSentry).toHaveBeenCalled()
    const rootEl = document.getElementById('root')
    expect(mockCreateRoot).toHaveBeenCalledWith(rootEl)
    expect(mockRender).toHaveBeenCalled()
  })

  it('electron mock failure is caught silently', async () => {
    mockInjectElectronMock.mockImplementation(() => {
      throw new Error('mock inject failed')
    })
    document.body.innerHTML = '<div id="root"></div>'
    await expect(import('../../main')).resolves.toBeDefined()
  })
})
