import { describe, it, expect, vi } from 'vitest'
import { useParticlesConfig } from '@/composables/useParticlesConfig'

vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))

describe('useParticlesConfig', () => {
  it('high density has more particles than low', () => {
    const { config: high } = useParticlesConfig({ density: 'high' })
    const { config: low } = useParticlesConfig({ density: 'low' })
    const highN = (high.value.particles as any).number.value
    const lowN = (low.value.particles as any).number.value
    expect(highN).toBeGreaterThan(lowN)
  })

  it('interactive false disables hover', () => {
    const { config } = useParticlesConfig({ interactive: false })
    const hover = (config.value.interactivity as any).events.onHover
    expect(hover.enable).toBe(false)
  })

  it('uses provided colors', () => {
    const colors = ['#ff0000']
    const { config } = useParticlesConfig({ colors })
    expect((config.value.particles as any).color.value).toEqual(colors)
  })

  it('disables move when prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const { config } = useParticlesConfig()
    expect((config.value.particles as any).move.enable).toBe(false)
  })
})
