import type { LanguageSummary, LearningItemView, LearningSetSummary, SetProgress } from '../entities/content.entity.js';

export abstract class ContentRepository {
  abstract findLanguages(): Promise<LanguageSummary[]>;
  abstract languageExists(code: string): Promise<boolean>;
  abstract findSets(languageCode: string): Promise<LearningSetSummary[]>;
  abstract findSetById(id: string): Promise<LearningSetSummary | null>;
  abstract findItems(setId: string, range: { skip: number; take: number }): Promise<{ items: LearningItemView[]; total: number }>;
  /** Progress per set id for one user; sets the user has not started are missing from the map. */
  abstract countSetProgress(userId: string, languageCode: string, now: Date): Promise<Map<string, SetProgress>>;
}
