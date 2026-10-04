import type {
  ComponentRole,
  ItemRelationKind,
  LearningItemType,
  LearningSetKind,
} from '../../src/generated/prisma/enums.js';

// A type alias (not an interface) so it is assignable to Prisma's JSON input type.
export type Localized = {
  en: string;
  vi: string;
};

/** Points at an item by natural key, so seed files never depend on generated ids. */
export interface ItemRef {
  language: string;
  set: string;
  text: string;
}

export interface SeedComponent {
  role: ComponentRole;
  text: string;
  /** The component is itself a learning item (ㄱ, き); omitted for marks like ゛ and small kana. */
  ref?: ItemRef;
}

export interface SeedItem {
  type: LearningItemType;
  text: string;
  reading?: string;
  romanization?: string;
  ipa?: string;
  acceptedAnswers?: string[];
  concept?: string;
  attributes?: Record<string, string>;
  difficulty?: number;
  components?: SeedComponent[];
}

export interface SeedSet {
  language: string;
  slug: string;
  kind: LearningSetKind;
  script?: string;
  category?: string;
  title: Localized;
  items: SeedItem[];
}

export interface SeedRelation {
  from: ItemRef;
  to: ItemRef;
  kind: ItemRelationKind;
}

export interface SeedLanguage {
  code: string;
  nativeName: string;
  speechLang: string;
}

export interface SeedConcept {
  slug: string;
  emoji?: string;
  gloss: Localized;
}

/** Stores a symmetric relation (あ ↔ ア, さ ↔ き) in both directions so lookups only need one column. */
export function bothWays(a: ItemRef, b: ItemRef, kind: ItemRelationKind): SeedRelation[] {
  return [
    { from: a, to: b, kind },
    { from: b, to: a, kind },
  ];
}
