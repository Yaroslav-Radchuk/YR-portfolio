import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BuiltCard from '@/components/ui/BuiltCard.vue'

describe('BuiltCard', () => {
  it('renders title and description', () => {
    const wrapper = mount(BuiltCard, {
      props: { title: 'High-Load Platforms', description: 'SaaS products', iconColor: '#8052ff' },
    })
    expect(wrapper.text()).toContain('High-Load Platforms')
    expect(wrapper.text()).toContain('SaaS products')
  })
})
