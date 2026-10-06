import type { SeedLevel } from '../types.js';
import { buildWordListSets, MAX_PART_SIZE, rowToItem, splitIntoParts } from './word-lists.js';

const level: SeedLevel = { language: 'de', code: 'A1', framework: 'CEFR', difficulty: 1, title: { en: 'A1', vi: 'A1' } };
const list = { language: 'de', level: 'A1', file: 'de/a1.csv' };
const row = (text: string, category: string, extra: Record<string, string> = {}) => ({
  text,
  pos: 'noun',
  category,
  meaning_vi: `vi:${text}`,
  meaning_en: '',
  source: 'goethe',
  ...extra,
});

describe('rowToItem', () => {
  it('turns extra columns into camelCase attributes and adds the German gender', () => {
    const item = rowToItem(row('Apfel', 'food', { article: 'der', plural: 'Äpfel', han_viet: '' }), 1, 'test');
    expect(item).toEqual({
      type: 'WORD',
      text: 'Apfel',
      meaning: { vi: 'vi:Apfel' },
      partOfSpeech: 'NOUN',
      source: 'goethe',
      attributes: { article: 'der', plural: 'Äpfel', gender: 'masculine' },
      difficulty: 1,
    });
  });

  it('splits accepted answers and keeps readings and romanization', () => {
    const item = rowToItem({ text: '学校', reading: 'がっこう', romanization: 'gakkō', accepted: 'gakkou|gakko', pos: 'noun', meaning_vi: 'trường học', source: 'jlpt-waller' }, 1, 'test');
    expect(item).toMatchObject({ reading: 'がっこう', romanization: 'gakkō', acceptedAnswers: ['gakkou', 'gakko'] });
  });

  it('names the row when a value is invalid', () => {
    expect(() => rowToItem(row('Apfel', 'food', { pos: 'nown' }), 1, 'de/a1.csv row 2')).toThrow('de/a1.csv row 2: unknown part of speech "nown"');
    expect(() => rowToItem(row('Apfel', 'food', { source: 'wiki' }), 1, 'x')).toThrow('unknown source');
    expect(() => rowToItem(row('Apfel', 'food', { article: 'den' }), 1, 'x')).toThrow('unknown article');
    expect(() => rowToItem(row('', 'food'), 1, 'x')).toThrow('empty text');
  });
});

describe('splitIntoParts', () => {
  it('uses the fewest parts and sizes them evenly', () => {
    const sizes = (n: number) => splitIntoParts(Array.from({ length: n }, (_, i) => i), 30).map((part) => part.length);
    expect(sizes(30)).toEqual([30]);
    expect(sizes(31)).toEqual([16, 15]);
    expect(sizes(75)).toEqual([25, 25, 25]);
  });
});

describe('buildWordListSets', () => {
  it('groups rows by topic in topic order, numbering every part', () => {
    const rows = [row('Brot', 'food'), row('Hund', 'animals'), row('Apfel', 'food')];
    const sets = buildWordListSets(list, rows, level);
    expect(sets.map((s) => [s.slug, s.items.map((i) => i.text)])).toEqual([
      ['a1-food-1', ['Brot', 'Apfel']],
      ['a1-animals-1', ['Hund']],
    ]);
    expect(sets[0]).toMatchObject({ language: 'de', level: 'A1', part: 1, category: 'food', title: { vi: 'Đồ ăn & đồ uống' } });
  });

  it('adds the part number to the title only when a topic has several parts', () => {
    const rows = Array.from({ length: MAX_PART_SIZE + 1 }, (_, i) => row(`Wort${i}`, 'food'));
    expect(buildWordListSets(list, rows, level).map((s) => [s.slug, s.title.en, s.items.length])).toEqual([
      ['a1-food-1', 'Food & drink 1', 16],
      ['a1-food-2', 'Food & drink 2', 15],
    ]);
  });

  it('rejects an unknown topic', () => {
    expect(() => buildWordListSets(list, [row('Ding', 'stuff')], level)).toThrow('row 2 (Ding): unknown category "stuff"');
  });
});
