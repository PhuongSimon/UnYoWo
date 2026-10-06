import type {
  ContentSourceView,
  LanguageSummary,
  LearningItemView,
  LearningSetSummary,
  PracticeItem,
  SetProgress,
  WordLookup,
  WordMatch,
} from '../entities/content.entity.js';

export abstract class ContentRepository {
  abstract findLanguages(): Promise<LanguageSummary[]>;
  abstract languageExists(code: string): Promise<boolean>;
  abstract findSets(languageCode: string): Promise<LearningSetSummary[]>;
  abstract findSetById(id: string): Promise<LearningSetSummary | null>;
  abstract findItems(setId: string, range: { skip: number; take: number }): Promise<{ items: LearningItemView[]; total: number }>;
  /** Datasets the language's items came from, for attribution */
  abstract findSources(languageCode: string): Promise<ContentSourceView[]>;
  /** Vocabulary words matching a lookup, easiest level first */
  abstract lookupWords(lookup: WordLookup, limit: number): Promise<WordMatch[]>;
  abstract findPracticeItems(filter: { setIds: string[] } | { ids: string[] }): Promise<PracticeItem[]>;
  /** Progress per set id for one user; sets the user has not started are missing from the map. */
  abstract countSetProgress(userId: string, languageCode: string, now: Date): Promise<Map<string, SetProgress>>;
}
