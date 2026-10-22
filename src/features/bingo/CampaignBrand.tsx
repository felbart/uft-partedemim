import type { Theme } from './progress'

export function CampaignBrand({ theme, presentation = 'screen' }: { theme: Theme; presentation?: 'screen' | 'stories' }) {
  const file = theme === 'blue' ? 'parte-de-mim-logo-horizontal-bege.svg' : 'parte-de-mim-logo-horizontal.svg'
  return <div className="campaign-brand text-center">
    <img className={`mx-auto block h-auto max-w-full ${presentation === 'stories' ? 'w-123.5' : 'w-82.5'}`} src={`${import.meta.env.BASE_URL}images/${file}`} width="494" height="124" alt="UFT, Parte de Mim!" />
    <p className={`font-heading ${presentation === 'stories' ? 'mt-3 text-3xl' : 'mt-2 text-xl'}`}>Cuidar de mim é cuidar de nós</p>
  </div>
}
