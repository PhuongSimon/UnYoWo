import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { Random } from '../random.js';
import { pickDistractors } from './distractors.js';
import { generateFlashcard, generateMatchingBoard, generateMultipleChoice, generateTyping } from './generators.js';

const firstOrder: Random = { next: () => 0.999 };
const context = (pool: PracticeItem[], locale: 'en' | 'vi' = 'en', random: Random = firstOrder) => ({ pool, locale, random, count: 6 });

const kana = (id: string, text: string, romanization: string, extra: Partial<PracticeItem> = {}): PracticeItem => ({
  id,
  setId: 'hiragana',
  languageCode: 'ja',
  type: 'CHARACTER',
  text,
  reading: null,
  romanization,
  acceptedAnswers: [],
  meaning: null,
  emoji: null,
  attributes: null,
  sortOrder: 0,
  confusableIds: [],
  ...extra,
});

const word = (id: string, languageCode: string, text: string, en: string, emoji: string, extra: Partial<PracticeItem> = {}): PracticeItem => ({
  id,
  setId: `${languageCode}-food`,
  languageCode,
  type: 'WORD',
  text,
  reading: null,
  romanization: null,
  acceptedAnswers: [],
  meaning: { en, vi: `vi:${en}` },
  emoji,
  attributes: null,
  sortOrder: 0,
  confusableIds: [],
  ...extra,
});

describe('pickDistractors', () => {
  const nu = kana('nu', 'ぬ', 'nu', { confusableIds: ['me'] });
  const pool = [nu, kana('na', 'な', 'na'), kana('ne', 'ね', 'ne'), kana('me', 'め', 'me'), kana('no', 'の', 'no')];

  it('puts curated look-alikes first', () => {
    const picked = pickDistractors(nu, pool, 'TEXT_TO_ROMANIZATION', 'en', 3, firstOrder);
    expect(picked[0].text).toBe('め');
    expect(picked).toHaveLength(3);
    expect(picked.map((item) => item.id)).not.toContain('nu');
  });

  it('never offers a second right answer', () => {
    const ji = kana('ji', 'じ', 'ji', { setId: 'dakuten' });
    const dji = kana('dji', 'ぢ', 'ji', { setId: 'dakuten' });
    const zu = kana('zu', 'ず', 'zu', { setId: 'dakuten' });

    expect(pickDistractors(ji, [ji, dji, zu], 'TEXT_TO_ROMANIZATION', 'en', 3, firstOrder).map((i) => i.id)).toEqual(['zu']);
    // Shown "ji", both じ and ぢ would be right, so ぢ cannot be a wrong option either.
    expect(pickDistractors(ji, [ji, dji, zu], 'ROMANIZATION_TO_TEXT', 'en', 3, firstOrder).map((i) => i.id)).toEqual(['zu']);
  });
});

describe('generateMultipleChoice', () => {
  it('stores which option is right without changing the option texts', () => {
    const pool = [kana('a', 'あ', 'a'), kana('i', 'い', 'i'), kana('u', 'う', 'u'), kana('e', 'え', 'e')];
    const question = generateMultipleChoice(pool[0], context(pool));

    expect(question?.options).toHaveLength(4);
    const correct = question?.options?.find((option) => option.id === question.correctOptionId);
    expect(correct?.itemId).toBe('a');
    expect(question?.reveal).toMatchObject({ text: 'あ', romanization: 'a' });
    expect(['TEXT_TO_ROMANIZATION', 'ROMANIZATION_TO_TEXT']).toContain(question?.kind);
  });

  it('asks for meanings in the UI language for foreign words', () => {
    const pool = [word('apfel', 'de', 'Apfel', 'apple', '🍎'), word('brot', 'de', 'Brot', 'bread', '🍞')];
    const question = generateMultipleChoice(pool[0], context(pool, 'vi', { next: () => 0 }));
    expect(question?.kind).toBe('MEANING_TO_TEXT');
    expect(question?.prompt).toBe('vi:apple');
    expect(question?.options?.map((option) => option.text).sort()).toEqual(['Apfel', 'Brot']);
  });

  it('shows a picture instead of a meaning when the word is in the UI language', () => {
    const pool = [word('apple', 'en', 'apple', 'apple', '🍎'), word('bread', 'en', 'bread', 'bread', '🍞')];
    expect(generateMultipleChoice(pool[0], context(pool))).toMatchObject({ kind: 'EMOJI_TO_TEXT', prompt: '🍎' });
  });

  it('returns null when there is nothing to choose from', () => {
    const lonely = kana('a', 'あ', 'a');
    expect(generateMultipleChoice(lonely, context([lonely]))).toBeNull();
  });
});

describe('generateFlashcard', () => {
  it('shows the item and reveals reading and meaning on the back', () => {
    const dog = word('inu', 'ja', '犬', 'dog', '🐕', { reading: 'いぬ', romanization: 'inu' });
    expect(generateFlashcard(dog, context([dog], 'vi'))).toEqual({
      itemId: 'inu',
      kind: 'FLASHCARD',
      prompt: '犬',
      options: null,
      correctOptionId: null,
      acceptedAnswers: [],
      reveal: { text: '犬', reading: 'いぬ', romanization: 'inu', meaning: 'vi:dog', emoji: '🐕' },
    });
  });
});

describe('generateTyping', () => {
  it('asks to type the romanization of a character, accepting alternative spellings', () => {
    const shi = kana('shi', 'し', 'shi', { acceptedAnswers: ['si'] });
    expect(generateTyping(shi, context([shi]))).toMatchObject({
      kind: 'TEXT_TO_ROMANIZATION',
      prompt: 'し',
      options: null,
      acceptedAnswers: ['shi', 'si'],
    });
  });

  it('accepts a German noun with or without its article', () => {
    const apfel = word('apfel', 'de', 'Apfel', 'apple', '🍎', { attributes: { article: 'der', gender: 'masculine' } });
    expect(generateTyping(apfel, context([apfel], 'vi'))).toMatchObject({
      kind: 'MEANING_TO_TEXT',
      prompt: 'vi:apple',
      acceptedAnswers: ['Apfel', 'der Apfel'],
    });
  });

  it('accepts a Japanese word in kanji, kana or romaji', () => {
    const school = word('gakkou', 'ja', '学校', 'school', '🏫', {
      reading: 'がっこう',
      romanization: 'gakkō',
      acceptedAnswers: ['gakkou'],
    });
    expect(generateTyping(school, context([school], 'vi'))?.acceptedAnswers).toEqual(['学校', 'がっこう', 'gakkō', 'gakkou']);
  });
});

describe('generateMatchingBoard', () => {
  it('pairs every prompt with exactly one card and keeps both sides unique', () => {
    const items = [
      kana('ji', 'じ', 'ji'),
      kana('dji', 'ぢ', 'ji'),
      kana('zu', 'ず', 'zu'),
      kana('ze', 'ぜ', 'ze'),
      kana('zo', 'ぞ', 'zo'),
    ];
    const board = generateMatchingBoard(items, { ...context(items), count: 6 });

    expect(board.map((q) => q.prompt)).toEqual(['じ', 'ず', 'ぜ', 'ぞ']);
    for (const question of board) {
      expect(question.kind).toBe('TEXT_TO_ROMANIZATION');
      expect(question.options).toBe(board[0].options);
      expect(question.options?.find((card) => card.id === question.correctOptionId)?.itemId).toBe(question.itemId);
    }
  });

  it('stops at the board size and needs at least two pairs', () => {
    const items = ['a', 'i', 'u', 'e', 'o'].map((r) => kana(r, r.toUpperCase(), r));
    expect(generateMatchingBoard(items, { ...context(items), count: 3 })).toHaveLength(3);
    expect(generateMatchingBoard(items.slice(0, 1), context(items))).toEqual([]);
  });
});
