import GB from 'country-flag-icons/react/3x2/GB'
import VN from 'country-flag-icons/react/3x2/VN'

export const LANGUAGES = [
  { code: 'en', name: 'English', Flag: GB },
  { code: 'vi', name: 'Tiếng Việt', Flag: VN },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

export const LANGUAGE_CODES: string[] = LANGUAGES.map((lang) => lang.code)
