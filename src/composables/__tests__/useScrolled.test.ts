import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrolled } from '@/composables/useScrolled'

function mountComposable() {
  let result: ReturnType<typeof useScrolled>
  mount(defineComponent({
    setup() { result = useScrolled(20) },
    template: '<div />',
  }))
  return result!
}

describe('useScrolled', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
  })

  it('starts false when scrollY is 0', () => {
    const { isScrolled } = mountComposable()
    expect(isScrolled.value).toBe(false)
  })

  it('becomes true after scroll event exceeds threshold', () => {
    const { isScrolled } = mountComposable()
    Object.defineProperty(window, 'scrollY', { writable: true, value: 50 })
    window.dispatchEvent(new Event('scroll'))
    expect(isScrolled.value).toBe(true)
  })

  it('stays false when scroll is below threshold', () => {
    const { isScrolled } = mountComposable()
    Object.defineProperty(window, 'scrollY', { writable: true, value: 10 })
    window.dispatchEvent(new Event('scroll'))
    expect(isScrolled.value).toBe(false)
  })
})
