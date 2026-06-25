import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  })))
})

describe('useRevealOnScroll', () => {
  it('isVisible starts as false', () => {
    const { isVisible } = useRevealOnScroll()
    expect(isVisible.value).toBe(false)
  })

  it('targetRef starts as null', () => {
    const { targetRef } = useRevealOnScroll()
    expect(targetRef.value).toBeNull()
  })
})
