import { Injectable } from '@nestjs/common';
import type { ReviewRating } from '../../generated/prisma/enums.js';
import type { Attempt, ItemProgress } from './entities/progress.entity.js';
import { ProgressRepository } from './repositories/progress.repository.js';
import { ReviewScheduler } from './review-scheduler.js';

export interface RecordAnswerInput {
  userId: string;
  itemId: string;
  sessionId: string | null;
  questionId: string | null;
  idempotencyKey: string;
  givenAnswer: string | null;
  isCorrect: boolean;
  /** Flashcards: the user's own rating. Other games: GOOD when correct, AGAIN when wrong. */
  rating: ReviewRating;
  confusedWithItemId: string | null;
  responseMs: number | null;
  now: Date;
}

/**
 * Counts every answer, but only lets a correct answer move the review date when the
 * item is new or already due: replaying a game an hour later must not push an item
 * weeks ahead. A mistake always brings the item back soon.
 */
export function applyAnswer(
  previous: ItemProgress | null,
  { userId, itemId, isCorrect, rating, now }: Pick<RecordAnswerInput, 'userId' | 'itemId' | 'isCorrect' | 'rating' | 'now'>,
  scheduler: ReviewScheduler,
): ItemProgress {
  const isDue = !previous?.dueAt || previous.dueAt <= now;
  const schedule =
    !previous || !isCorrect || isDue
      ? scheduler.schedule(previous?.intervalMinutes ?? null, rating, now)
      : { intervalMinutes: previous.intervalMinutes, masteryLevel: previous.masteryLevel, dueAt: previous.dueAt };

  return {
    userId,
    itemId,
    attemptCount: (previous?.attemptCount ?? 0) + 1,
    correctCount: (previous?.correctCount ?? 0) + (isCorrect ? 1 : 0),
    correctStreak: isCorrect ? (previous?.correctStreak ?? 0) + 1 : 0,
    ...schedule,
    lastReviewedAt: now,
  };
}

@Injectable()
export class ProgressService {
  constructor(
    private readonly progress: ProgressRepository,
    private readonly scheduler: ReviewScheduler,
  ) {}

  /** Call inside a transaction: the attempt and the progress row must be saved together. */
  async recordAnswer(input: RecordAnswerInput): Promise<{ attempt: Attempt; progress: ItemProgress }> {
    const previous = await this.progress.findOne(input.userId, input.itemId);
    const progress = await this.progress.save(applyAnswer(previous, input, this.scheduler));
    const { now: _now, ...attemptData } = input;
    const attempt = await this.progress.createAttempt(attemptData);
    return { attempt, progress };
  }
}
