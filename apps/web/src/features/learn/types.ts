import type { ComponentType } from 'react'

export type StudyLanguageCode = 'en' | 'de' | 'ja' | 'ko'
export type Level = 'A1' | 'A2'

/** Text shown in the UI language. Strings may use **bold** markers. */
export interface Localized {
  vi: string
  en: string
}

export type Cell = string | Localized

export interface Example {
  text: string
  roman?: string
  vi: string
  /** Omitted for English sentences, which need no English gloss. */
  en?: string
}

export interface Table {
  headers: Cell[]
  rows: Cell[][]
}

export interface Section {
  title?: Localized
  body?: Localized
  bullets?: Localized[]
  table?: Table
  examples?: Example[]
}

export interface GrammarTopic {
  id: string
  level: Level
  title: Localized
  summary: Localized
  sections: Section[]
  tips?: Localized[]
}

export interface GlyphExample {
  word: string
  roman?: string
  ipa?: string
  meaning: Localized
}

export interface Glyph {
  char: string
  /** Letter name in the native script, e.g. Korean 기역. */
  name?: string
  /** Letter name or romanization shown under the character. */
  roman?: string
  ipa?: string
  /** Kanji readings: On (Chinese-derived) and Kun (native Japanese). */
  readings?: { on?: string; kun?: string }
  /** Sounds the letter usually spells, e.g. "/æ/ · /eɪ/". */
  sounds?: string
  example?: GlyphExample
  tip?: Localized
  /** What the speech engine should read; defaults to the character. */
  speak?: string
}

export interface GridRow {
  label: string
  cells: (Glyph | null)[]
}

export interface ScriptChart {
  id: string
  title: Localized
  intro?: Localized
  /** 'hangul-builder' renders the interactive syllable builder instead of static data. */
  kind: 'cards' | 'grid' | 'hangul-builder'
  glyphs?: Glyph[]
  columns?: string[]
  rows?: GridRow[]
  notes?: Localized[]
}

export interface Sound {
  ipa: string
  label?: Localized
  /** Example words; **bold** marks the letters that make the sound. */
  examples: string[]
  tip: Localized
  speak?: string
}

export interface SoundGroup {
  id: string
  title: Localized
  intro?: Localized
  sounds: Sound[]
}

export interface Rule {
  id: string
  title: Localized
  body: Localized
  table?: Table
  examples?: Example[]
}

export interface StudyContent {
  overview: Localized
  tips: Localized[]
  writing: { intro: Localized; charts: ScriptChart[] }
  pronunciation: { intro: Localized; groups: SoundGroup[]; rules: Rule[] }
  grammar: GrammarTopic[]
}

export interface StudyLanguage {
  code: StudyLanguageCode
  /** BCP 47 tag for the Web Speech API voice. */
  speechLang: string
  /** English sound cards are phonemic /…/, the others phonetic […]. */
  ipaDelimiters: [string, string]
  nativeName: string
  name: Localized
  greeting: string
  greetingRoman?: string
  tagline: Localized
  glyph: string
  Flag: ComponentType<{ className?: string; title?: string }>
  writingLabel: Localized
  levelLabels: Record<Level, string>
  load: () => Promise<StudyContent>
}
