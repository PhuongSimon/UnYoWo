import type { RecentSession, SetStats } from '../dashboard.entity.js';

export abstract class DashboardRepository {
  /** Every set of the active languages, in display order, with the user's progress on it */
  abstract findSetStats(userId: string, now: Date): Promise<SetStats[]>;
  abstract findRecentSessions(userId: string, limit: number): Promise<RecentSession[]>;
}
