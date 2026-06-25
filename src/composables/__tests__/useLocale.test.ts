import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLocale } from '@/composables/useLocale'

vi.mock('@/i18n', () => ({
  i18n: { global: { locale: { value: 'en' } } },
}))

const store: Record<string, string> = {}
beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
  })
})

describe('useLocale', () => {
  it('returns available locales', () => {
    const { availableLocales } = useLocale()
    expect(availableLocales).toEqual(['en', 'uk'])
  })

  it('setLocale saves to localStorage', () => {
    const { setLocale } = useLocale()
    setLocale('uk')
    expect(store['locale']).toBe('uk')
  })
})
