import { Injectable } from '@nestjs/common';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import type { Attempt, CreateAttemptData, ItemProgress } from '../entities/progress.entity.js';
import { ProgressRepository } from './progress.repository.js';

const progressSelect = {
  userId: true,
  itemId: true,
  attemptCount: true,
  correctCount: true,
  correctStreak: true,
  masteryLevel: true,
  intervalMinutes: true,
  lastReviewedAt: true,
  dueAt: true,
} as const;

@Injectable()
export class PrismaProgressRepository extends ProgressRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  findOne(userId: string, itemId: string): Promise<ItemProgress | null> {
    return this.db.userItemProgress.findUnique({ where: { userId_itemId: { userId, itemId } }, select: progressSelect });
  }

  findMany(userId: string, itemIds: string[]): Promise<ItemProgress[]> {
    return this.db.userItemProgress.findMany({ where: { userId, itemId: { in: itemIds } }, select: progressSelect });
  }

  async findDueItemIds(userId: string, languageCode: string, now: Date, limit: number): Promise<string[]> {
    const rows = await this.db.userItemProgress.findMany({
      where: { userId, dueAt: { lte: now }, item: { set: { languageCode } } },
      orderBy: { dueAt: 'asc' },
      take: limit,
      select: { itemId: true },
    });
    return rows.map((row) => row.itemId);
  }

  save({ userId, itemId, ...data }: ItemProgress): Promise<ItemProgress> {
    return this.db.userItemProgress.upsert({
      where: { userId_itemId: { userId, itemId } },
      create: { userId, itemId, ...data },
      update: data,
      select: progressSelect,
    });
  }

  findAttemptByKey(userId: string, idempotencyKey: string): Promise<Attempt | null> {
    return this.db.learningAttempt.findUnique({ where: { userId_idempotencyKey: { userId, idempotencyKey } } });
  }

  createAttempt(data: CreateAttemptData): Promise<Attempt> {
    return this.db.learningAttempt.create({ data });
  }
}
