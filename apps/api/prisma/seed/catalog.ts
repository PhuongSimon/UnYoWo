import { buildHangul } from './data/hangul.js';
import { buildKana } from './data/kana.js';
import { LANGUAGES } from './data/languages.js';
import { buildVocabulary } from './data/vocabulary.js';
import type { ItemRef, SeedConcept, SeedLanguage, SeedRelation, SeedSet } from './types.js';

export interface Catalog {
  languages: SeedLanguage[];
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
    concepts: vocabulary.concepts,
    sets: [...kana.sets, ...hangul.sets, ...vocabulary.sets],
    relations: [...kana.relations, ...hangul.relations],
  };
}

export const refKey = ({ language, set, text }: ItemRef) => `${language}/${set}/${text}`;
