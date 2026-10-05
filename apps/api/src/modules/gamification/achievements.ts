import type { SetCriterion, UserStatsRecord } from './entities/gamification.entity.js';

export interface AchievementProgress {
  current: number;
  target: number;
}

/** Read-only questions an achievement may ask; implemented with the database by the service. */
export interface AchievementContext {
  stats: UserStatsRecord;
  /** How many items of these sets meet the criterion, out of all their items */
  setCompletion(languageCode: string, slugs: string[], criterion: SetCriterion): Promise<{ done: number; total: number }>;
  /** Languages the user has answered in, out of all available languages */
  languages(): Promise<{ studied: number; available: number }>;
}

export interface AchievementDefinition {
  key: string;
  progress(context: AchievementContext): Promise<AchievementProgress>;
}

type CountedStat = 'gamesCompleted' | 'longestStreak' | 'bestAnswerStreak';

const statMilestone = (key: string, stat: CountedStat, target: number): AchievementDefinition => ({
  key,
  progress: async ({ stats }) => ({ current: Math.min(stats[stat], target), target }),
});

const setMilestone = (key: string, languageCode: string, slugs: string[], criterion: SetCriterion): AchievementDefinition => ({
  key,
  progress: async (context) => {
    const { done, total } = await context.setCompletion(languageCode, slugs, criterion);
    return { current: done, target: total };
  },
});

/**
 * Every achievement, as data plus a progress function. Titles and descriptions live in the
 * web i18n files under achievements.<key>. Adding one never touches games or controllers.
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  statMilestone('FIRST_STEPS', 'gamesCompleted', 1),
  statMilestone('STREAK_7', 'longestStreak', 7),
  setMilestone('HIRAGANA_BEGINNER', 'ja', ['hiragana-basic'], 'answered'),
  setMilestone('HIRAGANA_MASTER', 'ja', ['hiragana-basic', 'hiragana-dakuten', 'hiragana-yoon'], 'mastered'),
  setMilestone('KATAKANA_BEGINNER', 'ja', ['katakana-basic'], 'answered'),
  setMilestone('HANGUL_BEGINNER', 'ko', ['hangul-consonants', 'hangul-vowels'], 'answered'),
  {
    key: 'POLYGLOT',
    progress: async (context) => {
      const { studied, available } = await context.languages();
      return { current: Math.min(studied, available), target: available };
    },
  },
  statMilestone('SPEED_DEMON', 'bestAnswerStreak', 20),
];

/** A target of 0 (e.g. a set that is not seeded) can never be reached. */
export const isReached = ({ current, target }: AchievementProgress) => target > 0 && current >= target;
