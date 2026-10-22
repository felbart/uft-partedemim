import type { Ref } from 'react'
import { BingoBoard } from './BingoBoard'
import { ProgedepSignature } from './ProgedepSignature'
import type { Theme } from './progress'

// Dimensões físicas vêm dos tokens story-*; o teste confere sua correspondência com exportFormats.
export function BingoExport({ selected, theme, ref }: { selected: readonly string[]; theme: Theme; ref: Ref<HTMLDivElement> }) {
  return <div className="export-host pointer-events-none fixed top-0 -left-3000 w-story-width" aria-hidden="true" inert>
    <div ref={ref} className="bingo-export flex h-story-height w-story-width flex-col items-stretch bg-surface px-16 py-story-safe font-sans text-ink" data-theme={theme} data-format="stories">
      <header className="mb-5.5 text-center"><h2 className="h2 mb-5 text-story-heading leading-tight text-title">Bingo do Autocuidado</h2><p className="text-3xl">Pequenas atitudes fazem grande diferença.</p></header>
      <BingoBoard selected={selected} presentation="stories" />
      <p className="my-6 text-center text-2xl">{selected.length} de 16 atitudes de autocuidado</p>
      
      <div className="mt-6"><ProgedepSignature theme={theme} /></div>
    </div>
  </div>
}
