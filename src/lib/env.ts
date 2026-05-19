export const isElectron = typeof window !== 'undefined' && 'electronAPI' in window

export const isBrowser = typeof window !== 'undefined'
