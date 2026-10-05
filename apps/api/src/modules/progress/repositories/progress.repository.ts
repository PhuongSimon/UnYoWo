import type { Attempt, CreateAttemptData, ItemProgress } from '../entities/progress.entity.js';

export abstract class ProgressRepository {
  abstract findOne(userId: string, itemId: string): Promise<ItemProgress | null>;
  abstract findMany(userId: string, itemIds: string[]): Promise<ItemProgress[]>;
  /** Items whose review time has passed, most overdue first. */
  abstract findDueItemIds(userId: string, languageCode: string, now: Date, limit: number): Promise<string[]>;
  abstract save(progress: ItemProgress): Promise<ItemProgress>;
  abstract findAttemptByKey(userId: string, idempotencyKey: string): Promise<Attempt | null>;
  abstract createAttempt(data: CreateAttemptData): Promise<Attempt>;
}
