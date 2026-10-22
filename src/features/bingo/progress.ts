export const STORAGE_KEY = 'uft-parte-de-mim:bingo:v1'
export type Theme = 'light' | 'blue'
export type Progress = { selected: string[]; theme: Theme }
export const initialProgress: Progress = { selected: [], theme: 'light' }

export function parseProgress(raw: string | null, validIds: readonly string[]): Progress {
  if (!raw) return initialProgress
  const data: unknown = JSON.parse(raw)
  if (typeof data !== 'object' || data === null) throw new Error('Dados inválidos')
  const value = data as Record<string, unknown>
  if (value.version !== 1 || !Array.isArray(value.selected)) throw new Error('Versão inválida')
  return {
    selected: [...new Set(value.selected.filter((id): id is string => typeof id === 'string' && validIds.includes(id)))],
    theme: value.theme === 'blue' ? 'blue' : 'light',
  }
}

export function toggleActivity(selected: readonly string[], id: string): string[] {
  return selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id]
}

export function serializeProgress(progress: Progress): string {
  return JSON.stringify({ version: 1, ...progress })
}
