import { DAKUTEN, GOJUON, YOON, type Kana } from '@/features/learn/content/ja/kana'
import { composeSyllable, indexOfInitial, indexOfVowel, INITIALS, VOWELS } from '@/features/learn/lib/hangul'
import type { StudyLanguageCode } from '@/features/learn/types'

/** One character to recognise. The first answer is the one shown as "the" romanisation. */
export interface DrillCell {
  char: string
  answers: string[]
}

export interface DrillRow {
  /** Row toggle text: the first character of the row (か, ㄱ). */
  label: string
  cells: (DrillCell | null)[]
}

export interface DrillTable {
  /** i18n key under drill.tables */
  id: 'basic' | 'dakuten' | 'yoon' | 'plain' | 'tense' | 'compound'
  columns: string[]
  rows: DrillRow[]
}

export type DrillScriptId = 'hiragana' | 'katakana' | 'hangul'

export interface DrillScript {
  id: DrillScriptId
  language: StudyLanguageCode
  /** BCP 47 tag for the characters (lang attribute). */
  lang: string
  /** A character that stands for the script on the picker: あ, ア, 한 */
  sample: string
  tables: DrillTable[]
}

// ---- Japanese -------------------------------------------------------------

// Hepburn is shown; Kunrei and keyboard (wāpuro) spellings are accepted too.
const KANA_SPELLINGS: Record<string, string[]> = {
  shi: ['si'],
  chi: ['ti'],
  tsu: ['tu'],
  fu: ['hu'],
  ji: ['zi'],
  sha: ['sya'],
  shu: ['syu'],
  sho: ['syo'],
  cha: ['tya', 'cya'],
  chu: ['tyu', 'cyu'],
  cho: ['tyo', 'cyo'],
  ja: ['zya', 'jya'],
  ju: ['zyu', 'jyu'],
  jo: ['zyo', 'jyo'],
}

// Spelled after the character rather than the sound: ぢ sounds like じ but is typed "di".
const KANA_BY_CHAR: Record<string, string[]> = {
  ぢ: ['ji', 'di', 'zi'],
  づ: ['zu', 'du'],
  を: ['wo', 'o'],
  ん: ['n', 'nn'],
}

/** Accepted spellings for a kana, looked up by its hiragana form so katakana gets the same list. */
export function kanaAnswers(hiragana: string, romaji: string): string[] {
  return KANA_BY_CHAR[hiragana] ?? [romaji, ...(KANA_SPELLINGS[romaji] ?? [])]
}

const VOWEL_COLUMNS = ['a', 'i', 'u', 'e', 'o']
const YOON_COLUMNS = ['ya', 'yu', 'yo']

function kanaRows(source: [string, Kana[]][], script: 0 | 1): DrillRow[] {
  return source.map(([, cells]) => {
    const row = cells.map((kana): DrillCell | null => (kana ? { char: kana[script], answers: kanaAnswers(kana[0], kana[2]) } : null))
    return { label: row.find((cell) => cell !== null)?.char ?? '', cells: row }
  })
}

function kanaScript(id: 'hiragana' | 'katakana', script: 0 | 1): DrillScript {
  return {
    id,
    language: 'ja',
    lang: 'ja',
    sample: script === 0 ? 'あ' : 'ア',
    tables: [
      { id: 'basic', columns: VOWEL_COLUMNS, rows: kanaRows(GOJUON, script) },
      { id: 'dakuten', columns: VOWEL_COLUMNS, rows: kanaRows(DAKUTEN, script) },
      { id: 'yoon', columns: YOON_COLUMNS, rows: kanaRows(YOON, script) },
    ],
  }
}

// ---- Korean -----------------------------------------------------------------

const PLAIN_INITIALS = ['ㅇ', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
const TENSE_INITIALS = ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ']
const BASIC_VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ']
const COMPOUND_VOWELS = ['ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']

/**
 * Revised Romanization of a syllable without a final consonant, plus the spellings learners often use:
 * ㄹ as "l" (라 la) and ㅅ before i / y as "sh" (시 shi, 샤 sha).
 */
export function hangulAnswers(initial: number, vowel: number): string[] {
  const consonant = INITIALS[initial].roman
  const sound = VOWELS[vowel].roman
  const answers = [consonant + sound]
  if (consonant === 'r') answers.push(`l${sound}`)
  if ((consonant === 's' || consonant === 'ss') && (sound === 'i' || sound.startsWith('y'))) {
    answers.push(`${consonant}h${sound === 'i' ? 'i' : sound.slice(1)}`)
  }
  return answers
}

function hangulRows(initials: string[], vowels: string[]): DrillRow[] {
  return initials.map((initialChar) => {
    const initial = indexOfInitial(initialChar)
    const cells = vowels.map((vowelChar): DrillCell => {
      const vowel = indexOfVowel(vowelChar)
      return { char: composeSyllable(initial, vowel), answers: hangulAnswers(initial, vowel) }
    })
    return { label: initialChar, cells }
  })
}

const hangul: DrillScript = {
  id: 'hangul',
  language: 'ko',
  lang: 'ko',
  sample: '한',
  tables: [
    { id: 'plain', columns: BASIC_VOWELS, rows: hangulRows(PLAIN_INITIALS, BASIC_VOWELS) },
    { id: 'tense', columns: BASIC_VOWELS, rows: hangulRows(TENSE_INITIALS, BASIC_VOWELS) },
    { id: 'compound', columns: COMPOUND_VOWELS, rows: hangulRows(PLAIN_INITIALS, COMPOUND_VOWELS) },
  ],
}

const DRILL_SCRIPTS: DrillScript[] = [kanaScript('hiragana', 0), kanaScript('katakana', 1), hangul]

/** The scripts a language can drill; empty for languages written in the Latin alphabet. */
export const drillScriptsFor = (language: StudyLanguageCode) => DRILL_SCRIPTS.filter((script) => script.language === language)

export const tableCells = (table: DrillTable) => table.rows.flatMap((row) => row.cells.filter((cell) => cell !== null))
export const scriptCells = (script: DrillScript) => script.tables.flatMap(tableCells)
