import type { Attempt, ConfusionPair, CreateAttemptData, ItemProgress, ItemSummary, WeakItem } from '../entities/progress.entity.js';

export abstract class ProgressRepository {
  abstract findOne(userId: string, itemId: string): Promise<ItemProgress | null>;
  abstract findMany(userId: string, itemIds: string[]): Promise<ItemProgress[]>;
  /** Items whose review time has passed, most overdue first. */
  abstract findDueItemIds(userId: string, languageCode: string, now: Date, limit: number): Promise<string[]>;
  abstract save(progress: ItemProgress): Promise<ItemProgress>;
  abstract findAttemptByKey(userId: string, idempotencyKey: string): Promise<Attempt | null>;
  abstract createAttempt(data: CreateAttemptData): Promise<Attempt>;

  /**
   * Items answered wrong and not yet answered right twice in a row since, most recent first.
   * Without a language, across every language.
   */
  abstract findWeakItems(userId: string, languageCode: string | null, limit: number): Promise<WeakItem[]>;
  abstract countWeakByLanguage(userId: string): Promise<Map<string, number>>;
  abstract countDueByLanguage(userId: string, now: Date): Promise<Map<string, number>>;
  /** Pairs mixed up at least `minCount` times since `since`, most frequent first */
  abstract findConfusions(userId: string, since: Date, minCount: number, limit: number): Promise<ConfusionPair[]>;
  /** For each item, the items the user has picked instead of it (or it instead of them) */
  abstract findConfusionPartners(userId: string, itemIds: string[]): Promise<Map<string, string[]>>;
  abstract findItemSummaries(itemIds: string[]): Promise<ItemSummary[]>;
}
