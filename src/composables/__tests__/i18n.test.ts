import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import uk from '@/locales/uk.json'

describe('locale files', () => {
  it('en has all required top-level keys', () => {
    const required = ['nav', 'hero', 'about', 'built', 'skills', 'experience', 'contact', 'footer']
    required.forEach(key => expect(en).toHaveProperty(key))
  })

  it('uk has same top-level keys as en', () => {
    const enKeys = Object.keys(en).sort()
    const ukKeys = Object.keys(uk).sort()
    expect(ukKeys).toEqual(enKeys)
  })

  it('i18n resolves en message', () => {
    const i18n = createI18n({ locale: 'en', messages: { en, uk }, legacy: false })
    expect(i18n.global.t('nav.about')).toBe(en.nav.about)
  })

  it('experience bullets are arrays', () => {
    expect(Array.isArray(en.experience.evoplay.bullets)).toBe(true)
    expect(en.experience.evoplay.bullets.length).toBeGreaterThan(0)
  })
})
