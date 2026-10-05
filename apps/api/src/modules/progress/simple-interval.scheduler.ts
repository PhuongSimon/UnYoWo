import { Injectable } from '@nestjs/common';
import type { ReviewRating } from '../../generated/prisma/enums.js';
import { ReviewScheduler, type ScheduleResult } from './review-scheduler.js';

const DAY = 24 * 60;
const MAX_INTERVAL = 365 * DAY;

// First review: Again 10 min · Hard 1 day · Good 3 days · Easy 7 days.
// Later reviews grow from the previous interval, so well-known items drift apart.
const RULES: Record<ReviewRating, { baseMinutes: number; growth: number }> = {
  AGAIN: { baseMinutes: 10, growth: 0 },
  HARD: { baseMinutes: 1 * DAY, growth: 1.2 },
  GOOD: { baseMinutes: 3 * DAY, growth: 2.5 },
  EASY: { baseMinutes: 7 * DAY, growth: 3.5 },
};

// mastery_level = how many of these intervals the item has reached (21 days = mastered).
const MASTERY_STEPS = [1 * DAY, 3 * DAY, 7 * DAY, 21 * DAY, 60 * DAY];

export function masteryForInterval(intervalMinutes: number): number {
  return MASTERY_STEPS.filter((step) => intervalMinutes >= step).length;
}

@Injectable()
export class SimpleIntervalScheduler extends ReviewScheduler {
  schedule(previousIntervalMinutes: number | null, rating: ReviewRating, now: Date): ScheduleResult {
    const { baseMinutes, growth } = RULES[rating];
    const grown = Math.round((previousIntervalMinutes ?? 0) * growth);
    const intervalMinutes = Math.min(MAX_INTERVAL, Math.max(baseMinutes, grown));

    return {
      intervalMinutes,
      masteryLevel: masteryForInterval(intervalMinutes),
      dueAt: new Date(now.getTime() + intervalMinutes * 60_000),
    };
  }
}
