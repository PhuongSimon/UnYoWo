import type { Meaning, PartOfSpeech } from '@/features/practice/types'

export type TranslationLanguage = 'vi' | 'en' | 'de' | 'ja' | 'ko'

export interface TranslateRequest {
  text: string
  /** "auto" lets the server guess from the script */
  source: TranslationLanguage | 'auto'
  target: TranslationLanguage
}

/** A word from the app's word lists that matches the text */
export interface DictionaryEntry {
  itemId: string
  setId: string
  language: string
  text: string
  reading: string | null
  romanization: string | null
  meaning: Meaning | null
  partOfSpeech: PartOfSpeech | null
  level: string | null
  attributes: Record<string, string> | null
}

export interface TranslationResult {
  source: TranslationLanguage
  target: TranslationLanguage
  detected: boolean
  /** Null when every machine translator failed but the word lists had matches */
  translation: string | null
  provider: string | null
  cached: boolean
  dictionary: DictionaryEntry[]
}
