import { readFileSync } from 'node:fs';
import type { PartOfSpeech } from '../../../src/generated/prisma/enums.js';
import { parseCsv } from '../csv.js';
import type { SeedCategory, SeedItem, SeedLevel, SeedSet } from '../types.js';
import { CATEGORIES, LEVELS, SOURCES } from './vocabulary-meta.js';

// Exam-level vocabulary lives in CSV files (prisma/seed/vocabulary/<language>/<level>.csv) so it can
// be edited in a spreadsheet. Each row is one word; the columns every file shares are listed in
// CORE_COLUMNS, and any other column becomes an attribute of the item (han_viet → hanViet).
// Rows keep their file order inside a topic, and a topic with many words is split into parts.

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

/** Words per set at most: about three game sessions, so a learner sees a set finished soon. */
export const MAX_PART_SIZE = 30;

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

/** Splits into the fewest parts of at most `max`, sized evenly: 31 words → 16 + 15, not 30 + 1. */
export function splitIntoParts<T>(items: T[], max: number): T[][] {
  const count = Math.ceil(items.length / max);
  const size = Math.ceil(items.length / count);
  return Array.from({ length: count }, (_, index) => items.slice(index * size, (index + 1) * size));
}

/** The sets of one word list: topics in CATEGORIES order, each split into parts. */
export function buildWordListSets(list: WordList, rows: Record<string, string>[], level: SeedLevel, categories: SeedCategory[] = CATEGORIES): SeedSet[] {
  const byCategory = new Map<string, SeedItem[]>();
  rows.forEach((row, index) => {
    const where = `${list.file} row ${index + 2} (${row.text})`;
    const category = categories.find((candidate) => candidate.slug === row.category);
    if (!category) throw new Error(`${where}: unknown category "${row.category}"`);
    byCategory.set(category.slug, [...(byCategory.get(category.slug) ?? []), rowToItem(row, level.difficulty, where)]);
  });

  return categories.flatMap((category) => {
    const items = byCategory.get(category.slug);
    if (!items) return [];
    const parts = splitIntoParts(items, MAX_PART_SIZE);
    return parts.map(
      (partItems, index): SeedSet => ({
        language: list.language,
        // Always numbered, so a topic that later grows into two parts keeps its first set.
        slug: `${list.level.toLowerCase()}-${category.slug}-${index + 1}`,
        kind: 'VOCABULARY',
        category: category.slug,
        level: list.level,
        part: index + 1,
        title:
          parts.length === 1
            ? category.title
            : { en: `${category.title.en} ${index + 1}`, vi: `${category.title.vi} ${index + 1}` },
        items: partItems,
      }),
    );
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
