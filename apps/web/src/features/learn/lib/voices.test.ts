import { describe, expect, it } from 'vitest'
import { toSpeechText } from './speech'
import { rankVoices, type VoiceLike } from './voices'

const voice = (name: string, lang: string, extra: Partial<VoiceLike> = {}): VoiceLike => ({ name, lang, localService: true, default: false, ...extra })

describe('rankVoices', () => {
  const voices = [
    voice('Eddy (Japanese (Japan))', 'ja-JP'),
    voice('Grandma (Japanese (Japan))', 'ja-JP'),
    voice('Kyoko', 'ja-JP'),
    voice('Google 日本語', 'ja-JP', { localService: false }),
    voice('Anna', 'de-DE'),
    voice('Flo (German (Germany))', 'de-DE'),
    voice('Yuna', 'ko_KR'),
  ]

  it('puts natural voices first and the quiet novelty voices last', () => {
    expect(rankVoices(voices, 'ja-JP').map((v) => v.name)).toEqual(['Google 日本語', 'Kyoko', 'Eddy (Japanese (Japan))', 'Grandma (Japanese (Japan))'])
    expect(rankVoices(voices, 'de-DE')[0].name).toBe('Anna')
  })

  it('matches the language with or without region and underscore tags', () => {
    expect(rankVoices(voices, 'ko-KR').map((v) => v.name)).toEqual(['Yuna'])
    expect(rankVoices(voices, 'vi-VN')).toEqual([])
  })

  it('keeps a novelty voice when it is the only one', () => {
    expect(rankVoices([voice('Eddy (English (UK))', 'en-GB')], 'en-GB')).toHaveLength(1)
  })
})

describe('toSpeechText', () => {
  it('drops notes and the affix placeholder', () => {
    expect(toSpeechText('～さん')).toBe('さん')
    expect(toSpeechText('**go** (gô) → [ɡoʊ]')).toBe('go')
  })
})
