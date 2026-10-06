import { FINALS, indexOfInitial, indexOfVowel, composeSyllable } from '@/features/learn/lib/hangul'
import type { ComponentRole } from '../types'

export interface Part {
  role: ComponentRole
  text: string
}

// Compound vowels are drawn by joining two vowels; Unicode has no rule for it, so it is a table.
const COMPOUND_VOWELS: Record<string, string> = {
  ㅏㅣ: 'ㅐ', ㅑㅣ: 'ㅒ', ㅓㅣ: 'ㅔ', ㅕㅣ: 'ㅖ', ㅗㅏ: 'ㅘ', ㅗㅐ: 'ㅙ',
  ㅗㅣ: 'ㅚ', ㅜㅓ: 'ㅝ', ㅜㅔ: 'ㅞ', ㅜㅣ: 'ㅟ', ㅡㅣ: 'ㅢ',
}

const COMBINING_MARKS: Record<string, string> = { '゛': '゙', '゜': '゚' }

const rolesAre = (parts: Part[], ...roles: ComponentRole[]) =>
  parts.length === roles.length && parts.every((part, index) => part.role === roles[index])

/**
 * What the chosen parts make, for the live preview: ㄱ + ㅗ + ㄱ → 곡, き + ゃ → きゃ, か + ゛ → が.
 * Decided by the parts' roles, not the language. Null when the parts do not form a character.
 * Display only: the server checks the answer.
 */
export function composeParts(parts: Part[]): string | null {
  const [first, second, third] = parts
  if (rolesAre(parts, 'INITIAL', 'VOWEL') || rolesAre(parts, 'INITIAL', 'VOWEL', 'FINAL')) {
    const initial = indexOfInitial(first.text)
    const vowel = indexOfVowel(second.text)
    const final = third ? FINALS.findIndex((jamo) => jamo.char === third.text) : 0
    return initial < 0 || vowel < 0 || final < 0 ? null : composeSyllable(initial, vowel, final)
  }
  if (rolesAre(parts, 'VOWEL', 'VOWEL')) return COMPOUND_VOWELS[first.text + second.text] ?? null
  if (rolesAre(parts, 'BASE', 'SMALL')) return first.text + second.text
  if (rolesAre(parts, 'BASE', 'MARK')) {
    const mark = COMBINING_MARKS[second.text]
    return mark ? (first.text + mark).normalize('NFC') : null
  }
  return null
}
