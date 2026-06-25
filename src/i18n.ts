import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import uk from '@/locales/uk.json'

const savedLocale =
  typeof localStorage !== 'undefined' ? (localStorage.getItem('locale') ?? 'en') : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, uk },
})
