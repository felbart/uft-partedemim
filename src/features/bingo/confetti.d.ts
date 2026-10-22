declare module 'canvas-confetti' {
  type Options = { particleCount?: number; spread?: number; startVelocity?: number; ticks?: number; origin?: { x?: number; y?: number }; colors?: string[]; disableForReducedMotion?: boolean }
  export default function confetti(options?: Options): Promise<null> | null
}
