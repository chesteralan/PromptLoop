import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImportExportButtons } from '../ImportExportButtons'

const mockShowSaveDialog = vi.hoisted(() => vi.fn())
const mockShowOpenDialog = vi.hoisted(() => vi.fn())
const mockWriteFile = vi.hoisted(() => vi.fn())
const mockReadFile = vi.hoisted(() => vi.fn())
const mockToastSuccess = vi.hoisted(() => vi.fn())
const mockToastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, disabled }: any) => (
    <button data-variant={variant} data-size={size} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))

const mockPrompts = [
  {
    id: 'p1',
    workflowId: 'w1',
    title: 'Prompt 1',
    content: 'Hello',
    model: 'gpt-4',
    position: 0,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

describe('ImportExportButtons', () => {
  const baseProps = {
    workflowName: 'My Workflow',
    loopMode: 'infinite' as const,
    maxIterations: 5,
    prompts: mockPrompts,
    onImport: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI = {
      showSaveDialog: mockShowSaveDialog,
      showOpenDialog: mockShowOpenDialog,
      writeFile: mockWriteFile,
      readFile: mockReadFile,
    } as any
  })

  it('renders Export and Import buttons', () => {
    render(<ImportExportButtons {...baseProps} />)
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Import')).toBeInTheDocument()
  })

  describe('export', () => {
    it('calls showSaveDialog on Export click', async () => {
      mockShowSaveDialog.mockResolvedValue({ canceled: false, filePath: '/path/to/file.json' })
      mockWriteFile.mockResolvedValue({ success: true })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Export'))
      await waitFor(() => {
        expect(mockShowSaveDialog).toHaveBeenCalledWith({
          title: 'Export Workflow',
          defaultPath: 'My_Workflow.json',
          filters: [{ name: 'JSON', extensions: ['json'] }],
        })
      })
    })

    it('writes file when save dialog confirmed', async () => {
      mockShowSaveDialog.mockResolvedValue({ canceled: false, filePath: '/path/to/file.json' })
      mockWriteFile.mockResolvedValue({ success: true })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Export'))
      await waitFor(() => {
        expect(mockWriteFile).toHaveBeenCalledWith('/path/to/file.json', expect.any(String))
      })
    })

    it('shows success toast on successful export', async () => {
      mockShowSaveDialog.mockResolvedValue({ canceled: false, filePath: '/path/to/file.json' })
      mockWriteFile.mockResolvedValue({ success: true })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Export'))
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Workflow exported successfully')
      })
    })

    it('shows error toast on write failure', async () => {
      mockShowSaveDialog.mockResolvedValue({ canceled: false, filePath: '/path/to/file.json' })
      mockWriteFile.mockResolvedValue({ success: false, error: 'Permission denied' })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Export'))
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Export failed: Permission denied')
      })
    })

    it('does not write file when dialog canceled', () => {
      mockShowSaveDialog.mockResolvedValue({ canceled: true })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Export'))
      expect(mockWriteFile).not.toHaveBeenCalled()
    })
  })

  describe('import', () => {
    it('calls showOpenDialog on Import click', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({
        success: true,
        content: JSON.stringify({
          version: 1,
          name: 'Test',
          prompts: [{ title: 'P1', model: 'gpt-4', position: 0 }],
        }),
      })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(mockShowOpenDialog).toHaveBeenCalledWith({
          title: 'Import Workflow',
          filters: [{ name: 'JSON', extensions: ['json'] }],
          properties: ['openFile'],
        })
      })
    })

    it('reads file and calls onImport for valid data', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({
        success: true,
        content: JSON.stringify({
          version: 1,
          name: 'Test',
          prompts: [{ title: 'P1', model: 'gpt-4', position: 0 }],
        }),
      })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(baseProps.onImport).toHaveBeenCalledWith({
          version: 1,
          name: 'Test',
          prompts: [{ title: 'P1', model: 'gpt-4', position: 0 }],
        })
      })
    })

    it('shows success toast on successful import', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({
        success: true,
        content: JSON.stringify({
          version: 1,
          name: 'Test',
          prompts: [{ title: 'P1', model: 'gpt-4', position: 0 }],
        }),
      })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Imported "Test" with 1 prompts')
      })
    })

    it('shows error toast for invalid top-level format', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({ success: true, content: JSON.stringify({ prompts: [] }) })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Invalid workflow file format')
      })
    })

    it('shows error toast for invalid prompt fields', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({
        success: true,
        content: JSON.stringify({
          version: 1,
          name: 'Test',
          prompts: [{ title: '', model: '', position: 'abc' }],
        }),
      })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          expect.stringContaining('Invalid prompt data in file'),
        )
      })
    })

    it('shows error toast for JSON parse failure', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({ success: true, content: 'not valid json' })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Import failed: invalid JSON file')
      })
    })

    it('does nothing when dialog canceled', () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: true })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      expect(baseProps.onImport).not.toHaveBeenCalled()
    })

    it('shows error toast when readFile fails', async () => {
      mockShowOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.json'] })
      mockReadFile.mockResolvedValue({ success: false })
      render(<ImportExportButtons {...baseProps} />)
      fireEvent.click(screen.getByText('Import'))
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Failed to read file')
      })
    })
  })
})
