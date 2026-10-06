import { describe, expect, it } from 'vitest'
import { filterTopics, groupIntoShelves, paginate } from './shelves'
import type { LearningSet } from './types'

const n5 = { code: 'N5', framework: 'JLPT', title: { en: 'N5', vi: 'N5' }, sortOrder: 4 }
const n4 = { code: 'N4', framework: 'JLPT', title: { en: 'N4', vi: 'N4' }, sortOrder: 5 }
const food = { slug: 'food', title: { en: 'Food', vi: 'Đồ ăn' }, emoji: '🍽️' }
const animals = { slug: 'animals', title: { en: 'Animals', vi: 'Động vật' }, emoji: '🐾' }

const set = (slug: string, extra: Partial<LearningSet> = {}): LearningSet => ({
  id: slug,
  languageCode: 'ja',
  slug,
  kind: 'VOCABULARY',
  script: null,
  category: null,
  level: null,
  part: null,
  topic: null,
  title: { en: slug, vi: slug },
  itemCount: 10,
  buildable: false,
  progress: { seen: 0, mastered: 0, due: 0 },
  ...extra,
})

describe('groupIntoShelves', () => {
  it('orders shelves alphabet → starter → levels from the easiest, and skips empty ones', () => {
    const shelves = groupIntoShelves([
      set('n4-food-1', { level: n4, topic: food, part: 1 }),
      set('vocab-food', { topic: food }),
      set('hiragana-basic', { kind: 'ALPHABET' }),
      set('n5-food-1', { level: n5, topic: food, part: 1 }),
    ])
    expect(shelves.map((shelf) => [shelf.key, shelf.kind, shelf.sets.map((s) => s.slug)])).toEqual([
      ['alphabet', 'alphabet', ['hiragana-basic']],
      ['starter', 'starter', ['vocab-food']],
      ['N5', 'level', ['n5-food-1']],
      ['N4', 'level', ['n4-food-1']],
    ])
    expect(groupIntoShelves([set('n5-food-1', { level: n5, topic: food })]).map((shelf) => shelf.key)).toEqual(['N5'])
  })

  it('groups the parts of a topic and adds up their words and progress', () => {
    const [shelf] = groupIntoShelves([
      set('n5-food-1', { level: n5, topic: food, part: 1, itemCount: 25, progress: { seen: 5, mastered: 1, due: 0 } }),
      set('n5-food-2', { level: n5, topic: food, part: 2, itemCount: 24, progress: { seen: 3, mastered: 0, due: 1 } }),
      set('n5-animals-1', { level: n5, topic: animals, part: 1, itemCount: 12 }),
    ])
    expect(shelf.itemCount).toBe(61)
    expect(shelf.topics.map((group) => [group.topic.slug, group.sets.length, group.itemCount, group.seen])).toEqual([
      ['food', 2, 49, 8],
      ['animals', 1, 12, 0],
    ])
  })
})

describe('filterTopics and paginate', () => {
  const groups = groupIntoShelves([
    set('n5-food-1', { level: n5, topic: food }),
    set('n5-animals-1', { level: n5, topic: animals }),
  ])[0].topics

  it('finds topics in either language, ignoring accents and case', () => {
    expect(filterTopics(groups, 'do AN').map((g) => g.topic.slug)).toEqual(['food'])
    expect(filterTopics(groups, 'đồ ăn').map((g) => g.topic.slug)).toEqual(['food'])
    expect(filterTopics(groups, 'anim').map((g) => g.topic.slug)).toEqual(['animals'])
    expect(filterTopics(groups, '  ')).toHaveLength(2)
    expect(filterTopics(groups, 'xyz')).toEqual([])
  })

  it('pages a list and clamps the page number', () => {
    const list = Array.from({ length: 11 }, (_, i) => i)
    expect(paginate(list, 2, 5)).toEqual({ items: [5, 6, 7, 8, 9], page: 2, pageCount: 3 })
    expect(paginate(list, 9, 5)).toEqual({ items: [10], page: 3, pageCount: 3 })
    expect(paginate([], 1, 5)).toEqual({ items: [], page: 1, pageCount: 1 })
  })
})
