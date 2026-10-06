import { buildHangul } from './data/hangul.js';
import { buildKana } from './data/kana.js';
import { LANGUAGES } from './data/languages.js';
import { CATEGORIES, LEVELS, SOURCES } from './data/vocabulary-meta.js';
import { buildVocabulary } from './data/vocabulary.js';
import { buildWordLists } from './data/word-lists.js';
import type { ItemRef, SeedCategory, SeedConcept, SeedLanguage, SeedLevel, SeedRelation, SeedSet, SeedSource } from './types.js';

export interface Catalog {
  languages: SeedLanguage[];
  categories: SeedCategory[];
  levels: SeedLevel[];
  sources: SeedSource[];
  concepts: SeedConcept[];
  /** In display order: sort_order follows this array within each language. */
  sets: SeedSet[];
  relations: SeedRelation[];
}

/** Everything the seed writes, built in memory first so it can be unit-tested without a database. */
export function buildCatalog(): Catalog {
  const kana = buildKana();
  const hangul = buildHangul();
  const vocabulary = buildVocabulary();

  return {
    languages: LANGUAGES,
    categories: CATEGORIES,
    levels: LEVELS,
    sources: SOURCES,
    concepts: vocabulary.concepts,
    // Starter sets (one concept in every language) come before the exam-level word lists.
    sets: [...kana.sets, ...hangul.sets, ...vocabulary.sets, ...buildWordLists()],
    relations: [...kana.relations, ...hangul.relations],
  };
}

export const refKey = ({ language, set, text }: ItemRef) => `${language}/${set}/${text}`;
