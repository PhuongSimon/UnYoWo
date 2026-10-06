import { buildCatalog, refKey } from './catalog.js';
import { composeSyllable, decomposeSyllable, romanizeSyllable } from './data/hangul.js';
import { splitDakuten, toKatakana } from './data/kana.js';
import { VOCABULARY_LANGUAGES } from './data/vocabulary.js';
import { CATEGORIES, LEVELS } from './data/vocabulary-meta.js';
import { WORD_LISTS } from './data/word-lists.js';

const catalog = buildCatalog();
const findSet = (language: string, slug: string) => {
  const set = catalog.sets.find((s) => s.language === language && s.slug === slug);
  if (!set) throw new Error(`missing set ${language}/${slug}`);
  return set;
};
const findItem = (language: string, slug: string, text: string) => {
  const item = findSet(language, slug).items.find((i) => i.text === text);
  if (!item) throw new Error(`missing item ${text}`);
  return item;
};

describe('seed catalog', () => {
  it('has unique set slugs per language and unique item texts per set', () => {
    const setKeys = catalog.sets.map((s) => `${s.language}/${s.slug}`);
    expect(new Set(setKeys).size).toBe(setKeys.length);

    for (const set of catalog.sets) {
      const texts = set.items.map((i) => i.text);
      expect(new Set(texts).size, `${set.language}/${set.slug}`).toBe(texts.length);
    }
  });

  it('only references items, concepts and languages that exist', () => {
    const items = new Set(catalog.sets.flatMap((s) => s.items.map((i) => refKey({ language: s.language, set: s.slug, text: i.text }))));
    const concepts = new Set(catalog.concepts.map((c) => c.slug));
    const languages = new Set(catalog.languages.map((l) => l.code));

    for (const set of catalog.sets) {
      expect(languages.has(set.language)).toBe(true);
      for (const item of set.items) {
        if (item.concept) expect(concepts.has(item.concept)).toBe(true);
        for (const component of item.components ?? []) {
          if (component.ref) expect(items.has(refKey(component.ref)), refKey(component.ref)).toBe(true);
        }
      }
    }
    for (const { from, to } of catalog.relations) {
      expect(items.has(refKey(from)), refKey(from)).toBe(true);
      expect(items.has(refKey(to)), refKey(to)).toBe(true);
    }
  });
});

describe('Japanese kana', () => {
  it.each(['hiragana', 'katakana'])('has the full %s set: 46 basic, 25 dakuten, 33 combinations', (script) => {
    expect(findSet('ja', `${script}-basic`).items).toHaveLength(46);
    expect(findSet('ja', `${script}-dakuten`).items).toHaveLength(25);
    expect(findSet('ja', `${script}-yoon`).items).toHaveLength(33);
  });

  it('derives katakana from hiragana', () => {
    expect(toKatakana('きゃ')).toBe('キャ');
    expect(toKatakana('を')).toBe('ヲ');
    expect(toKatakana('ん')).toBe('ン');
    expect(findSet('ja', 'katakana-basic').items.map((i) => i.text).slice(0, 5)).toEqual(['ア', 'イ', 'ウ', 'エ', 'オ']);
  });

  it('builds every dakuten character from its base plus the combining mark', () => {
    for (const script of ['hiragana', 'katakana']) {
      for (const item of findSet('ja', `${script}-dakuten`).items) {
        const [base, mark] = item.components ?? [];
        expect(base.role).toBe('BASE');
        expect(mark.role).toBe('MARK');
        const combining = mark.text === '゛' ? '゙' : '゚';
        expect((base.text + combining).normalize('NFC')).toBe(item.text);
      }
    }
    expect(splitDakuten('ぱ').base).toBe('は');
  });

  it('builds combinations from an i-column base and a small ゃ ゅ ょ', () => {
    const kya = findItem('ja', 'hiragana-yoon', 'きゃ');
    expect(kya.components?.map((c) => [c.role, c.text])).toEqual([['BASE', 'き'], ['SMALL', 'ゃ']]);
    expect(kya.components?.[0].ref).toEqual({ language: 'ja', set: 'hiragana-basic', text: 'き' });

    const gya = findItem('ja', 'katakana-yoon', 'ギャ');
    expect(gya.components?.[0].ref).toEqual({ language: 'ja', set: 'katakana-dakuten', text: 'ギ' });
  });

  it('accepts the Kunrei spelling as an alternative romanization', () => {
    expect(findItem('ja', 'hiragana-basic', 'し')).toMatchObject({ romanization: 'shi', acceptedAnswers: ['si'] });
    expect(findItem('ja', 'katakana-basic', 'ツ')).toMatchObject({ romanization: 'tsu', acceptedAnswers: ['tu'] });
  });

  it('links counterparts both ways and voiced variants from the base', () => {
    const has = (from: string, to: string, kind: string) =>
      catalog.relations.some((r) => r.from.text === from && r.to.text === to && r.kind === kind);

    expect(has('あ', 'ア', 'SCRIPT_COUNTERPART')).toBe(true);
    expect(has('ア', 'あ', 'SCRIPT_COUNTERPART')).toBe(true);
    expect(has('か', 'が', 'VOICED')).toBe(true);
    expect(has('は', 'ぱ', 'SEMI_VOICED')).toBe(true);
    expect(has('シ', 'ツ', 'CONFUSABLE') && has('ツ', 'シ', 'CONFUSABLE')).toBe(true);
  });
});

describe('Korean Hangul', () => {
  it('has 14 consonants, 5 double consonants, 10 vowels and 11 compound vowels', () => {
    expect(findSet('ko', 'hangul-consonants').items).toHaveLength(14);
    expect(findSet('ko', 'hangul-double-consonants').items).toHaveLength(5);
    expect(findSet('ko', 'hangul-vowels').items).toHaveLength(10);
    expect(findSet('ko', 'hangul-compound-vowels').items).toHaveLength(11);
  });

  it('composes and decomposes syllable blocks', () => {
    expect(composeSyllable('ㄱ', 'ㅏ')).toBe('가');
    expect(composeSyllable('ㄱ', 'ㅗ', 'ㄱ')).toBe('곡');
    expect(composeSyllable('ㅎ', 'ㅏ', 'ㄴ')).toBe('한');
    expect(decomposeSyllable('꽃')).toEqual({ initial: 'ㄲ', vowel: 'ㅗ', final: 'ㅊ' });
  });

  it('romanizes with the Revised Romanization', () => {
    expect(romanizeSyllable('가')).toBe('ga');
    expect(romanizeSyllable('시')).toBe('si');
    expect(romanizeSyllable('아')).toBe('a');
    expect(romanizeSyllable('책')).toBe('chaek');
    expect(romanizeSyllable('꽃')).toBe('kkot');
  });

  it('builds 140 basic syllables, each keeping its initial and vowel', () => {
    const syllables = findSet('ko', 'hangul-syllables').items;
    expect(syllables).toHaveLength(14 * 10);
    for (const item of syllables) {
      const [initial, vowel] = item.components ?? [];
      expect(composeSyllable(initial.text, vowel.text)).toBe(item.text);
    }
  });

  it('keeps the three parts of a syllable with a final consonant', () => {
    expect(findItem('ko', 'hangul-batchim', '곡').components).toEqual([
      { role: 'INITIAL', text: 'ㄱ', ref: { language: 'ko', set: 'hangul-consonants', text: 'ㄱ' } },
      { role: 'VOWEL', text: 'ㅗ', ref: { language: 'ko', set: 'hangul-vowels', text: 'ㅗ' } },
      { role: 'FINAL', text: 'ㄱ', ref: { language: 'ko', set: 'hangul-consonants', text: 'ㄱ' } },
    ]);
  });

  it('gives every jamo a spoken form for listening games', () => {
    expect(findItem('ko', 'hangul-consonants', 'ㄱ').attributes).toEqual({ name: '기역', speak: '기역' });
    expect(findItem('ko', 'hangul-vowels', 'ㅏ').attributes).toEqual({ speak: '아' });
    expect(findItem('ko', 'hangul-compound-vowels', 'ㅘ').attributes).toEqual({ speak: '와' });
  });

  it('records which two vowels form each compound vowel', () => {
    expect(findItem('ko', 'hangul-compound-vowels', 'ㅘ').components?.map((c) => c.text)).toEqual(['ㅗ', 'ㅏ']);
  });
});

describe('vocabulary', () => {
  it('has every starter concept in every study language', () => {
    for (const language of VOCABULARY_LANGUAGES) {
      const starter = catalog.sets.filter((s) => s.language === language && s.kind === 'VOCABULARY' && !s.level);
      const concepts = starter.flatMap((s) => s.items.map((i) => i.concept));
      expect(new Set(concepts)).toEqual(new Set(catalog.concepts.map((c) => c.slug)));
    }
    expect(catalog.concepts.length).toBeGreaterThanOrEqual(60);
  });

  it('gives every Japanese word written with kanji a kana reading', () => {
    const kanji = /[一-鿿]/;
    for (const set of catalog.sets.filter((s) => s.language === 'ja' && s.kind === 'VOCABULARY')) {
      for (const item of set.items) {
        // Loanword compounds keep their katakana part: ローマ字 → ローマじ, 消しゴム → けしゴム.
        if (kanji.test(item.text)) expect(item.reading, item.text).toMatch(/^[ぁ-ゖァ-ヺー]+$/);
        expect(item.romanization, item.text).toBeTruthy();
      }
    }
  });

  it('gives every Korean word a romanization and every concept both glosses', () => {
    for (const set of catalog.sets.filter((s) => s.language === 'ko' && s.kind === 'VOCABULARY')) {
      for (const item of set.items) expect(item.romanization, item.text).toMatch(/^[a-z' -]+$/);
    }
    for (const concept of catalog.concepts) {
      expect(concept.gloss.en.length).toBeGreaterThan(0);
      expect(concept.gloss.vi.length).toBeGreaterThan(0);
    }
  });

  it('stores German nouns without the article, keeping it as an attribute', () => {
    expect(findItem('de', 'vocab-food', 'Apfel').attributes).toEqual({ article: 'der', gender: 'masculine' });
    expect(findItem('de', 'vocab-verbs', 'essen').attributes).toBeUndefined();
  });
});

describe('word lists', () => {
  const wordListSets = catalog.sets.filter((s) => s.level);

  it('has a word list for every level, and every set belongs to a known level and topic', () => {
    expect(WORD_LISTS.map((list) => `${list.language}/${list.level}`)).toEqual(LEVELS.map((level) => `${level.language}/${level.code}`));
    const levels = new Set(LEVELS.map((level) => `${level.language}/${level.code}`));
    const topics = new Set(CATEGORIES.map((category) => category.slug));
    for (const set of wordListSets) {
      expect(levels.has(`${set.language}/${set.level}`), set.slug).toBe(true);
      expect(topics.has(set.category ?? ''), set.slug).toBe(true);
    }
  });

  it('makes one set per topic and level, each holding each text once', () => {
    const keys = wordListSets.map((set) => `${set.language}/${set.level}/${set.category}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const set of wordListSets) {
      expect(set.items.length, set.slug).toBeGreaterThan(0);
      expect(set.slug).toBe(`${set.level?.toLowerCase()}-${set.category}`);
      // The database allows a text once per set (learning_items set_id + text is unique).
      const texts = set.items.map((item) => item.text);
      expect(new Set(texts).size, set.slug).toBe(texts.length);
    }
  });

  it('gives every word a Vietnamese meaning, a part of speech and a source', () => {
    for (const set of wordListSets) {
      for (const item of set.items) {
        expect(item.meaning?.vi, `${set.slug}/${item.text}`).toBeTruthy();
        expect(item.partOfSpeech, `${set.slug}/${item.text}`).toBeTruthy();
        expect(item.source, `${set.slug}/${item.text}`).toBeTruthy();
      }
    }
  });

  it('never lists the same word twice in one topic of a level', () => {
    for (const { language, level } of WORD_LISTS) {
      const keys = wordListSets
        .filter((s) => s.language === language && s.level === level)
        .flatMap((s) => s.items.map((i) => [i.text, i.reading ?? '', i.partOfSpeech, s.category].join('|')));
      const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
      expect(duplicates, `${language}/${level}`).toEqual([]);
    }
  });
});
