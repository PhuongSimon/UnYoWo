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
