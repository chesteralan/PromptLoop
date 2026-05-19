import { describe, it, expect } from 'vitest'
import { useExecutionStore, useWorkflowStore, useSettingsStore } from '../index'

describe('store index', () => {
  it('exports useExecutionStore', () => {
    expect(useExecutionStore).toBeDefined()
    expect(typeof useExecutionStore.getState).toBe('function')
  })

  it('exports useWorkflowStore', () => {
    expect(useWorkflowStore).toBeDefined()
    expect(typeof useWorkflowStore.getState).toBe('function')
  })

  it('exports useSettingsStore', () => {
    expect(useSettingsStore).toBeDefined()
    expect(typeof useSettingsStore.getState).toBe('function')
  })
})
