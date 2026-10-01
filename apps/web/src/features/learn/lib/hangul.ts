export interface Jamo {
  char: string
  roman: string
  ipa: string
}

const jamo = (char: string, roman: string, ipa: string): Jamo => ({ char, roman, ipa })

// The order of these three lists follows Unicode: composeSyllable relies on the indexes.
export const INITIALS: Jamo[] = [
  jamo('ㄱ', 'g', 'k'),
  jamo('ㄲ', 'kk', 'k͈'),
  jamo('ㄴ', 'n', 'n'),
  jamo('ㄷ', 'd', 't'),
  jamo('ㄸ', 'tt', 't͈'),
  jamo('ㄹ', 'r', 'ɾ'),
  jamo('ㅁ', 'm', 'm'),
  jamo('ㅂ', 'b', 'p'),
  jamo('ㅃ', 'pp', 'p͈'),
  jamo('ㅅ', 's', 's'),
  jamo('ㅆ', 'ss', 's͈'),
  jamo('ㅇ', '', ''),
  jamo('ㅈ', 'j', 'tɕ'),
  jamo('ㅉ', 'jj', 't͈ɕ'),
  jamo('ㅊ', 'ch', 'tɕʰ'),
  jamo('ㅋ', 'k', 'kʰ'),
  jamo('ㅌ', 't', 'tʰ'),
  jamo('ㅍ', 'p', 'pʰ'),
  jamo('ㅎ', 'h', 'h'),
]

export const VOWELS: Jamo[] = [
  jamo('ㅏ', 'a', 'a'),
  jamo('ㅐ', 'ae', 'ɛ'),
  jamo('ㅑ', 'ya', 'ja'),
  jamo('ㅒ', 'yae', 'jɛ'),
  jamo('ㅓ', 'eo', 'ʌ'),
  jamo('ㅔ', 'e', 'e'),
  jamo('ㅕ', 'yeo', 'jʌ'),
  jamo('ㅖ', 'ye', 'je'),
  jamo('ㅗ', 'o', 'o'),
  jamo('ㅘ', 'wa', 'wa'),
  jamo('ㅙ', 'wae', 'wɛ'),
  jamo('ㅚ', 'oe', 'we'),
  jamo('ㅛ', 'yo', 'jo'),
  jamo('ㅜ', 'u', 'u'),
  jamo('ㅝ', 'wo', 'wʌ'),
  jamo('ㅞ', 'we', 'we'),
  jamo('ㅟ', 'wi', 'wi'),
  jamo('ㅠ', 'yu', 'ju'),
  jamo('ㅡ', 'eu', 'ɯ'),
  jamo('ㅢ', 'ui', 'ɰi'),
  jamo('ㅣ', 'i', 'i'),
]

// Index 0 means "no final consonant". Every final is pronounced as one of seven sounds.
export const FINALS: Jamo[] = [
  jamo('', '', ''),
  jamo('ㄱ', 'k', 'k̚'),
  jamo('ㄲ', 'k', 'k̚'),
  jamo('ㄳ', 'k', 'k̚'),
  jamo('ㄴ', 'n', 'n'),
  jamo('ㄵ', 'n', 'n'),
  jamo('ㄶ', 'n', 'n'),
  jamo('ㄷ', 't', 't̚'),
  jamo('ㄹ', 'l', 'l'),
  jamo('ㄺ', 'k', 'k̚'),
  jamo('ㄻ', 'm', 'm'),
  jamo('ㄼ', 'l', 'l'),
  jamo('ㄽ', 'l', 'l'),
  jamo('ㄾ', 'l', 'l'),
  jamo('ㄿ', 'p', 'p̚'),
  jamo('ㅀ', 'l', 'l'),
  jamo('ㅁ', 'm', 'm'),
  jamo('ㅂ', 'p', 'p̚'),
  jamo('ㅄ', 'p', 'p̚'),
  jamo('ㅅ', 't', 't̚'),
  jamo('ㅆ', 't', 't̚'),
  jamo('ㅇ', 'ng', 'ŋ'),
  jamo('ㅈ', 't', 't̚'),
  jamo('ㅊ', 't', 't̚'),
  jamo('ㅋ', 'k', 'k̚'),
  jamo('ㅌ', 't', 't̚'),
  jamo('ㅍ', 'p', 'p̚'),
  jamo('ㅎ', 't', 't̚'),
]

const SYLLABLE_BASE = 0xac00

export function composeSyllable(initial: number, vowel: number, final = 0): string {
  return String.fromCharCode(SYLLABLE_BASE + (initial * VOWELS.length + vowel) * FINALS.length + final)
}

export function romanizeSyllable(initial: number, vowel: number, final = 0): string {
  return INITIALS[initial].roman + VOWELS[vowel].roman + FINALS[final].roman
}

export function syllableIpa(initial: number, vowel: number, final = 0): string {
  let onset = INITIALS[initial].ipa
  let nucleus = VOWELS[vowel].ipa

  // ㅅ and ㅆ turn into "sh" sounds before ㅣ and the y-vowels: 시 [ɕi], 샤 [ɕa].
  if ((onset === 's' || onset === 's͈') && /^[ij]/.test(nucleus)) onset = onset === 's' ? 'ɕ' : 'ɕ͈'
  // After ㅈ, ㅉ, ㅊ and a palatal ㅅ the y-glide is not heard: 쟈 sounds like 자.
  if (onset.includes('ɕ') && nucleus.startsWith('j')) nucleus = nucleus.slice(1)
  // ㅢ after a consonant is pronounced [i]: 희 [hi].
  if (onset && nucleus === 'ɰi') nucleus = 'i'

  return `[${onset}${nucleus}${FINALS[final].ipa}]`
}

export const indexOfInitial = (char: string) => INITIALS.findIndex((item) => item.char === char)
export const indexOfVowel = (char: string) => VOWELS.findIndex((item) => item.char === char)
