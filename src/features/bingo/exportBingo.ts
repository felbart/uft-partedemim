import { toBlob } from 'html-to-image'
import { exportFormats } from './exportFormats'
import type { ExportFormat } from './exportFormats'

export async function createBingoPng(node: HTMLElement, format: ExportFormat = 'stories'): Promise<Blob> {
  await document.fonts.ready
  await Promise.all(Array.from(node.querySelectorAll('img')).map(img => img.decode()))
  const { width, height } = exportFormats[format]
  const blob = await toBlob(node, { width, height, canvasWidth: width, canvasHeight: height, pixelRatio: 1, skipAutoScale: true })
  if (!blob) throw new Error('Não foi possível gerar o PNG.')
  return blob
}

export function downloadBingo(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'uft-bingo-autocuidado-stories.png'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
