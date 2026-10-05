import type { ReviewRating } from '../../generated/prisma/enums.js';

export interface ScheduleResult {
  intervalMinutes: number;
  /** 0 (new) to 5; see MASTERED_LEVEL */
  masteryLevel: number;
  dueAt: Date;
}

/**
 * Decides when an item should be reviewed next. Swap the implementation (SM-2, FSRS)
 * in ProgressModule without touching games or controllers.
 */
export abstract class ReviewScheduler {
  /** `previousIntervalMinutes` is null for an item the user has never answered. */
  abstract schedule(previousIntervalMinutes: number | null, rating: ReviewRating, now: Date): ScheduleResult;
}
