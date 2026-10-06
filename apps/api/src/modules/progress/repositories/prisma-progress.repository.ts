import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client.js';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import { toMeaning } from '../../content/localized.js';
import type {
  Attempt,
  ConfusionPair,
  CreateAttemptData,
  ItemProgress,
  ItemSummary,
  WeakItem,
} from '../entities/progress.entity.js';
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

const itemSummarySelect = {
  id: true,
  text: true,
  reading: true,
  romanization: true,
  meaning: true,
  set: { select: { languageCode: true } },
  concept: { select: { gloss: true, emoji: true } },
} satisfies Prisma.LearningItemSelect;

type ItemSummaryRow = Prisma.LearningItemGetPayload<{ select: typeof itemSummarySelect }>;

const toItemSummary = ({ set, concept, meaning, ...item }: ItemSummaryRow): ItemSummary => ({
  ...item,
  languageCode: set.languageCode,
  meaning: toMeaning(meaning, concept?.gloss),
  emoji: concept?.emoji ?? null,
});

const toCountMap = (rows: { languageCode: string; count: number }[]) => new Map(rows.map((row) => [row.languageCode, row.count]));

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

  private weakWhere(userId: string, languageCode: string | null): Prisma.UserItemProgressWhereInput {
    return {
      userId,
      correctStreak: { lt: 2 },
      attemptCount: { gt: this.db.userItemProgress.fields.correctCount },
      ...(languageCode ? { item: { set: { languageCode } } } : {}),
    };
  }

  async findWeakItems(userId: string, languageCode: string | null, limit: number): Promise<WeakItem[]> {
    const rows = await this.db.userItemProgress.findMany({
      where: this.weakWhere(userId, languageCode),
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: { attemptCount: true, correctCount: true, lastReviewedAt: true, item: { select: itemSummarySelect } },
    });
    return rows.map(({ item, ...row }) => ({ ...row, item: toItemSummary(item) }));
  }

  async countWeakByLanguage(userId: string): Promise<Map<string, number>> {
    return toCountMap(
      await this.db.$queryRaw<{ languageCode: string; count: number }[]>`
        SELECT s.language_code AS "languageCode", COUNT(*)::int AS "count"
        FROM user_item_progress p
        JOIN learning_items i ON i.id = p.item_id
        JOIN learning_sets s ON s.id = i.set_id
        WHERE p.user_id = ${userId}::uuid AND p.correct_streak < 2 AND p.attempt_count > p.correct_count
        GROUP BY s.language_code`,
    );
  }

  async countDueByLanguage(userId: string, now: Date): Promise<Map<string, number>> {
    return toCountMap(
      await this.db.$queryRaw<{ languageCode: string; count: number }[]>`
        SELECT s.language_code AS "languageCode", COUNT(*)::int AS "count"
        FROM user_item_progress p
        JOIN learning_items i ON i.id = p.item_id
        JOIN learning_sets s ON s.id = i.set_id
        WHERE p.user_id = ${userId}::uuid AND p.due_at <= ${now}
        GROUP BY s.language_code`,
    );
  }

  // LEAST/GREATEST put ぬ→ね and ね→ぬ in the same group.
  async findConfusions(userId: string, since: Date, minCount: number, limit: number): Promise<ConfusionPair[]> {
    const rows = await this.db.$queryRaw<{ first: string; second: string; languageCode: string; count: number }[]>`
      SELECT LEAST(a.item_id, a.confused_with_item_id)::text AS "first",
             GREATEST(a.item_id, a.confused_with_item_id)::text AS "second",
             s.language_code AS "languageCode",
             COUNT(*)::int AS "count"
      FROM learning_attempts a
      JOIN learning_items i ON i.id = a.item_id
      JOIN learning_sets s ON s.id = i.set_id
      WHERE a.user_id = ${userId}::uuid AND a.is_correct = false
        AND a.confused_with_item_id IS NOT NULL AND a.created_at >= ${since}
      GROUP BY 1, 2, 3
      HAVING COUNT(*) >= ${minCount}
      ORDER BY "count" DESC, MAX(a.created_at) DESC
      LIMIT ${limit}`;
    return rows.map(({ first, second, ...row }) => ({ ...row, itemIds: [first, second] }));
  }

  async findConfusionPartners(userId: string, itemIds: string[]): Promise<Map<string, string[]>> {
    const rows = await this.db.learningAttempt.findMany({
      where: {
        userId,
        isCorrect: false,
        confusedWithItemId: { not: null },
        OR: [{ itemId: { in: itemIds } }, { confusedWithItemId: { in: itemIds } }],
      },
      select: { itemId: true, confusedWithItemId: true },
    });

    const partners = new Map<string, Set<string>>();
    const link = (from: string, to: string) => partners.set(from, (partners.get(from) ?? new Set()).add(to));
    for (const { itemId, confusedWithItemId } of rows) {
      if (!confusedWithItemId) continue;
      link(itemId, confusedWithItemId);
      link(confusedWithItemId, itemId);
    }
    return new Map([...partners].map(([id, set]) => [id, [...set]]));
  }

  async findItemSummaries(itemIds: string[]): Promise<ItemSummary[]> {
    const rows = await this.db.learningItem.findMany({ where: { id: { in: itemIds } }, select: itemSummarySelect });
    return rows.map(toItemSummary);
  }
}
