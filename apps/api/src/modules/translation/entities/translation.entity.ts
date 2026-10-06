import type { PartOfSpeech } from '../../../generated/prisma/enums.js';
import type { Meaning } from '../../content/entities/content.entity.js';
import type { TranslationLanguage } from '../languages.js';

/** A word from the app's own word lists that matches the text, so the learner can study it. */
export interface DictionaryEntry {
  itemId: string;
  setId: string;
  language: string;
  text: string;
  reading: string | null;
  romanization: string | null;
  meaning: Meaning | null;
  partOfSpeech: PartOfSpeech | null;
  /** N5, B1… null for starter sets */
  level: string | null;
  /** German article, Sino-Vietnamese reading… */
  attributes: Record<string, string> | null;
}

export interface TranslationResult {
  source: TranslationLanguage;
  target: TranslationLanguage;
  /** True when the source language was guessed from the text */
  detected: boolean;
  /** Null when every provider failed but the word lists still had matches */
  translation: string | null;
  /** Which service translated it: mymemory, libretranslate, deepl */
  provider: string | null;
  cached: boolean;
  dictionary: DictionaryEntry[];
}

export interface CachedTranslation {
  translatedText: string;
  provider: string;
}
