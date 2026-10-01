import type { Cell, Example, Glyph, GlyphExample, Localized, Table } from '../types'

export const l = (vi: string, en: string): Localized => ({ vi, en })

export const ex = (text: string, vi: string, en?: string, roman?: string): Example => ({ text, vi, en, roman })

export const table = (headers: Cell[], rows: Cell[][]): Table => ({ headers, rows })

export const word = (word: string, meaning: Localized, extra: Omit<GlyphExample, 'word' | 'meaning'> = {}): GlyphExample => ({
  word,
  meaning,
  ...extra,
})

export const glyph = (char: string, ipa: string, rest: Omit<Glyph, 'char' | 'ipa'> = {}): Glyph => ({ char, ipa, ...rest })
