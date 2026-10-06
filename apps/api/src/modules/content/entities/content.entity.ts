import type { ComponentRole, LearningItemType, LearningSetKind, PartOfSpeech } from '../../../generated/prisma/enums.js';

/** Learning content text in each UI language; the web app picks one. */
export type Localized = { en: string; vi: string };

/** A word's meaning per UI language. A key can be missing: an English word has no English meaning. */
export type Meaning = Partial<Localized>;

export interface LevelSummary {
  /** N5, B1, TOPIK1 */
  code: string;
  /** JLPT, CEFR, TOPIK */
  framework: string;
  title: Localized;
  /** Easiest first */
  sortOrder: number;
}

export interface TopicSummary {
  slug: string;
  title: Localized;
  emoji: string | null;
}

export interface LanguageSummary {
  code: string;
  nativeName: string;
  speechLang: string;
  setCount: number;
  itemCount: number;
}

export interface LearningSetSummary {
  id: string;
  languageCode: string;
  slug: string;
  kind: LearningSetKind;
  script: string | null;
  category: string | null;
  /** Exam level of a word-list set; null for alphabets and starter sets */
  level: LevelSummary | null;
  /** Word-list topics are split into parts: 1, 2, 3… */
  part: number | null;
  /** The vocabulary topic, with its shared title and emoji */
  topic: TopicSummary | null;
  title: Localized;
  itemCount: number;
  /** Its items are built from parts (가 = ㄱ + ㅏ), so the character builder can use it */
  buildable: boolean;
}

export interface SetProgress {
  /** Items the user has answered at least once */
  seen: number;
  mastered: number;
  /** Items whose next review time has passed */
  due: number;
}

export interface LearningSetWithProgress extends LearningSetSummary {
  progress: SetProgress;
}

export interface LearningItemView {
  id: string;
  type: LearningItemType;
  text: string;
  reading: string | null;
  romanization: string | null;
  ipa: string | null;
  meaning: Meaning | null;
  partOfSpeech: PartOfSpeech | null;
  emoji: string | null;
  attributes: Record<string, string> | null;
  audioUrl: string | null;
  components: { role: ComponentRole; text: string }[];
}

/** An item with everything a game needs to build a question about it. */
export interface PracticeItem {
  id: string;
  setId: string;
  languageCode: string;
  type: LearningItemType;
  text: string;
  reading: string | null;
  romanization: string | null;
  /** Other accepted romanizations (shi → si) */
  acceptedAnswers: string[];
  meaning: Meaning | null;
  partOfSpeech: PartOfSpeech | null;
  emoji: string | null;
  /** Language-specific extras, e.g. German { article: 'der' }, Korean { speak: '기역' } */
  attributes: Record<string, string> | null;
  /** Parts in writing order: 곡 = ㄱ (INITIAL) + ㅗ (VOWEL) + ㄱ (FINAL) */
  components: { role: ComponentRole; text: string }[];
  audioUrl: string | null;
  sortOrder: number;
  /** Curated look-alikes, preferred as wrong options */
  confusableIds: string[];
}

/** A dataset the language's content was built from, shown as attribution. */
export interface ContentSourceView {
  id: string;
  name: string;
  url: string;
  license: string;
  attribution: string;
}

/** Find words by how they are written (猫, Katze) or by a meaning in a UI language (con mèo). */
export type WordLookup = { language: string; text: string } | { language: string; meaning: string; meaningLanguage: 'vi' | 'en' };

/** A word from the word lists matching a lookup, with where to study it. */
export interface WordMatch {
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

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
