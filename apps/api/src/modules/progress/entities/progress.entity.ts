import type { ReviewRating } from '../../../generated/prisma/enums.js';

export interface ItemProgress {
  userId: string;
  itemId: string;
  attemptCount: number;
  correctCount: number;
  correctStreak: number;
  masteryLevel: number;
  intervalMinutes: number;
  lastReviewedAt: Date | null;
  dueAt: Date | null;
}

export interface Attempt {
  id: string;
  userId: string;
  itemId: string;
  sessionId: string | null;
  questionId: string | null;
  idempotencyKey: string;
  givenAnswer: string | null;
  isCorrect: boolean;
  confusedWithItemId: string | null;
  rating: ReviewRating;
  responseMs: number | null;
  createdAt: Date;
}

export type CreateAttemptData = Omit<Attempt, 'id' | 'createdAt'>;

/** Item details for the mistakes screen */
export interface ItemSummary {
  id: string;
  languageCode: string;
  text: string;
  reading: string | null;
  romanization: string | null;
  meaning: { en: string; vi: string } | null;
  emoji: string | null;
}

export interface WeakItem {
  item: ItemSummary;
  attemptCount: number;
  correctCount: number;
  lastReviewedAt: Date | null;
}

/** Two items the user mixed up, in either direction (ぬ answered as ね, or ね as ぬ). */
export interface ConfusionPair {
  itemIds: [string, string];
  languageCode: string;
  count: number;
}
