import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { Random } from '../random.js';
import { pickDistractors } from './distractors.js';
import { generateFlashcard, generateMultipleChoice } from './generators.js';

const firstOrder: Random = { next: () => 0.999 };

const kana = (id: string, text: string, romanization: string, extra: Partial<PracticeItem> = {}): PracticeItem => ({
  id,
  setId: 'hiragana',
  languageCode: 'ja',
  type: 'CHARACTER',
  text,
  reading: null,
  romanization,
  meaning: null,
  emoji: null,
  sortOrder: 0,
  confusableIds: [],
  ...extra,
});

const word = (id: string, languageCode: string, text: string, en: string, emoji: string): PracticeItem => ({
  id,
  setId: `${languageCode}-food`,
  languageCode,
  type: 'WORD',
  text,
  reading: null,
  romanization: null,
  meaning: { en, vi: `vi:${en}` },
  emoji,
  sortOrder: 0,
  confusableIds: [],
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
    const question = generateMultipleChoice(pool[0], { pool, locale: 'en', random: firstOrder });

    expect(question?.options).toHaveLength(4);
    const correct = question?.options?.find((option) => option.id === question.correctOptionId);
    expect(correct?.itemId).toBe('a');
    expect(question?.reveal).toMatchObject({ text: 'あ', romanization: 'a' });
    expect(['TEXT_TO_ROMANIZATION', 'ROMANIZATION_TO_TEXT']).toContain(question?.kind);
  });

  it('asks for meanings in the UI language for foreign words', () => {
    const pool = [word('apfel', 'de', 'Apfel', 'apple', '🍎'), word('brot', 'de', 'Brot', 'bread', '🍞')];
    const question = generateMultipleChoice(pool[0], { pool, locale: 'vi', random: { next: () => 0 } });
    expect(question?.kind).toBe('MEANING_TO_TEXT');
    expect(question?.prompt).toBe('vi:apple');
    expect(question?.options?.map((option) => option.text).sort()).toEqual(['Apfel', 'Brot']);
  });

  it('shows a picture instead of a meaning when the word is in the UI language', () => {
    const pool = [word('apple', 'en', 'apple', 'apple', '🍎'), word('bread', 'en', 'bread', 'bread', '🍞')];
    const question = generateMultipleChoice(pool[0], { pool, locale: 'en', random: firstOrder });
    expect(question).toMatchObject({ kind: 'EMOJI_TO_TEXT', prompt: '🍎' });
  });

  it('returns null when there is nothing to choose from', () => {
    const lonely = kana('a', 'あ', 'a');
    expect(generateMultipleChoice(lonely, { pool: [lonely], locale: 'en', random: firstOrder })).toBeNull();
  });
});

describe('generateFlashcard', () => {
  it('shows the item and reveals reading and meaning on the back', () => {
    const dog: PracticeItem = { ...word('inu', 'ja', '犬', 'dog', '🐕'), reading: 'いぬ', romanization: 'inu' };
    expect(generateFlashcard(dog, { pool: [dog], locale: 'vi', random: firstOrder })).toEqual({
      itemId: 'inu',
      kind: 'FLASHCARD',
      prompt: '犬',
      options: null,
      correctOptionId: null,
      reveal: { text: '犬', reading: 'いぬ', romanization: 'inu', meaning: 'vi:dog', emoji: '🐕' },
    });
  });
});
