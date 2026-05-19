import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ApiKeysPage } from '../ApiKeys'

const { mockListApiKeys, mockEncryptApiKey, mockDeleteApiKey, mockToast } = vi.hoisted(() => ({
  mockListApiKeys: vi.fn(),
  mockEncryptApiKey: vi.fn(),
  mockDeleteApiKey: vi.fn(),
  mockToast: { error: vi.fn(), success: vi.fn() },
}))

vi.mock('sonner', () => ({ toast: mockToast }))

vi.mock('../../components/shared/SkeletonCard', () => ({
  SkeletonCard: () => <div data-testid="skeleton-card" />,
}))

vi.mock('../../components/settings/AddApiKeyDialog', () => ({
  AddApiKeyDialog: vi.fn(
    ({ open, onSave }: { open: boolean; onSave: (p: string, k: string) => void }) =>
      open ? <button onClick={() => onSave('openai', 'sk-test-123')}>Save Key</button> : null,
  ),
}))

vi.mock('../../components/settings/ApiKeyCard', () => ({
  ApiKeyCard: vi.fn(
    ({
      id,
      provider,
      keyPrefix,
      onDelete,
    }: {
      id: string
      provider: string
      keyPrefix: string
      onDelete: (id: string) => void
    }) => (
      <div data-testid="api-key-card">
        <span>{provider}</span>
        <span>{keyPrefix}</span>
        <button onClick={() => onDelete(id)}>Delete</button>
      </div>
    ),
  ),
}))

function mockElectronAPI() {
  ;(window as any).electronAPI = {
    listApiKeys: mockListApiKeys,
    encryptApiKey: mockEncryptApiKey,
    deleteApiKey: mockDeleteApiKey,
  }
}

const sampleKeys = [
  { id: '1', provider: 'openai', keyPrefix: 'sk-...', createdAt: '2024-01-15' },
  { id: '2', provider: 'anthropic', keyPrefix: 'sk-ant-...', createdAt: '2024-02-20' },
]

beforeEach(() => {
  vi.clearAllMocks()
  mockElectronAPI()
})

describe('ApiKeysPage', () => {
  it('loads keys on mount', async () => {
    mockListApiKeys.mockResolvedValue([])
    render(<ApiKeysPage />)
    await vi.waitFor(() => expect(mockListApiKeys).toHaveBeenCalledOnce())
  })

  it('shows skeleton cards while loading', () => {
    mockListApiKeys.mockReturnValue(new Promise(() => {}))
    render(<ApiKeysPage />)
    const skeletons = document.querySelectorAll('[data-testid="skeleton-card"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no keys', async () => {
    mockListApiKeys.mockResolvedValue([])
    render(<ApiKeysPage />)
    await vi.waitFor(() => {
      expect(screen.getByText('No API keys configured')).toBeInTheDocument()
    })
    expect(screen.getByText('Add API Key')).toBeInTheDocument()
  })

  it('renders ApiKeyCard for each key', async () => {
    mockListApiKeys.mockResolvedValue(sampleKeys)
    render(<ApiKeysPage />)
    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('api-key-card')
      expect(cards).toHaveLength(2)
    })
  })

  it('opens add dialog when clicking Add Key', async () => {
    mockListApiKeys.mockResolvedValue([])
    render(<ApiKeysPage />)
    await vi.waitFor(() => {
      fireEvent.click(screen.getByText('Add Key'))
    })
    expect(screen.getByText('Save Key')).toBeInTheDocument()
  })

  it('calls encryptApiKey and reloads on save', async () => {
    mockListApiKeys.mockResolvedValue([])
    mockEncryptApiKey.mockResolvedValue(undefined)
    render(<ApiKeysPage />)
    await vi.waitFor(() => {
      fireEvent.click(screen.getByText('Add Key'))
    })
    fireEvent.click(screen.getByText('Save Key'))
    expect(mockEncryptApiKey).toHaveBeenCalledWith('openai', 'sk-test-123')
    await vi.waitFor(() => expect(mockListApiKeys).toHaveBeenCalledTimes(2))
  })

  it('calls deleteApiKey and removes from local state', async () => {
    mockListApiKeys.mockResolvedValue(sampleKeys)
    mockDeleteApiKey.mockResolvedValue(undefined)
    render(<ApiKeysPage />)
    await vi.waitFor(() => {
      expect(screen.getAllByTestId('api-key-card')).toHaveLength(2)
    })
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    expect(mockDeleteApiKey).toHaveBeenCalledWith('1')
    await vi.waitFor(() => {
      const cards = screen.queryAllByTestId('api-key-card')
      expect(cards).toHaveLength(1)
    })
  })

  it('shows error toast when loading keys fails', async () => {
    mockListApiKeys.mockRejectedValue(new Error('network error'))
    render(<ApiKeysPage />)
    await vi.waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to load API keys')
    })
  })
})
