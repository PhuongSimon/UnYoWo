import VN from 'country-flag-icons/react/3x2/VN'
import { STUDY_LANGUAGES } from '@/features/learn/languages'
import type { StudyLanguage } from '@/features/learn/types'
import type { TranslationLanguage } from './types'

export interface TranslateLanguage extends Pick<StudyLanguage, 'name' | 'speechLang' | 'Flag'> {
  code: TranslationLanguage
}

/** Vietnamese first (the learners' language), then the four study languages. */
export const TRANSLATE_LANGUAGES: TranslateLanguage[] = [
  { code: 'vi', name: { vi: 'Tiếng Việt', en: 'Vietnamese' }, speechLang: 'vi-VN', Flag: VN },
  ...STUDY_LANGUAGES.map(({ code, name, speechLang, Flag }) => ({ code, name, speechLang, Flag })),
]

export const findTranslateLanguage = (code: string) => TRANSLATE_LANGUAGES.find((language) => language.code === code)

export const PROVIDER_NAMES: Record<string, string> = { mymemory: 'MyMemory', libretranslate: 'LibreTranslate', deepl: 'DeepL' }
