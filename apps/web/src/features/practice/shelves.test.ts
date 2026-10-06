import { describe, expect, it } from 'vitest'
import { filterSets, groupIntoShelves, paginate } from './shelves'
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
      set('n4-food', { level: n4, topic: food }),
      set('vocab-food', { topic: food }),
      set('hiragana-basic', { kind: 'ALPHABET' }),
      set('n5-food', { level: n5, topic: food, itemCount: 49 }),
    ])
    expect(shelves.map((shelf) => [shelf.key, shelf.kind, shelf.sets.map((s) => s.slug)])).toEqual([
      ['alphabet', 'alphabet', ['hiragana-basic']],
      ['starter', 'starter', ['vocab-food']],
      ['N5', 'level', ['n5-food']],
      ['N4', 'level', ['n4-food']],
    ])
    expect(shelves[2].itemCount).toBe(49)
    expect(groupIntoShelves([set('n5-food', { level: n5, topic: food })]).map((shelf) => shelf.key)).toEqual(['N5'])
  })
})

describe('filterSets and paginate', () => {
  const sets = [set('n5-food', { level: n5, topic: food }), set('n5-animals', { level: n5, topic: animals })]

  it('finds sets by their topic in either language, accents optional', () => {
    expect(filterSets(sets, 'do AN').map((s) => s.slug)).toEqual(['n5-food'])
    expect(filterSets(sets, 'đồ ăn').map((s) => s.slug)).toEqual(['n5-food'])
    expect(filterSets(sets, 'anim').map((s) => s.slug)).toEqual(['n5-animals'])
    expect(filterSets(sets, '  ')).toHaveLength(2)
    expect(filterSets(sets, 'xyz')).toEqual([])
  })

  it('pages a list and clamps the page number', () => {
    const list = Array.from({ length: 11 }, (_, i) => i)
    expect(paginate(list, 2, 5)).toEqual({ items: [5, 6, 7, 8, 9], page: 2, pageCount: 3 })
    expect(paginate(list, 9, 5)).toEqual({ items: [10], page: 3, pageCount: 3 })
    expect(paginate([], 1, 5)).toEqual({ items: [], page: 1, pageCount: 1 })
  })
})
