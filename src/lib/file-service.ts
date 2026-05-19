export async function showSaveDialog(options: {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
}) {
  return window.electronAPI.showSaveDialog(options)
}

export async function showOpenDialog(options: {
  title?: string
  filters?: Array<{ name: string; extensions: string[] }>
  properties?: string[]
}) {
  return window.electronAPI.showOpenDialog(options)
}

export async function writeFile(path: string, content: string) {
  return window.electronAPI.writeFile(path, content)
}

export async function readFile(path: string) {
  return window.electronAPI.readFile(path)
}
