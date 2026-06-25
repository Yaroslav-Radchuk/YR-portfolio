import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'

describe('SectionEyebrow', () => {
  it('renders text prop', () => {
    const wrapper = mount(SectionEyebrow, { props: { text: 'About' } })
    expect(wrapper.text()).toBe('About')
  })
})
