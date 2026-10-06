import { searchList } from '@/lib/search'
import type { LearningSet, ProficiencyLevel } from './types'

/** A tab of the practice page: the alphabet, the starter sets, or one exam level. */
export interface Shelf {
  key: string
  kind: 'alphabet' | 'starter' | 'level'
  level: ProficiencyLevel | null
  /** In the order the server sends them; an exam level has one set per topic, in topic order */
  sets: LearningSet[]
  itemCount: number
}

const sum = (sets: LearningSet[], pick: (set: LearningSet) => number) => sets.reduce((total, set) => total + pick(set), 0)

/** Alphabet first, then the starter sets, then the exam levels from the easiest. Empty shelves are left out. */
export function groupIntoShelves(sets: LearningSet[]): Shelf[] {
  const shelf = (key: string, kind: Shelf['kind'], level: ProficiencyLevel | null, members: LearningSet[]): Shelf => ({
    key,
    kind,
    level,
    sets: members,
    itemCount: sum(members, (set) => set.itemCount),
  })

  const levels = new Map<string, { level: ProficiencyLevel; sets: LearningSet[] }>()
  for (const set of sets) {
    if (!set.level) continue
    const entry = levels.get(set.level.code) ?? { level: set.level, sets: [] }
    entry.sets.push(set)
    levels.set(set.level.code, entry)
  }

  return [
    shelf('alphabet', 'alphabet', null, sets.filter((set) => set.kind === 'ALPHABET')),
    shelf('starter', 'starter', null, sets.filter((set) => set.kind === 'VOCABULARY' && !set.level)),
    ...[...levels.values()].sort((a, b) => a.level.sortOrder - b.level.sortOrder).map(({ level, sets: members }) => shelf(level.code, 'level', level, members)),
  ].filter((entry) => entry.sets.length > 0)
}

/** Sets whose topic (in either UI language), title or slug matches the query, by whole words (see searchList). */
export const filterSets = (sets: LearningSet[], query: string): LearningSet[] =>
  searchList(sets, query, (set) => [set.topic?.title.vi, set.topic?.title.en, set.title.vi, set.title.en, set.topic?.slug ?? set.slug])

/** The items of one page (1-based), clamping a page number past the end to the last page. */
export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; page: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  return { items: items.slice((current - 1) * pageSize, current * pageSize), page: current, pageCount }
}
