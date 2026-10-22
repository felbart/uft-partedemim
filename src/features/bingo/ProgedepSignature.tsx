import type { Theme } from './progress'

export function ProgedepSignature({ theme }: { theme: Theme }) {
  const file = theme === 'blue' ? 'assinatura-progedep-bege.svg' : 'assinatura-progedep-azul.svg'
  return <img className="mx-auto block h-auto max-w-full" src={`${import.meta.env.BASE_URL}images/${file}`} width="627" height="60" alt="UFT Parte de Mim. Cuidar de mim é cuidar de nós. Pró-Reitoria de Gestão e Desenvolvimento de Pessoas — Progedep" />
}
