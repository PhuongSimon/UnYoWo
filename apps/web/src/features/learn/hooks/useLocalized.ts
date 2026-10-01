import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { Localized } from '../types'

export type UiLanguage = keyof Localized

export function useUiLanguage(): UiLanguage {
  const { i18n } = useTranslation()
  return i18n.resolvedLanguage === 'vi' ? 'vi' : 'en'
}

/** Returns a function that picks the current UI language from a Localized value (plain strings pass through). */
export function useLocalized() {
  const lang = useUiLanguage()
  return useCallback((value: string | Localized) => (typeof value === 'string' ? value : value[lang]), [lang])
}
