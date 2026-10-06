/**
 * Search-as-you-type for short lists (topics, the words of a set).
 *
 * Matches whole words, not any substring: "so" must not find "per-so-nality" or "So-ciety".
 * Accents count when they are typed: "số" finds "Số & số lượng" but not "Sở thích" or "Đời sống";
 * plain "so" finds both "Số" and "Sở". The last word may be unfinished ("anim" → "Animals").
 * Japanese, Chinese and Korean have no spaces between words, so they match anywhere ("本" → "日本").
 *
 * The strictest rule that finds anything wins, so a precise query is not drowned by loose matches.
 */

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u

const lower = (text: string) => text.normalize('NFC').toLowerCase()
const words = (text: string) => lower(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean)
/** "Đồ ăn" → "do an": strips accents and turns đ into d. */
export const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC').replace(/đ/g, 'd').replace(/Đ/g, 'D')

/** Query words appear one after another in the field; the last one may be the start of a word. */
function hasPhrase(field: string[], query: string[], lastIsPrefix: boolean) {
  for (let start = 0; start + query.length <= field.length; start++) {
    const found = query.every((word, i) => {
      const candidate = field[start + i]
      return lastIsPrefix && i === query.length - 1 ? candidate.startsWith(word) : candidate === word
    })
    if (found) return true
  }
  return false
}

type Rule = (fields: string[]) => boolean

function rulesFor(query: string): Rule[] {
  if (CJK.test(query)) {
    const needle = lower(query).replace(/\s+/g, '')
    return [(fields) => fields.some((field) => lower(field).replace(/\s+/g, '').includes(needle))]
  }

  const typed = words(query)
  const folded = typed.map(fold)
  const accented = typed.some((word, i) => word !== folded[i])
  const exact = (lastIsPrefix: boolean): Rule => (fields) => fields.some((field) => hasPhrase(words(field), typed, lastIsPrefix))
  const loose = (lastIsPrefix: boolean): Rule => (fields) => fields.some((field) => hasPhrase(words(field).map(fold), folded, lastIsPrefix))

  return [...(accented ? [exact(false), exact(true)] : []), loose(false), loose(true)]
}

/** The items matching the query, in their original order; every item for a blank query. */
export function searchList<T>(items: T[], query: string, fields: (item: T) => (string | null | undefined)[]): T[] {
  if (!query.trim()) return items
  const texts = items.map((item) => fields(item).filter((field): field is string => Boolean(field)))

  for (const rule of rulesFor(query)) {
    const found = items.filter((_, index) => rule(texts[index]))
    if (found.length > 0) return found
  }
  return []
}
