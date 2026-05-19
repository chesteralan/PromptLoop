import { describe, it } from 'vitest'

describe('ElectronAPI type definition', () => {
  it('module loads without error', async () => {
    await import('../ipc')
  })
})
