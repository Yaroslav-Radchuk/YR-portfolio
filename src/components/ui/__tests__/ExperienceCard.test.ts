import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExperienceCard from '@/components/ui/ExperienceCard.vue'

describe('ExperienceCard', () => {
  it('renders company, role, period, and bullets', () => {
    const wrapper = mount(ExperienceCard, {
      props: {
        company: 'EvoPlay',
        role: 'Frontend Developer',
        period: 'Jan 2026 – present',
        bullets: ['Built SaaS', 'Optimized performance'],
      },
    })
    expect(wrapper.text()).toContain('EvoPlay')
    expect(wrapper.text()).toContain('Frontend Developer')
    expect(wrapper.text()).toContain('Built SaaS')
  })
})
