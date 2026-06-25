import { computed } from 'vue'
import type { ISourceOptions } from '@tsparticles/engine'

const DENSITY_MAP = { high: 400, medium: 220, low: 60 }

interface ParticlesOptions {
  density?: 'high' | 'medium' | 'low'
  interactive?: boolean
  colors?: string[]
}

export function useParticlesConfig(options: ParticlesOptions = {}) {
  const config = computed((): ISourceOptions => {
    const count = DENSITY_MAP[options.density ?? 'medium']
    const interactive = options.interactive ?? true
    const colors = options.colors ?? ['#8052ff', '#ffb829', '#15846e', '#ffffff']
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const particles: ISourceOptions['particles'] = {
      color: { value: colors },
      shape: {
        type: 'star',
        options: {
          star: { sides: 4, innerRadius: 0.35 },
        },
      },
      opacity: { value: { min: 0.15, max: 0.50 } },
      size: { value: { min: 0.9, max: 2.1 } },
      number: {
        value: count,
        density: { enable: true, width: 1920 },
      },
      move: {
        enable: !reducedMotion,
        speed: { min: 0.05, max: 0.2 },
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      links: { enable: false },
    }

    const interactivity: ISourceOptions['interactivity'] = {
      detectsOn: 'window',
      events: {
        onHover: { enable: interactive && !reducedMotion, mode: 'grab' },
        onClick: { enable: false },
      },
      modes: {
        grab: {
          distance: 180,
          links: { opacity: 0.5, color: '#8052ff' },
        },
      },
    }

    return {
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles,
      interactivity,
      detectRetina: true,
    }
  })

  return { config }
}
