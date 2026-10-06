import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client.js';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import { toLocalized } from '../../content/localized.js';
import { MASTERED_LEVEL } from '../../progress/mastery.js';
import type { RecentSession, SetStats } from '../dashboard.entity.js';
import { DashboardRepository } from './dashboard.repository.js';

@Injectable()
export class PrismaDashboardRepository extends DashboardRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  // One query for the whole dashboard: about 60 rows, one per set.
  async findSetStats(userId: string, now: Date): Promise<SetStats[]> {
    const rows = await this.db.$queryRaw<(Omit<SetStats, 'title'> & { title: Prisma.JsonValue })[]>`
      SELECT s.id::text AS "setId",
             s.language_code AS "languageCode",
             s.title,
             s.sort_order AS "sortOrder",
             COUNT(i.id)::int AS "total",
             COUNT(p.item_id)::int AS "seen",
             COUNT(p.item_id) FILTER (WHERE p.mastery_level >= ${MASTERED_LEVEL})::int AS "mastered",
             COUNT(p.item_id) FILTER (WHERE p.due_at <= ${now})::int AS "due",
             COUNT(p.item_id) FILTER (WHERE p.correct_streak < 2 AND p.attempt_count > p.correct_count)::int AS "weak",
             MAX(p.last_reviewed_at) AS "lastStudiedAt"
      FROM learning_sets s
      JOIN languages l ON l.code = s.language_code AND l.is_active
      JOIN learning_items i ON i.set_id = s.id
      LEFT JOIN user_item_progress p ON p.item_id = i.id AND p.user_id = ${userId}::uuid
      GROUP BY s.id, l.sort_order
      ORDER BY l.sort_order, s.sort_order`;
    return rows.map(({ title, ...set }) => ({ ...set, title: toLocalized(title) }));
  }

  async findRecentSessions(userId: string, limit: number): Promise<RecentSession[]> {
    const rows = await this.db.gameSession.findMany({
      where: { userId, status: 'COMPLETED', completedAt: { not: null } },
      orderBy: { completedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        gameType: true,
        languageCode: true,
        source: true,
        score: true,
        correctCount: true,
        incorrectCount: true,
        completedAt: true,
        set: { select: { title: true } },
      },
    });
    return rows.flatMap(({ set, incorrectCount, completedAt, ...session }) =>
      completedAt
        ? [{ ...session, completedAt, answeredCount: session.correctCount + incorrectCount, setTitle: set ? toLocalized(set.title) : null }]
        : [],
    );
  }
}
