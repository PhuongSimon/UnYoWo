import { describe, expect, it } from 'vitest'
import { searchList } from './search'

const topics = [
  { vi: 'Cảm xúc & tính cách', en: 'Feelings & personality' },
  { vi: 'Đời sống & nhà cửa', en: 'Daily life & home' },
  { vi: 'Sở thích & giải trí', en: 'Hobbies & leisure' },
  { vi: 'Xã hội', en: 'Society' },
  { vi: 'Số & số lượng', en: 'Numbers & quantities' },
  { vi: 'Đồ ăn & đồ uống', en: 'Food & drink' },
  { vi: 'Động vật', en: 'Animals' },
]

const find = (query: string) => searchList(topics, query, (topic) => [topic.vi, topic.en]).map((topic) => topic.vi)

describe('searchList', () => {
  it('respects the accents that are typed', () => {
    expect(find('số')).toEqual(['Số & số lượng'])
    expect(find('Sở')).toEqual(['Sở thích & giải trí'])
    expect(find('đồ ăn')).toEqual(['Đồ ăn & đồ uống'])
  })

  it('ignores accents when none are typed, but never matches inside a word', () => {
    expect(find('so')).toEqual(['Sở thích & giải trí', 'Số & số lượng'])
    expect(find('do AN')).toEqual(['Đồ ăn & đồ uống'])
    expect(find('doi song')).toEqual(['Đời sống & nhà cửa'])
  })

  it('lets the last word be unfinished when nothing matches it whole', () => {
    expect(find('anim')).toEqual(['Động vật'])
    expect(find('gia')).toEqual(['Sở thích & giải trí'])
    expect(find('soc')).toEqual(['Xã hội'])
    expect(find('đồ u')).toEqual(['Đồ ăn & đồ uống'])
  })

  it('falls back to ignoring accents when an accented query finds nothing', () => {
    expect(find('đông vật')).toEqual(['Động vật'])
  })

  it('finds Japanese, Chinese and Korean text anywhere in the word', () => {
    const words = ['日本語', 'ねこ', '한국어']
    expect(searchList(words, '本', (word) => [word])).toEqual(['日本語'])
    expect(searchList(words, 'こ', (word) => [word])).toEqual(['ねこ'])
    expect(searchList(words, '국어', (word) => [word])).toEqual(['한국어'])
  })

  it('returns everything for a blank query and nothing for an unknown word', () => {
    expect(find('  ')).toHaveLength(topics.length)
    expect(find('xyz')).toEqual([])
  })
})
