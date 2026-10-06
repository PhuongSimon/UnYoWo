import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import { MASTERED_LEVEL } from '../../progress/mastery.js';
import { fromDbDate, toDbDate, type LocalDate } from '../calendar.js';
import type {
  ActivityIncrement,
  DayActivity,
  SetCriterion,
  StreakFields,
  UnlockedAchievement,
  UserStatsRecord,
  XpAward,
  XpEventRecord,
} from '../entities/gamification.entity.js';
import { GamificationRepository } from './gamification.repository.js';

const activitySelect = {
  languageCode: true,
  xp: true,
  attempts: true,
  correct: true,
  newItems: true,
  reviews: true,
  gamesCompleted: true,
} as const;

const increments = (increment: ActivityIncrement) =>
  Object.fromEntries(Object.entries(increment).map(([key, value]) => [key, { increment: value }]));

@Injectable()
export class PrismaGamificationRepository extends GamificationRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  async findStats(userId: string): Promise<UserStatsRecord | null> {
    const row = await this.db.userStats.findUnique({ where: { userId } });
    if (!row) return null;
    const { userId: _userId, updatedAt: _updatedAt, lastStudyDate, ...stats } = row;
    return { ...stats, lastStudyDate: lastStudyDate ? fromDbDate(lastStudyDate) : null };
  }

  async saveStreaks(userId: string, { lastStudyDate, ...fields }: StreakFields): Promise<void> {
    const data = { ...fields, lastStudyDate: lastStudyDate ? toDbDate(lastStudyDate) : null };
    await this.db.userStats.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  }

  async addToStats(userId: string, increment: { totalXp?: number; gamesCompleted?: number }): Promise<void> {
    await this.db.userStats.upsert({ where: { userId }, create: { userId, ...increment }, update: increments(increment) });
  }

  async incrementActivity(userId: string, date: LocalDate, languageCode: string, increment: ActivityIncrement): Promise<void> {
    const activityDate = toDbDate(date);
    await this.db.userDailyActivity.upsert({
      where: { userId_activityDate_languageCode: { userId, activityDate, languageCode } },
      create: { userId, activityDate, languageCode, ...increment },
      update: increments(increment),
    });
  }

  findActivity(userId: string, date: LocalDate): Promise<DayActivity[]> {
    return this.db.userDailyActivity.findMany({ where: { userId, activityDate: toDbDate(date) }, select: activitySelect });
  }

  async findPreviousStudyDay(userId: string, date: LocalDate): Promise<DayActivity[]> {
    const latest = await this.db.userDailyActivity.findFirst({
      where: { userId, activityDate: { lt: toDbDate(date) }, attempts: { gt: 0 } },
      orderBy: { activityDate: 'desc' },
      select: { activityDate: true },
    });
    return latest
      ? this.db.userDailyActivity.findMany({ where: { userId, activityDate: latest.activityDate }, select: activitySelect })
      : [];
  }

  async insertXpEvent(award: XpAward): Promise<boolean> {
    const { count } = await this.db.xpEvent.createMany({ data: [award], skipDuplicates: true });
    return count === 1;
  }

  findSessionXpEvents(userId: string, sessionId: string): Promise<XpEventRecord[]> {
    return this.db.xpEvent.findMany({
      where: { userId, sessionId },
      orderBy: { createdAt: 'asc' },
      select: { amount: true, source: true, sourceKey: true },
    });
  }

  async findClaimedGoals(userId: string, date: LocalDate): Promise<Set<string>> {
    const rows = await this.db.xpEvent.findMany({
      where: { userId, source: 'DAILY_GOAL', sourceKey: { startsWith: `${date}:` } },
      select: { sourceKey: true },
    });
    return new Set(rows.map((row) => row.sourceKey.slice(date.length + 1)));
  }

  async findAchievements(userId: string): Promise<UnlockedAchievement[]> {
    const rows = await this.db.userAchievement.findMany({ where: { userId }, orderBy: { unlockedAt: 'asc' } });
    return rows.map(({ achievementKey, unlockedAt, sessionId }) => ({ key: achievementKey, unlockedAt, sessionId }));
  }

  async unlockAchievements(userId: string, keys: string[], sessionId: string | null): Promise<void> {
    await this.db.userAchievement.createMany({
      data: keys.map((achievementKey) => ({ userId, achievementKey, sessionId })),
      skipDuplicates: true,
    });
  }

  async setCompletion(userId: string, languageCode: string, slugs: string[], criterion: SetCriterion) {
    const reached =
      criterion === 'mastered' ? Prisma.sql`p.mastery_level >= ${MASTERED_LEVEL}` : Prisma.sql`p.correct_count >= 1`;
    const [row] = await this.db.$queryRaw<{ done: number; total: number }[]>`
      SELECT COUNT(i.id)::int AS "total",
             COUNT(p.item_id) FILTER (WHERE ${reached})::int AS "done"
      FROM learning_items i
      JOIN learning_sets s ON s.id = i.set_id
      LEFT JOIN user_item_progress p ON p.item_id = i.id AND p.user_id = ${userId}::uuid
      WHERE s.language_code = ${languageCode} AND s.slug = ANY(${slugs}::text[])`;
    return row ?? { done: 0, total: 0 };
  }

  async countLanguages(userId: string): Promise<{ studied: number; available: number }> {
    // Sequential on purpose: this also runs inside the session-completion transaction.
    const studied = await this.db.userDailyActivity.findMany({
      where: { userId, attempts: { gt: 0 } },
      distinct: ['languageCode'],
      select: { languageCode: true },
    });
    const available = await this.db.language.count({ where: { isActive: true } });
    return { studied: studied.length, available };
  }
}
