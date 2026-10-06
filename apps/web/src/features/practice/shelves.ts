import type { LearningSet, ProficiencyLevel, Topic } from './types'

/** The sets of one topic inside a level: "Food & drink" parts 1, 2, 3 */
export interface TopicGroup {
  topic: Topic
  sets: LearningSet[]
  itemCount: number
  seen: number
}

/** A tab of the practice page: the alphabet, the starter sets, or one exam level. */
export interface Shelf {
  key: string
  kind: 'alphabet' | 'starter' | 'level'
  level: ProficiencyLevel | null
  sets: LearningSet[]
  /** Level shelves only: sets grouped by topic, in topic order */
  topics: TopicGroup[]
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
    topics: kind === 'level' ? groupByTopic(members) : [],
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

/** Keeps the order the server sends (topic order, then part), grouping consecutive sets of a topic. */
function groupByTopic(sets: LearningSet[]): TopicGroup[] {
  const groups = new Map<string, TopicGroup>()
  for (const set of sets) {
    const topic = set.topic ?? { slug: set.category ?? set.slug, title: set.title, emoji: null }
    const group = groups.get(topic.slug) ?? { topic, sets: [], itemCount: 0, seen: 0 }
    group.sets.push(set)
    group.itemCount += set.itemCount
    group.seen += set.progress.seen
    groups.set(topic.slug, group)
  }
  return [...groups.values()]
}

/** Lower case without accents, so "do an" finds "Đồ ăn" and "food" finds "Food & drink". */
export const foldText = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim()

/** Topics whose title (in either UI language) or slug contains the query as typed, accents ignored. */
export function filterTopics(topics: TopicGroup[], query: string): TopicGroup[] {
  const phrase = foldText(query).replace(/\s+/g, ' ')
  if (!phrase) return topics
  return topics.filter(({ topic }) => {
    const titles = [topic.title.vi, topic.title.en, topic.slug].map((text) => foldText(text).replace(/\s+/g, ' '))
    return titles.some((title) => title.includes(phrase))
  })
}

/** The items of one page (1-based), clamping a page number past the end to the last page. */
export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; page: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  return { items: items.slice((current - 1) * pageSize, current * pageSize), page: current, pageCount }
}
