import DE from 'country-flag-icons/react/3x2/DE'
import GB from 'country-flag-icons/react/3x2/GB'
import JP from 'country-flag-icons/react/3x2/JP'
import KR from 'country-flag-icons/react/3x2/KR'
import type { StudyLanguage, StudyLanguageCode } from './types'

export const STUDY_LANGUAGES: StudyLanguage[] = [
  {
    code: 'en',
    speechLang: 'en-GB',
    ipaDelimiters: ['/', '/'],
    nativeName: 'English',
    name: { vi: 'Tiếng Anh', en: 'English' },
    greeting: 'Hello!',
    tagline: {
      vi: 'Ngôn ngữ toàn cầu: 26 chữ cái, 44 âm và những thì quen thuộc.',
      en: 'The global language: 26 letters, 44 sounds and the core tenses.',
    },
    glyph: 'Aa',
    Flag: GB,
    writingLabel: { vi: 'Bảng chữ cái', en: 'Alphabet' },
    levelLabels: { A1: 'A1', A2: 'A2' },
    load: () => import('./content/en').then((m) => m.default),
  },
  {
    code: 'de',
    speechLang: 'de-DE',
    ipaDelimiters: ['[', ']'],
    nativeName: 'Deutsch',
    name: { vi: 'Tiếng Đức', en: 'German' },
    greeting: 'Hallo!',
    tagline: {
      vi: 'Đọc gần như đúng chính tả, 3 giống, 4 cách và trật tự từ rất chặt chẽ.',
      en: 'Read almost as it is written, with 3 genders, 4 cases and a strict word order.',
    },
    glyph: 'Ää',
    Flag: DE,
    writingLabel: { vi: 'Bảng chữ cái', en: 'Alphabet' },
    levelLabels: { A1: 'A1', A2: 'A2' },
    load: () => import('./content/de').then((m) => m.default),
  },
  {
    code: 'ja',
    speechLang: 'ja-JP',
    ipaDelimiters: ['[', ']'],
    nativeName: '日本語',
    name: { vi: 'Tiếng Nhật', en: 'Japanese' },
    greeting: 'こんにちは',
    greetingRoman: 'konnichiwa',
    tagline: {
      vi: 'Ba bộ chữ Hiragana, Katakana, Kanji và trợ từ đứng sau mỗi thành phần câu.',
      en: 'Three scripts (hiragana, katakana, kanji) and particles that follow every part of the sentence.',
    },
    glyph: 'あ',
    Flag: JP,
    writingLabel: { vi: 'Hiragana & Katakana', en: 'Hiragana & Katakana' },
    levelLabels: { A1: 'N5', A2: 'N4' },
    load: () => import('./content/ja').then((m) => m.default),
  },
  {
    code: 'ko',
    speechLang: 'ko-KR',
    ipaDelimiters: ['[', ']'],
    nativeName: '한국어',
    name: { vi: 'Tiếng Hàn', en: 'Korean' },
    greeting: '안녕하세요',
    greetingRoman: 'annyeonghaseyo',
    tagline: {
      vi: 'Bảng chữ Hangul khoa học, học trong vài giờ; động từ đứng cuối câu.',
      en: 'Hangul is so logical you can learn it in hours; the verb always comes last.',
    },
    glyph: '한',
    Flag: KR,
    writingLabel: { vi: 'Hangul', en: 'Hangul' },
    levelLabels: { A1: 'TOPIK 1', A2: 'TOPIK 2' },
    load: () => import('./content/ko').then((m) => m.default),
  },
]

export function findStudyLanguage(code: string | undefined) {
  return STUDY_LANGUAGES.find((lang) => lang.code === (code as StudyLanguageCode))
}
