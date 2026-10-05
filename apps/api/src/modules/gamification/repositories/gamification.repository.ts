import type { LocalDate } from '../calendar.js';
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

export abstract class GamificationRepository {
  abstract findStats(userId: string): Promise<UserStatsRecord | null>;
  /** Writes only the streak fields, so concurrent XP increments are never overwritten. */
  abstract saveStreaks(userId: string, fields: StreakFields): Promise<void>;
  abstract addToStats(userId: string, increment: { totalXp?: number; gamesCompleted?: number }): Promise<void>;

  abstract incrementActivity(userId: string, date: LocalDate, languageCode: string, increment: ActivityIncrement): Promise<void>;
  abstract findActivity(userId: string, date: LocalDate): Promise<DayActivity[]>;
  /** All rows of the user's most recent study day before `date` */
  abstract findPreviousStudyDay(userId: string, date: LocalDate): Promise<DayActivity[]>;

  /** Inserts the event unless the same reward was already given; true when it was inserted. */
  abstract insertXpEvent(award: XpAward): Promise<boolean>;
  abstract findSessionXpEvents(userId: string, sessionId: string): Promise<XpEventRecord[]>;
  /** Goal keys already rewarded on `date` */
  abstract findClaimedGoals(userId: string, date: LocalDate): Promise<Set<string>>;

  abstract findAchievements(userId: string): Promise<UnlockedAchievement[]>;
  abstract unlockAchievements(userId: string, keys: string[], sessionId: string | null): Promise<void>;
  abstract setCompletion(
    userId: string,
    languageCode: string,
    slugs: string[],
    criterion: SetCriterion,
  ): Promise<{ done: number; total: number }>;
  abstract countLanguages(userId: string): Promise<{ studied: number; available: number }>;
}
