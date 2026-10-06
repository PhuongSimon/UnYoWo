import type { XpSource } from '../../../generated/prisma/enums.js';
import type { LocalDate } from '../calendar.js';

export interface UserStatsRecord {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: LocalDate | null;
  answerStreak: number;
  bestAnswerStreak: number;
  gamesCompleted: number;
}

export const EMPTY_STATS: UserStatsRecord = {
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  answerStreak: 0,
  bestAnswerStreak: 0,
  gamesCompleted: 0,
};

export type StreakFields = Pick<UserStatsRecord, 'currentStreak' | 'longestStreak' | 'lastStudyDate' | 'answerStreak' | 'bestAnswerStreak'>;

export interface DayActivity {
  languageCode: string;
  xp: number;
  attempts: number;
  correct: number;
  newItems: number;
  reviews: number;
  gamesCompleted: number;
}

export type ActivityIncrement = Partial<Omit<DayActivity, 'languageCode'>>;

export interface XpAward {
  userId: string;
  amount: number;
  source: XpSource;
  sourceKey: string;
  sessionId: string | null;
  languageCode: string | null;
}

export interface XpEventRecord {
  amount: number;
  source: XpSource;
  sourceKey: string;
}

export interface UnlockedAchievement {
  key: string;
  unlockedAt: Date;
  sessionId: string | null;
}

export type SetCriterion = 'answered' | 'mastered';

// ─── Shapes sent to the client ───────────────────────────────────────────────

export interface DailyGoalView {
  key: string;
  target: number;
  current: number;
  xp: number;
  completed: boolean;
  /** For "practise <language>" goals */
  languageCode: string | null;
}

export interface ProgressSummaryView {
  totalXp: number;
  streak: { current: number; longest: number; studiedToday: boolean };
  today: { xp: number; answers: number };
  dailyGoals: DailyGoalView[];
}

export interface AchievementView {
  key: string;
  current: number;
  target: number;
  unlockedAt: Date | null;
}

/** What a finished session earned, for its results screen. */
export interface SessionRewards {
  xp: number;
  breakdown: { source: XpSource; amount: number; count: number }[];
  /** Daily goals completed during the session */
  goals: string[];
  /** Achievements unlocked by the session */
  achievements: string[];
  streak: number;
  totalXp: number;
}
