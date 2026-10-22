import { useState } from 'react'
import { activities } from './activities'
import { initialProgress, parseProgress, serializeProgress, STORAGE_KEY, toggleActivity } from './progress'
import type { Progress, Theme } from './progress'

function load() {
  try {
    return { progress: parseProgress(localStorage.getItem(STORAGE_KEY), activities.map(a => a.id)), warning: '' }
  } catch {
    return { progress: initialProgress, warning: 'Não foi possível recuperar seu progresso. Você pode continuar nesta página.' }
  }
}

export function useBingoProgress() {
  const [state, setState] = useState(load)
  function commit(progress: Progress) {
    let warning = ''
    try { localStorage.setItem(STORAGE_KEY, serializeProgress(progress)) }
    catch { warning = 'O navegador não permitiu salvar. Seu progresso será mantido apenas enquanto esta página estiver aberta.' }
    setState({ progress, warning })
  }
  return {
    ...state.progress, warning: state.warning,
    toggle: (id: string) => commit({ ...state.progress, selected: toggleActivity(state.progress.selected, id) }),
    setTheme: (theme: Theme) => commit({ ...state.progress, theme }),
    reset: () => commit({ ...state.progress, selected: [] }),
  }
}
