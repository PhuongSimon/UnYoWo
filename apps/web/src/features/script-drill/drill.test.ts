import { describe, expect, it } from 'vitest'
import { isCorrect, readContinuous, shuffle, summarize, type DrillAnswer } from './drill'
import { drillScriptsFor, hangulAnswers, kanaAnswers, scriptCells } from './scripts'
import { indexOfInitial, indexOfVowel } from '@/features/learn/lib/hangul'

const answer = (char: string, correct: boolean, given = '', ms = 1000): DrillAnswer => ({ char, expected: char, given, correct, ms })

describe('scripts', () => {
  it('builds the full kana and hangul tables', () => {
    const [hiragana, katakana] = drillScriptsFor('ja')
    expect(scriptCells(hiragana)).toHaveLength(46 + 25 + 33)
    expect(scriptCells(katakana).map((cell) => cell.char)).toContain('ヲ')
    expect(scriptCells(drillScriptsFor('ko')[0])).toHaveLength(14 * 10 + 5 * 10 + 14 * 11)
    expect(drillScriptsFor('en')).toEqual([])
  })

  it('accepts Hepburn, Kunrei and keyboard spellings for kana', () => {
    expect(kanaAnswers('し', 'shi')).toEqual(['shi', 'si'])
    expect(kanaAnswers('ちゃ', 'cha')).toEqual(['cha', 'tya', 'cya'])
    expect(kanaAnswers('ぢ', 'ji')).toEqual(['ji', 'di', 'zi'])
    expect(kanaAnswers('を', 'wo (o)')).toEqual(['wo', 'o'])
    expect(kanaAnswers('か', 'ka')).toEqual(['ka'])
  })

  it('romanises hangul with the Revised Romanization and common spellings', () => {
    const syllable = (initial: string, vowel: string) => hangulAnswers(indexOfInitial(initial), indexOfVowel(vowel))
    expect(syllable('ㅇ', 'ㅓ')).toEqual(['eo'])
    expect(syllable('ㄹ', 'ㅏ')).toEqual(['ra', 'la'])
    expect(syllable('ㅅ', 'ㅣ')).toEqual(['si', 'shi'])
    expect(syllable('ㅆ', 'ㅛ')).toEqual(['ssyo', 'ssho'])
    expect(syllable('ㅎ', 'ㅢ')).toEqual(['hui'])
  })
})

describe('answers', () => {
  it('ignores case, spaces and punctuation', () => {
    expect(isCorrect(' Shi ', ['shi', 'si'])).toBe(true)
    expect(isCorrect('sa', ['shi', 'si'])).toBe(false)
  })

  it('waits while the letters can still become an answer', () => {
    expect(readContinuous('', ['ka'])).toEqual({ done: false })
    expect(readContinuous('s', ['shi', 'si'])).toEqual({ done: false })
    expect(readContinuous('sh', ['shi', 'si'])).toEqual({ done: false })
  })

  it('submits once the answer is complete, or wrong once enough letters are typed', () => {
    expect(readContinuous('si', ['shi', 'si'])).toEqual({ done: true, given: 'si' })
    expect(readContinuous('sa', ['shi', 'si'])).toEqual({ done: true, given: 'sa' })
    expect(readContinuous('g', ['ko'])).toEqual({ done: false })
    expect(readContinuous('go', ['ko'])).toEqual({ done: true, given: 'go' })
    expect(readContinuous('a', ['wo', 'o'])).toEqual({ done: true, given: 'a' })
    expect(readContinuous('o', ['wo', 'o'])).toEqual({ done: true, given: 'o' })
  })

  it('submits ん as soon as "n" is typed', () => {
    expect(readContinuous('n', ['n', 'nn'])).toEqual({ done: true, given: 'n' })
    expect(readContinuous('m', ['n', 'nn'])).toEqual({ done: true, given: 'm' })
  })
})

describe('drill', () => {
  it('shuffles without losing or repeating items', () => {
    const items = [1, 2, 3, 4, 5]
    const shuffled = shuffle(items, () => 0)
    expect(shuffled).toEqual([2, 3, 4, 5, 1])
    expect(items).toEqual([1, 2, 3, 4, 5])
  })

  it('counts accuracy, the best streak and the most-missed characters', () => {
    const summary = summarize(
      [answer('あ', true), answer('し', false, 'sa'), answer('か', true), answer('き', true), answer('し', false, ''), answer('ぬ', false, 'mu')],
      9000,
    )
    expect(summary).toMatchObject({ total: 6, correct: 3, accuracy: 50, durationMs: 9000, averageMs: 1000, bestStreak: 2 })
    expect(summary.mistakes).toEqual([
      { char: 'し', expected: 'し', given: ['sa', ''] },
      { char: 'ぬ', expected: 'ぬ', given: ['mu'] },
    ])
  })
})
