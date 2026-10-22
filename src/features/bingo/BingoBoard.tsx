import { Check } from 'lucide-react'
import { activities } from './activities'

type Props = { selected: readonly string[]; onToggle?: (id: string) => void; presentation?: 'screen' | 'stories' }
const layouts = {
  screen: {
    grid: 'gap-board-gap',
    cell: 'min-h-40 rounded-lg px-1 py-3 gap-3 sm:rounded-xl sm:px-2',
    symbol: 'w-10 sm:w-14',
    label: 'text-xs leading-snug sm:text-sm',
    art: 'min-h-20',
    check: 'size-4',
  },
  stories: {
    grid: 'gap-6',
    cell: 'h-52 min-h-52 rounded-xl px-3 py-3 gap-2',
    symbol: 'w-12',
    label: 'text-2xl leading-tight',
    art: 'min-h-18',
    check: 'size-5.5',
  },
} as const
const cellClasses = 'bingo-cell relative flex min-w-0 flex-col items-center justify-end border-2 border-azul bg-bege-lt text-azul-dk text-center transition-colors duration-150 data-[selected=true]:bg-verde data-[selected=true]:text-bege data-[selected=true]:border-selected-ink'

export function BingoBoard({ selected, onToggle, presentation = 'screen' }: Props) {
  const layout = layouts[presentation]
  return <div className={`bingo-board grid grid-cols-4 ${layout.grid}`} role={onToggle ? 'group' : undefined} aria-label="16 atividades de autocuidado">
    {activities.map(activity => {
      const marked = selected.includes(activity.id)
      const content = <>
        <span className={`relative w-full flex-1 ${layout.art}`} aria-hidden="true"><img className={`cell-symbol absolute top-1/2 left-1/2 block h-auto -translate-x-1/2 -translate-y-1/2 ${layout.symbol}`} src={`${import.meta.env.BASE_URL}images/${marked ? 'simbolo-brasao.svg' : 'simbolo-brasao-amarelo.svg'}`} width="275" height="299" alt="" /></span>
        <span className={`cell-label font-sans font-semibold wrap-anywhere ${layout.label}`}>{activity.label}</span>
        {marked && <span className="absolute top-1 right-1 flex items-center justify-center rounded-full bg-azul-dk p-1 text-bege shadow-sm" aria-hidden="true"><Check className={layout.check} strokeWidth={3} /></span>}
      </>
      return onToggle
        ? <button type="button" className={`${cellClasses} ${layout.cell} hover:border-current hover:ring-1 hover:ring-current`} data-selected={marked} key={activity.id} aria-pressed={marked} aria-label={activity.label} onClick={() => onToggle(activity.id)}>{content}</button>
        : <div className={`${cellClasses} ${layout.cell}`} data-selected={marked} key={activity.id}>{content}</div>
    })}
  </div>
}
