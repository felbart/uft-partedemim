// Adicionar feed (1080 × 1350) aqui junto de uma composição CSS própria.
export const exportFormats = { stories: { width: 1080, height: 1920, safeTop: 250, safeBottom: 250 } } as const
export type ExportFormat = keyof typeof exportFormats
