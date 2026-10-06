import { readFileSync } from 'node:fs';
import type { PartOfSpeech } from '../../../src/generated/prisma/enums.js';
import { parseCsv } from '../csv.js';
import type { SeedCategory, SeedItem, SeedLevel, SeedSet } from '../types.js';
import { CATEGORIES, LEVELS, SOURCES } from './vocabulary-meta.js';

// Exam-level vocabulary lives in CSV files (prisma/seed/vocabulary/<language>/<level>.csv) so it can
// be edited in a spreadsheet. Each row is one word; the columns every file shares are listed in
// CORE_COLUMNS, and any other column becomes an attribute of the item (han_viet → hanViet).
// Rows keep their file order inside a topic, and each topic of a level is one set.

export interface WordList {
  language: string;
  level: string;
  file: string;
}

export const WORD_LISTS: WordList[] = [
  { language: 'en', level: 'B1', file: 'en/b1.csv' },
  { language: 'en', level: 'B2', file: 'en/b2.csv' },
  { language: 'de', level: 'A1', file: 'de/a1.csv' },
  { language: 'de', level: 'A2', file: 'de/a2.csv' },
  { language: 'ja', level: 'N5', file: 'ja/n5.csv' },
  { language: 'ja', level: 'N4', file: 'ja/n4.csv' },
  { language: 'ko', level: 'TOPIK1', file: 'ko/topik1.csv' },
];

const CORE_COLUMNS = new Set(['text', 'reading', 'romanization', 'accepted', 'pos', 'category', 'meaning_vi', 'meaning_en', 'source', 'note']);

const PART_OF_SPEECH: Record<string, PartOfSpeech> = {
  noun: 'NOUN',
  verb: 'VERB',
  adjective: 'ADJECTIVE',
  adverb: 'ADVERB',
  pronoun: 'PRONOUN',
  determiner: 'DETERMINER',
  numeral: 'NUMERAL',
  counter: 'COUNTER',
  preposition: 'PREPOSITION',
  conjunction: 'CONJUNCTION',
  particle: 'PARTICLE',
  interjection: 'INTERJECTION',
  phrase: 'PHRASE',
  affix: 'AFFIX',
};

const GENDER: Record<string, string> = { der: 'masculine', die: 'feminine', das: 'neuter' };
const SOURCE_IDS = new Set(SOURCES.map((source) => source.id));

const camelCase = (column: string) => column.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** One CSV row → one item. Throws on values the database would reject, naming the row. */
export function rowToItem(row: Record<string, string>, difficulty: number, where: string): SeedItem {
  const fail = (problem: string) => {
    throw new Error(`${where}: ${problem}`);
  };
  if (!row.text) fail('empty text');

  const partOfSpeech = row.pos ? PART_OF_SPEECH[row.pos] : undefined;
  if (row.pos && !partOfSpeech) fail(`unknown part of speech "${row.pos}"`);
  if (row.source && !SOURCE_IDS.has(row.source)) fail(`unknown source "${row.source}"`);

  const meaning = {
    ...(row.meaning_vi ? { vi: row.meaning_vi } : {}),
    ...(row.meaning_en ? { en: row.meaning_en } : {}),
  };
  const attributes = Object.fromEntries(
    Object.entries(row).filter(([column, value]) => !CORE_COLUMNS.has(column) && value !== '').map(([column, value]) => [camelCase(column), value]),
  );
  if (attributes.article) {
    if (!GENDER[attributes.article]) fail(`unknown article "${attributes.article}"`);
    attributes.gender = GENDER[attributes.article];
  }

  return {
    type: 'WORD',
    text: row.text,
    ...(row.reading ? { reading: row.reading } : {}),
    ...(row.romanization ? { romanization: row.romanization } : {}),
    ...(row.accepted ? { acceptedAnswers: row.accepted.split('|').map((answer) => answer.trim()).filter(Boolean) } : {}),
    ...(Object.keys(meaning).length > 0 ? { meaning } : {}),
    ...(partOfSpeech ? { partOfSpeech } : {}),
    ...(row.source ? { source: row.source } : {}),
    ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
    difficulty,
  };
}

/**
 * The sets of one word list: one per topic, in CATEGORIES order. A big topic stays whole (up to ~280
 * words): a game session takes at most 15 words in learning order, and the word list pages them.
 */
export function buildWordListSets(list: WordList, rows: Record<string, string>[], level: SeedLevel, categories: SeedCategory[] = CATEGORIES): SeedSet[] {
  const byCategory = new Map<string, SeedItem[]>();
  rows.forEach((row, index) => {
    const where = `${list.file} row ${index + 2} (${row.text})`;
    const category = categories.find((candidate) => candidate.slug === row.category);
    if (!category) throw new Error(`${where}: unknown category "${row.category}"`);
    byCategory.set(category.slug, [...(byCategory.get(category.slug) ?? []), rowToItem(row, level.difficulty, where)]);
  });

  return categories.flatMap((category): SeedSet[] => {
    const items = byCategory.get(category.slug);
    if (!items) return [];
    return [
      {
        language: list.language,
        slug: `${list.level.toLowerCase()}-${category.slug}`,
        kind: 'VOCABULARY',
        category: category.slug,
        level: list.level,
        title: category.title,
        items,
      },
    ];
  });
}

export function readWordList(file: string): Record<string, string>[] {
  return parseCsv(readFileSync(new URL(`../vocabulary/${file}`, import.meta.url), 'utf8'));
}

export function buildWordLists(): SeedSet[] {
  return WORD_LISTS.flatMap((list) => {
    const level = LEVELS.find((candidate) => candidate.language === list.language && candidate.code === list.level);
    if (!level) throw new Error(`No level ${list.language}/${list.level}`);
    return buildWordListSets(list, readWordList(list.file), level);
  });
}
