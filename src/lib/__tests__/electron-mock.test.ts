import { describe, it, expect, vi, beforeEach } from 'vitest'
import { injectElectronMock } from '../electron-mock'

beforeEach(() => {
  delete (window as Record<string, unknown>).electronAPI
})

describe('injectElectronMock', () => {
  it('creates window.electronAPI with all methods', () => {
    injectElectronMock()
    expect(window.electronAPI).toBeDefined()
    expect(typeof window.electronAPI.startWorkflow).toBe('function')
    expect(typeof window.electronAPI.pauseWorkflow).toBe('function')
    expect(typeof window.electronAPI.stopWorkflow).toBe('function')
    expect(typeof window.electronAPI.retryWorkflow).toBe('function')
    expect(typeof window.electronAPI.encryptApiKey).toBe('function')
    expect(typeof window.electronAPI.decryptApiKey).toBe('function')
    expect(typeof window.electronAPI.deleteApiKey).toBe('function')
    expect(typeof window.electronAPI.listApiKeys).toBe('function')
    expect(typeof window.electronAPI.onExecutionChunk).toBe('function')
    expect(typeof window.electronAPI.onExecutionCompleted).toBe('function')
    expect(typeof window.electronAPI.onExecutionFailed).toBe('function')
    expect(typeof window.electronAPI.onWorkflowCompleted).toBe('function')
    expect(typeof window.electronAPI.minimizeToTray).toBe('function')
    expect(typeof window.electronAPI.getAppVersion).toBe('function')
    expect(typeof window.electronAPI.showSaveDialog).toBe('function')
    expect(typeof window.electronAPI.showOpenDialog).toBe('function')
    expect(typeof window.electronAPI.writeFile).toBe('function')
    expect(typeof window.electronAPI.readFile).toBe('function')
  })

  it('workflow methods return success defaults', async () => {
    injectElectronMock()
    await expect(window.electronAPI.startWorkflow('w1')).resolves.toEqual({
      success: true,
      workflowId: '',
    })
    await expect(window.electronAPI.pauseWorkflow('w1')).resolves.toEqual({
      success: true,
      workflowId: '',
    })
    await expect(window.electronAPI.stopWorkflow('w1')).resolves.toEqual({
      success: true,
      workflowId: '',
    })
    await expect(window.electronAPI.retryWorkflow('w1')).resolves.toEqual({
      success: true,
      workflowId: '',
    })
  })

  it('API key methods return mock data', async () => {
    injectElectronMock()
    await expect(window.electronAPI.encryptApiKey('openai', 'key')).resolves.toEqual({
      id: 'mock-id',
      keyPrefix: 'sk-****',
    })
    await expect(window.electronAPI.decryptApiKey('id')).resolves.toEqual({ key: 'mock-key' })
    await expect(window.electronAPI.deleteApiKey('id')).resolves.toEqual({ success: true })
    await expect(window.electronAPI.listApiKeys()).resolves.toEqual([])
  })

  it('getAppVersion returns 0.0.0', async () => {
    injectElectronMock()
    await expect(window.electronAPI.getAppVersion()).resolves.toBe('0.0.0')
  })

  it('file operations return empty defaults', async () => {
    injectElectronMock()
    await expect(window.electronAPI.showSaveDialog({})).resolves.toEqual({
      canceled: true,
      filePath: null,
    })
    await expect(window.electronAPI.showOpenDialog({})).resolves.toEqual({
      canceled: true,
      filePaths: [],
    })
    await expect(window.electronAPI.writeFile('path', 'content')).resolves.toEqual({
      success: true,
    })
    await expect(window.electronAPI.readFile('path')).resolves.toEqual({
      success: true,
      content: '',
    })
  })

  it('is no-op when window.electronAPI already exists', () => {
    const existing = { test: true }
    ;(window as Record<string, unknown>).electronAPI = existing as never
    injectElectronMock()
    expect(window.electronAPI).toBe(existing)
  })

  it('on methods return cleanup functions', () => {
    injectElectronMock()
    const cleanup = window.electronAPI.onExecutionChunk(vi.fn())
    expect(typeof cleanup).toBe('function')
    cleanup()
  })

  it('multiple listeners registered via on methods', () => {
    injectElectronMock()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const cleanup1 = window.electronAPI.onExecutionChunk(fn1)
    const cleanup2 = window.electronAPI.onExecutionChunk(fn2)

    cleanup1()
    cleanup2()
  })

  it('minimizeToTray does not throw', () => {
    injectElectronMock()
    expect(() => window.electronAPI.minimizeToTray()).not.toThrow()
  })
})
