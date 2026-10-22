import { useRef, useState } from 'react'
import { Download, RotateCcw, Share2 } from 'lucide-react'
import { BingoBoard } from './BingoBoard'
import { BingoExport } from './BingoExport'
import { ProgedepSignature } from './ProgedepSignature'
import { createBingoPng, downloadBingo } from './exportBingo'
import { useBingoProgress } from './useBingoProgress'

export function BingoPage() {
  const { selected, theme, warning, toggle, reset, setTheme } = useBingoProgress()
  const exportRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const complete = selected.length === 16
  const actionClass = 'flex min-h-12 items-center justify-center gap-2 rounded-lg border border-current px-4.5 py-2.5 text-sm hover:enabled:underline underline-offset-4'
  const radioLabelClass = 'flex min-h-11 cursor-pointer items-center gap-2'
  const radioClass = 'size-4.5 accent-azul-dk'

  function mark(id: string) {
    setMessage('')
    const completing = selected.length === 15 && !selected.includes(id)
    toggle(id)
    if (completing && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void import('canvas-confetti').then(({ default: confetti }) => confetti({ particleCount: 45, spread: 55, startVelocity: 22, ticks: 140, origin: { y: 0.75 }, colors: ['--color-amarelo', '--color-azul', '--color-verde'].map(token => getComputedStyle(document.documentElement).getPropertyValue(token).trim()), disableForReducedMotion: true })).catch(() => { /* A celebração é opcional. */ })
    }
  }

  async function exportImage(share: boolean) {
    if (!exportRef.current || busy) return
    setBusy(true)
    setMessage('Preparando sua imagem…')
    try {
      const blob = await createBingoPng(exportRef.current)
      const file = new File([blob], 'uft-bingo-autocuidado-stories.png', { type: 'image/png' })
      if (share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Bingo do Autocuidado' })
        setMessage('Imagem compartilhada.')
      } else {
        downloadBingo(blob)
        setMessage(share ? 'O compartilhamento de imagem não está disponível. O download do PNG foi iniciado.' : 'Download do PNG iniciado: 1080 × 1920 px.')
      }
    } catch (error) {
      setMessage(error instanceof DOMException && error.name === 'AbortError' ? 'Compartilhamento cancelado.' : 'Não foi possível gerar ou compartilhar a imagem. Tente baixar o PNG novamente.')
    } finally { setBusy(false) }
  }

  return <div className="bingo-page min-h-screen bg-surface px-page-gutter pt-6 pb-10 font-sans text-ink" data-theme={theme}>
    <a className="absolute -top-25 left-3 z-10 bg-bege-lt p-3.5 text-azul-dk focus:top-3" href="#cartela">Ir para a cartela</a>
    <header className="mx-auto flex max-w-page items-start justify-between gap-3 text-xs sm:items-center sm:gap-5 sm:text-sm"><span>UFT · Parte de Mim</span><fieldset className="flex gap-2 rounded-lg border border-current px-2 py-1 sm:gap-4 sm:px-4 sm:py-2" disabled={busy}><legend className="px-1.5 text-xs">Cor da cartela</legend>
      <label className={radioLabelClass}><input className={radioClass} type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} /> Clara</label>
      <label className={radioLabelClass}><input className={radioClass} type="radio" name="theme" value="blue" checked={theme === 'blue'} onChange={() => setTheme('blue')} /> Azul</label>
    </fieldset></header>
    <main className="mx-auto mt-8 max-w-bingo sm:mt-10">
      <div className="text-center"><p className="mb-4 text-xs tracking-widest uppercase">Um convite para cuidar de você</p><h1 className="h1 mb-4.5 text-title">Bingo do Autocuidado</h1><p className="text-base sm:text-xl">Pequenas atitudes fazem grande diferença.</p></div>
      <p className="mx-auto mt-6 mb-8 max-w-xl text-center text-sm leading-relaxed sm:text-base" id="instructions">Marque o que fez, no seu tempo. Toque novamente para desmarcar. A cartela fica completa com as 16 atividades — sem pressa, sem competição.</p>
      <section id="cartela" tabIndex={-1} aria-label="Sua cartela" aria-describedby="instructions" aria-busy={busy}>
        <fieldset className="m-0 min-w-0 border-0 p-0" disabled={busy}><legend className="sr-only">Atividades de autocuidado</legend><BingoBoard selected={selected} onToggle={mark} /></fieldset>
      </section>
      <div className="progress-block mt-6 text-center leading-normal"><p role="status">{complete ? 'Você completou a cartela. Que o cuidado continue!' : `${selected.length} de 16 atividades marcadas. Cada cuidado conta.`}</p><progress className="mt-4 h-2 w-full overflow-hidden rounded-lg border-0 bg-bege-dk accent-verde" value={selected.length} max={16} aria-label="Progresso do bingo" /></div>
      {warning && <p role="alert" className="mt-3 rounded-lg border border-current p-3 leading-normal">{warning}</p>}
      <div className="actions mt-7 flex flex-wrap justify-center gap-3"><button className={`primary ${actionClass} basis-full border-ink bg-ink font-semibold text-surface sm:basis-auto`} disabled={busy} onClick={() => void exportImage(false)}><Download size={18} aria-hidden="true" />{busy ? 'Preparando…' : 'Baixar para Stories'}</button><button className={actionClass} disabled={busy} onClick={() => void exportImage(true)}><Share2 size={18} aria-hidden="true" />Compartilhar</button><button className={actionClass} disabled={busy || selected.length === 0} onClick={() => { if (window.confirm('Reiniciar o bingo? Todas as marcações serão apagadas neste navegador.')) { reset(); setMessage('Cartela reiniciada.') } }}><RotateCcw size={18} aria-hidden="true" />Reiniciar</button></div>
      <p className="mt-4 text-center text-xs">PNG · 1080 × 1920 px · seu progresso fica neste navegador</p>
      <p className="min-h-6 text-center text-sm leading-normal" role="status">{message}</p>
      <footer className="mx-auto mt-8 text-center"><div className="mx-auto mt-8 max-w-lg"><ProgedepSignature theme={theme} /></div><p className="mt-5.5 text-xs">Universidade Federal do Tocantins</p></footer>
      <details className="mx-auto mt-7 max-w-xl border-t border-current pt-3.5 text-xs leading-relaxed"><summary className="min-h-11">Prévia: identidade visual em integração</summary><p>Idiqlat e Rawline já usam os arquivos locais da campanha. O brasão oficial já está integrado. A assinatura Progedep já está integrada. A textura ainda aguarda entrega do designer.</p></details>
    </main>
    <BingoExport ref={exportRef} selected={selected} theme={theme} />
  </div>
}
