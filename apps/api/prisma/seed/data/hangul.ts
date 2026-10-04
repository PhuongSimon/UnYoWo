import { bothWays, type ItemRef, type SeedItem, type SeedRelation, type SeedSet } from '../types.js';

// Unicode builds every Hangul block from 19 initials × 21 vowels × 28 finals, in exactly
// these orders. Romanization is the Revised Romanization of Korean; finals use the
// representative sound they are pronounced as (ㅅ, ㅈ, ㅊ, ㅎ → t).
const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const INITIAL_ROMAN = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const VOWEL_ROMAN = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const FINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const FINAL_ROMAN = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

const SYLLABLE_BASE = 0xac00;

export function composeSyllable(initial: string, vowel: string, final = ''): string {
  const [i, v, f] = [INITIALS.indexOf(initial), VOWELS.indexOf(vowel), FINALS.indexOf(final)];
  if (i < 0 || v < 0 || f < 0) throw new Error(`Cannot compose ${initial} + ${vowel} + ${final}`);
  return String.fromCharCode(SYLLABLE_BASE + (i * VOWELS.length + v) * FINALS.length + f);
}

export function decomposeSyllable(syllable: string): { initial: string; vowel: string; final: string } {
  const offset = syllable.charCodeAt(0) - SYLLABLE_BASE;
  if (syllable.length !== 1 || offset < 0 || offset >= INITIALS.length * VOWELS.length * FINALS.length) {
    throw new Error(`${syllable} is not a Hangul syllable`);
  }
  return {
    initial: INITIALS[Math.floor(offset / (VOWELS.length * FINALS.length))],
    vowel: VOWELS[Math.floor((offset % (VOWELS.length * FINALS.length)) / FINALS.length)],
    final: FINALS[offset % FINALS.length],
  };
}

export function romanizeSyllable(syllable: string): string {
  const { initial, vowel, final } = decomposeSyllable(syllable);
  return INITIAL_ROMAN[INITIALS.indexOf(initial)] + VOWEL_ROMAN[VOWELS.indexOf(vowel)] + FINAL_ROMAN[FINALS.indexOf(final)];
}

// [jamo, romanization, IPA, letter name]. IPA follows the web lesson cards (features/learn/content/ko).
type JamoRow = [jamo: string, roman: string, ipa: string, name?: string];

const CONSONANTS: JamoRow[] = [
  ['ㄱ', 'g', '[k] ~ [g]', '기역'], ['ㄴ', 'n', '[n]', '니은'], ['ㄷ', 'd', '[t] ~ [d]', '디귿'],
  ['ㄹ', 'r', '[ɾ] ~ [l]', '리을'], ['ㅁ', 'm', '[m]', '미음'], ['ㅂ', 'b', '[p] ~ [b]', '비읍'],
  ['ㅅ', 's', '[s] ~ [ɕ]', '시옷'], ['ㅇ', 'ng', '∅ ~ [ŋ]', '이응'], ['ㅈ', 'j', '[tɕ] ~ [dʑ]', '지읒'],
  ['ㅊ', 'ch', '[tɕʰ]', '치읓'], ['ㅋ', 'k', '[kʰ]', '키읔'], ['ㅌ', 't', '[tʰ]', '티읕'],
  ['ㅍ', 'p', '[pʰ]', '피읖'], ['ㅎ', 'h', '[h]', '히읗'],
];

const DOUBLE_CONSONANTS: JamoRow[] = [
  ['ㄲ', 'kk', '[k͈]', '쌍기역'], ['ㄸ', 'tt', '[t͈]', '쌍디귿'], ['ㅃ', 'pp', '[p͈]', '쌍비읍'],
  ['ㅆ', 'ss', '[s͈]', '쌍시옷'], ['ㅉ', 'jj', '[t͈ɕ]', '쌍지읒'],
];

const BASIC_VOWELS: JamoRow[] = [
  ['ㅏ', 'a', '[a]'], ['ㅑ', 'ya', '[ja]'], ['ㅓ', 'eo', '[ʌ]'], ['ㅕ', 'yeo', '[jʌ]'], ['ㅗ', 'o', '[o]'],
  ['ㅛ', 'yo', '[jo]'], ['ㅜ', 'u', '[u]'], ['ㅠ', 'yu', '[ju]'], ['ㅡ', 'eu', '[ɯ]'], ['ㅣ', 'i', '[i]'],
];

// Each compound vowel is written by joining the two vowels in `parts`.
type CompoundVowelRow = [jamo: string, roman: string, ipa: string, parts: [string, string]];

const COMPOUND_VOWELS: CompoundVowelRow[] = [
  ['ㅐ', 'ae', '[ɛ]', ['ㅏ', 'ㅣ']], ['ㅒ', 'yae', '[jɛ]', ['ㅑ', 'ㅣ']], ['ㅔ', 'e', '[e]', ['ㅓ', 'ㅣ']],
  ['ㅖ', 'ye', '[je]', ['ㅕ', 'ㅣ']], ['ㅘ', 'wa', '[wa]', ['ㅗ', 'ㅏ']], ['ㅙ', 'wae', '[wɛ]', ['ㅗ', 'ㅐ']],
  ['ㅚ', 'oe', '[we]', ['ㅗ', 'ㅣ']], ['ㅝ', 'wo', '[wʌ]', ['ㅜ', 'ㅓ']], ['ㅞ', 'we', '[we]', ['ㅜ', 'ㅔ']],
  ['ㅟ', 'wi', '[wi]', ['ㅜ', 'ㅣ']], ['ㅢ', 'ui', '[ɰi]', ['ㅡ', 'ㅣ']],
];

// Common one-syllable blocks with a final consonant (batchim), covering all 7 final sounds.
const BATCHIM_SYLLABLES = [
  '곡', '국', '책', '밖', '한', '산', '문', '눈', '돈', '옷', '낮', '꽃',
  '물', '말', '길', '일', '김', '밤', '몸', '곰', '밥', '집', '강', '방', '공',
];

const CONFUSABLE_PAIRS = [
  ['ㅓ', 'ㅗ'], ['ㅏ', 'ㅓ'], ['ㅗ', 'ㅜ'], ['ㅜ', 'ㅡ'], ['ㅕ', 'ㅛ'], ['ㅐ', 'ㅔ'], ['ㅒ', 'ㅖ'],
  ['ㅙ', 'ㅚ'], ['ㅙ', 'ㅞ'], ['ㅚ', 'ㅞ'],
  ['ㄱ', 'ㅋ'], ['ㄷ', 'ㅌ'], ['ㅂ', 'ㅍ'], ['ㅈ', 'ㅊ'],
  ['ㄱ', 'ㄲ'], ['ㄷ', 'ㄸ'], ['ㅂ', 'ㅃ'], ['ㅅ', 'ㅆ'], ['ㅈ', 'ㅉ'],
];

const SLUG = {
  consonants: 'hangul-consonants',
  doubleConsonants: 'hangul-double-consonants',
  vowels: 'hangul-vowels',
  compoundVowels: 'hangul-compound-vowels',
  syllables: 'hangul-syllables',
  batchim: 'hangul-batchim',
} as const;

function jamoItem([jamo, roman, ipa, name]: JamoRow, difficulty: number): SeedItem {
  return {
    type: 'CHARACTER',
    text: jamo,
    romanization: roman,
    ipa,
    // ㄹ is r between vowels and l at the end of a syllable; both spellings are correct.
    acceptedAnswers: jamo === 'ㄹ' ? ['l'] : undefined,
    attributes: name ? { name } : undefined,
    difficulty,
  };
}

export function buildHangul(): { sets: SeedSet[]; relations: SeedRelation[] } {
  const setOfJamo = new Map<string, string>([
    ...CONSONANTS.map(([jamo]) => [jamo, SLUG.consonants] as const),
    ...DOUBLE_CONSONANTS.map(([jamo]) => [jamo, SLUG.doubleConsonants] as const),
    ...BASIC_VOWELS.map(([jamo]) => [jamo, SLUG.vowels] as const),
    ...COMPOUND_VOWELS.map(([jamo]) => [jamo, SLUG.compoundVowels] as const),
  ]);
  const jamoRef = (jamo: string): ItemRef => {
    const set = setOfJamo.get(jamo);
    if (!set) throw new Error(`No learning item for jamo ${jamo}`);
    return { language: 'ko', set, text: jamo };
  };

  const syllableItem = (syllable: string, difficulty: number): SeedItem => {
    const { initial, vowel, final } = decomposeSyllable(syllable);
    return {
      type: 'SYLLABLE',
      text: syllable,
      romanization: romanizeSyllable(syllable),
      difficulty,
      components: [
        { role: 'INITIAL', text: initial, ref: jamoRef(initial) },
        { role: 'VOWEL', text: vowel, ref: jamoRef(vowel) },
        ...(final ? [{ role: 'FINAL' as const, text: final, ref: jamoRef(final) }] : []),
      ],
    };
  };

  const alphabetSet = (slug: string, title: SeedSet['title'], items: SeedItem[]): SeedSet => ({
    language: 'ko',
    slug,
    kind: 'ALPHABET',
    script: 'hangul',
    title,
    items,
  });

  const sets: SeedSet[] = [
    alphabetSet(
      SLUG.consonants,
      { en: 'Hangul: consonants', vi: 'Hangul: phụ âm' },
      CONSONANTS.map((row) => jamoItem(row, 1)),
    ),
    alphabetSet(
      SLUG.vowels,
      { en: 'Hangul: vowels', vi: 'Hangul: nguyên âm' },
      BASIC_VOWELS.map((row) => jamoItem(row, 1)),
    ),
    alphabetSet(
      SLUG.doubleConsonants,
      { en: 'Hangul: double consonants', vi: 'Hangul: phụ âm đôi' },
      DOUBLE_CONSONANTS.map((row) => jamoItem(row, 2)),
    ),
    alphabetSet(
      SLUG.compoundVowels,
      { en: 'Hangul: compound vowels', vi: 'Hangul: nguyên âm ghép' },
      COMPOUND_VOWELS.map(([jamo, roman, ipa, parts]) => ({
        ...jamoItem([jamo, roman, ipa], 2),
        components: parts.map((part) => ({ role: 'VOWEL' as const, text: part, ref: jamoRef(part) })),
      })),
    ),
    alphabetSet(
      SLUG.syllables,
      { en: 'Hangul: basic syllables', vi: 'Hangul: âm tiết cơ bản' },
      CONSONANTS.flatMap(([consonant]) =>
        BASIC_VOWELS.map(([vowel]) => syllableItem(composeSyllable(consonant, vowel), 2)),
      ),
    ),
    alphabetSet(
      SLUG.batchim,
      { en: 'Hangul: final consonants (batchim)', vi: 'Hangul: phụ âm cuối (batchim)' },
      BATCHIM_SYLLABLES.map((syllable) => syllableItem(syllable, 3)),
    ),
  ];

  const relations = CONFUSABLE_PAIRS.flatMap(([a, b]) => bothWays(jamoRef(a), jamoRef(b), 'CONFUSABLE'));

  return { sets, relations };
}
