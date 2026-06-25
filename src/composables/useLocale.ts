import { computed } from 'vue'
import type { Ref } from 'vue'
import { i18n } from '@/i18n'

export type Locale = 'en' | 'uk'

export function useLocale() {
  const localeRef = i18n.global.locale as unknown as Ref<string>

  const locale = computed(() => localeRef.value as Locale)

  function setLocale(lang: Locale) {
    localeRef.value = lang
    localStorage.setItem('locale', lang)
  }

  return { locale, setLocale, availableLocales: ['en', 'uk'] as Locale[] }
}
