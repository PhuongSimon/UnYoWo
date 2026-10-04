import { bothWays, type ItemRef, type SeedItem, type SeedRelation, type SeedSet } from '../types.js';

// Only hiragana is written by hand; katakana is derived from it (toKatakana), so the
// two scripts can never drift apart. Romaji is Hepburn; `accepted` lists the
// Kunrei/Nihon-shiki spellings learners also type (shi → si).
// IPA follows the existing web lesson tables (features/learn/content/ja).
type KanaRow = [kana: string, romaji: string, ipa: string, accepted?: string[]];

const BASIC: KanaRow[] = [
  ['あ', 'a', '[a]'], ['い', 'i', '[i]'], ['う', 'u', '[ɯ]'], ['え', 'e', '[e]'], ['お', 'o', '[o]'],
  ['か', 'ka', '[ka]'], ['き', 'ki', '[ki]'], ['く', 'ku', '[kɯ]'], ['け', 'ke', '[ke]'], ['こ', 'ko', '[ko]'],
  ['さ', 'sa', '[sa]'], ['し', 'shi', '[ɕi]', ['si']], ['す', 'su', '[sɯ]'], ['せ', 'se', '[se]'], ['そ', 'so', '[so]'],
  ['た', 'ta', '[ta]'], ['ち', 'chi', '[tɕi]', ['ti']], ['つ', 'tsu', '[tsɯ]', ['tu']], ['て', 'te', '[te]'], ['と', 'to', '[to]'],
  ['な', 'na', '[na]'], ['に', 'ni', '[ɲi]'], ['ぬ', 'nu', '[nɯ]'], ['ね', 'ne', '[ne]'], ['の', 'no', '[no]'],
  ['は', 'ha', '[ha]'], ['ひ', 'hi', '[çi]'], ['ふ', 'fu', '[ɸɯ]', ['hu']], ['へ', 'he', '[he]'], ['ほ', 'ho', '[ho]'],
  ['ま', 'ma', '[ma]'], ['み', 'mi', '[mi]'], ['む', 'mu', '[mɯ]'], ['め', 'me', '[me]'], ['も', 'mo', '[mo]'],
  ['や', 'ya', '[ja]'], ['ゆ', 'yu', '[jɯ]'], ['よ', 'yo', '[jo]'],
  ['ら', 'ra', '[ɾa]'], ['り', 'ri', '[ɾi]'], ['る', 'ru', '[ɾɯ]'], ['れ', 're', '[ɾe]'], ['ろ', 'ro', '[ɾo]'],
  ['わ', 'wa', '[ɰa]'], ['を', 'wo', '[o]', ['o']],
  ['ん', 'n', '[ɴ]'],
];

// Dakuten (゛) and handakuten (゜). The base character is not stored: it is read back
// from the Unicode decomposition (が → か + ゛), which also proves the data is right.
const DAKUTEN: KanaRow[] = [
  ['が', 'ga', '[ɡa]'], ['ぎ', 'gi', '[ɡi]'], ['ぐ', 'gu', '[ɡɯ]'], ['げ', 'ge', '[ɡe]'], ['ご', 'go', '[ɡo]'],
  ['ざ', 'za', '[za]'], ['じ', 'ji', '[dʑi]', ['zi']], ['ず', 'zu', '[zɯ]'], ['ぜ', 'ze', '[ze]'], ['ぞ', 'zo', '[zo]'],
  ['だ', 'da', '[da]'], ['ぢ', 'ji', '[dʑi]', ['di']], ['づ', 'zu', '[zɯ]', ['du']], ['で', 'de', '[de]'], ['ど', 'do', '[do]'],
  ['ば', 'ba', '[ba]'], ['び', 'bi', '[bi]'], ['ぶ', 'bu', '[bɯ]'], ['べ', 'be', '[be]'], ['ぼ', 'bo', '[bo]'],
  ['ぱ', 'pa', '[pa]'], ['ぴ', 'pi', '[pi]'], ['ぷ', 'pu', '[pɯ]'], ['ぺ', 'pe', '[pe]'], ['ぽ', 'po', '[po]'],
];

// Yōon: an i-column character + small ゃ ゅ ょ, read as one syllable.
const YOON: KanaRow[] = [
  ['きゃ', 'kya', '[kʲa]'], ['きゅ', 'kyu', '[kʲɯ]'], ['きょ', 'kyo', '[kʲo]'],
  ['しゃ', 'sha', '[ɕa]', ['sya']], ['しゅ', 'shu', '[ɕɯ]', ['syu']], ['しょ', 'sho', '[ɕo]', ['syo']],
  ['ちゃ', 'cha', '[tɕa]', ['tya']], ['ちゅ', 'chu', '[tɕɯ]', ['tyu']], ['ちょ', 'cho', '[tɕo]', ['tyo']],
  ['にゃ', 'nya', '[ɲa]'], ['にゅ', 'nyu', '[ɲɯ]'], ['にょ', 'nyo', '[ɲo]'],
  ['ひゃ', 'hya', '[ça]'], ['ひゅ', 'hyu', '[çɯ]'], ['ひょ', 'hyo', '[ço]'],
  ['みゃ', 'mya', '[mʲa]'], ['みゅ', 'myu', '[mʲɯ]'], ['みょ', 'myo', '[mʲo]'],
  ['りゃ', 'rya', '[ɾʲa]'], ['りゅ', 'ryu', '[ɾʲɯ]'], ['りょ', 'ryo', '[ɾʲo]'],
  ['ぎゃ', 'gya', '[ɡʲa]'], ['ぎゅ', 'gyu', '[ɡʲɯ]'], ['ぎょ', 'gyo', '[ɡʲo]'],
  ['じゃ', 'ja', '[dʑa]', ['zya']], ['じゅ', 'ju', '[dʑɯ]', ['zyu']], ['じょ', 'jo', '[dʑo]', ['zyo']],
  ['びゃ', 'bya', '[bʲa]'], ['びゅ', 'byu', '[bʲɯ]'], ['びょ', 'byo', '[bʲo]'],
  ['ぴゃ', 'pya', '[pʲa]'], ['ぴゅ', 'pyu', '[pʲɯ]'], ['ぴょ', 'pyo', '[pʲo]'],
];

// Look-alikes learners often mix up; used as distractors and for confusion training.
const CONFUSABLE_HIRAGANA = [
  ['さ', 'き'], ['さ', 'ち'], ['ぬ', 'め'], ['ね', 'れ'], ['ね', 'わ'], ['れ', 'わ'],
  ['る', 'ろ'], ['は', 'ほ'], ['い', 'り'], ['あ', 'お'],
];
const CONFUSABLE_KATAKANA = [
  ['シ', 'ツ'], ['ソ', 'ン'], ['シ', 'ン'], ['ソ', 'ツ'], ['ク', 'ケ'], ['ク', 'タ'],
  ['ウ', 'ワ'], ['フ', 'ワ'], ['コ', 'ユ'], ['チ', 'テ'], ['ス', 'ヌ'], ['ナ', 'メ'],
];

const VOICED_MARK = '゙';
const SEMI_VOICED_MARK = '゚';
const MARK_GLYPH = { [VOICED_MARK]: '゛', [SEMI_VOICED_MARK]: '゜' } as const;

/** Hiragana and katakana sit exactly 0x60 code points apart (あ U+3042 → ア U+30A2). */
export function toKatakana(hiragana: string): string {
  return hiragana.replace(/[ぁ-ゖ]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60));
}

/** が → { base: 'か', mark: U+3099 } */
export function splitDakuten(kana: string): { base: string; mark: typeof VOICED_MARK | typeof SEMI_VOICED_MARK } {
  const [base, mark] = [...kana.normalize('NFD')];
  if (mark !== VOICED_MARK && mark !== SEMI_VOICED_MARK) throw new Error(`${kana} has no dakuten`);
  return { base, mark };
}

type Script = 'hiragana' | 'katakana';

const SCRIPTS: { script: Script; name: string; convert: (kana: string) => string }[] = [
  { script: 'hiragana', name: 'Hiragana', convert: (kana) => kana },
  { script: 'katakana', name: 'Katakana', convert: toKatakana },
];

const ref = (set: string, text: string): ItemRef => ({ language: 'ja', set, text });

function buildScript(script: Script, name: string, convert: (kana: string) => string) {
  const slug = { basic: `${script}-basic`, dakuten: `${script}-dakuten`, yoon: `${script}-yoon` };
  const dakutenTexts = new Set(DAKUTEN.map(([kana]) => convert(kana)));
  // ぎゃ is built on ぎ, which lives in the dakuten set rather than the basic one.
  const baseRef = (char: string) => ref(dakutenTexts.has(char) ? slug.dakuten : slug.basic, char);

  const item = ([kana, romaji, ipa, accepted]: KanaRow, type: SeedItem['type'], difficulty: number): SeedItem => ({
    type,
    text: convert(kana),
    romanization: romaji,
    ipa,
    acceptedAnswers: accepted,
    difficulty,
  });

  const basic: SeedSet = {
    language: 'ja',
    slug: slug.basic,
    kind: 'ALPHABET',
    script,
    title: { en: `${name}: basic`, vi: `${name}: cơ bản` },
    items: BASIC.map((row) => item(row, 'CHARACTER', 1)),
  };

  const dakuten: SeedSet = {
    language: 'ja',
    slug: slug.dakuten,
    kind: 'ALPHABET',
    script,
    title: { en: `${name}: dakuten & handakuten`, vi: `${name}: âm đục & bán đục` },
    items: DAKUTEN.map((row): SeedItem => {
      const { base, mark } = splitDakuten(convert(row[0]));
      return {
        ...item(row, 'SYLLABLE', 2),
        components: [
          { role: 'BASE', text: base, ref: ref(slug.basic, base) },
          { role: 'MARK', text: MARK_GLYPH[mark] },
        ],
      };
    }),
  };

  const yoon: SeedSet = {
    language: 'ja',
    slug: slug.yoon,
    kind: 'ALPHABET',
    script,
    title: { en: `${name}: combinations`, vi: `${name}: âm ghép` },
    items: YOON.map((row): SeedItem => {
      const [base, small] = [...convert(row[0])];
      return {
        ...item(row, 'SYLLABLE', 3),
        components: [
          { role: 'BASE', text: base, ref: baseRef(base) },
          { role: 'SMALL', text: small },
        ],
      };
    }),
  };

  const relations = dakuten.items.map((voiced): SeedRelation => {
    const { base, mark } = splitDakuten(voiced.text);
    return {
      from: ref(slug.basic, base),
      to: ref(slug.dakuten, voiced.text),
      kind: mark === VOICED_MARK ? 'VOICED' : 'SEMI_VOICED',
    };
  });

  return { sets: [basic, dakuten, yoon], relations };
}

export function buildKana(): { sets: SeedSet[]; relations: SeedRelation[] } {
  const built = SCRIPTS.map(({ script, name, convert }) => buildScript(script, name, convert));
  const [hiragana, katakana] = built;

  // あ ↔ ア, が ↔ ガ, きゃ ↔ キャ: same position in the same set kind.
  const counterparts = hiragana.sets.flatMap((hiraSet, setIndex) => {
    const kataSet = katakana.sets[setIndex];
    return hiraSet.items.flatMap((hiraItem, itemIndex) =>
      bothWays(
        ref(hiraSet.slug, hiraItem.text),
        ref(kataSet.slug, kataSet.items[itemIndex].text),
        'SCRIPT_COUNTERPART',
      ),
    );
  });

  const confusables = [
    ...CONFUSABLE_HIRAGANA.map(([a, b]) => [ref('hiragana-basic', a), ref('hiragana-basic', b)] as const),
    ...CONFUSABLE_KATAKANA.map(([a, b]) => [ref('katakana-basic', a), ref('katakana-basic', b)] as const),
  ].flatMap(([a, b]) => bothWays(a, b, 'CONFUSABLE'));

  return {
    sets: built.flatMap((script) => script.sets),
    relations: [...built.flatMap((script) => script.relations), ...counterparts, ...confusables],
  };
}
