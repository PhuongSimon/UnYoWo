import { describe, expect, it } from 'vitest'
import { composeParts } from './compose'

describe('composeParts', () => {
  it('builds Hangul blocks from an initial, a vowel and an optional final', () => {
    expect(composeParts([{ role: 'INITIAL', text: 'ㄱ' }, { role: 'VOWEL', text: 'ㅏ' }])).toBe('가')
    expect(composeParts([{ role: 'INITIAL', text: 'ㄱ' }, { role: 'VOWEL', text: 'ㅗ' }, { role: 'FINAL', text: 'ㄱ' }])).toBe('곡')
    expect(composeParts([{ role: 'INITIAL', text: 'ㄲ' }, { role: 'VOWEL', text: 'ㅗ' }, { role: 'FINAL', text: 'ㅊ' }])).toBe('꽃')
  })

  it('joins two vowels into a compound vowel', () => {
    expect(composeParts([{ role: 'VOWEL', text: 'ㅗ' }, { role: 'VOWEL', text: 'ㅏ' }])).toBe('ㅘ')
    expect(composeParts([{ role: 'VOWEL', text: 'ㅏ' }, { role: 'VOWEL', text: 'ㅗ' }])).toBeNull()
  })

  it('writes kana combinations and adds dakuten marks', () => {
    expect(composeParts([{ role: 'BASE', text: 'き' }, { role: 'SMALL', text: 'ゃ' }])).toBe('きゃ')
    expect(composeParts([{ role: 'BASE', text: 'か' }, { role: 'MARK', text: '゛' }])).toBe('が')
    expect(composeParts([{ role: 'BASE', text: 'ハ' }, { role: 'MARK', text: '゜' }])).toBe('パ')
  })

  it('returns null for parts that do not form a character', () => {
    expect(composeParts([{ role: 'VOWEL', text: 'ㅏ' }, { role: 'INITIAL', text: 'ㄱ' }])).toBeNull()
    expect(composeParts([{ role: 'INITIAL', text: 'x' }, { role: 'VOWEL', text: 'ㅏ' }])).toBeNull()
  })
})
