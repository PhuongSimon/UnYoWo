import { applyAnswer } from './progress.service.js';
import type { ItemProgress } from './entities/progress.entity.js';
import { SimpleIntervalScheduler } from './simple-interval.scheduler.js';

const DAY_MS = 24 * 60 * 60_000;
const now = new Date('2026-10-04T10:00:00Z');
const scheduler = new SimpleIntervalScheduler();
const answer = (isCorrect: boolean, rating: 'AGAIN' | 'GOOD' = isCorrect ? 'GOOD' : 'AGAIN') => ({
  userId: 'u1',
  itemId: 'i1',
  isCorrect,
  rating,
  now,
});

const known = (overrides: Partial<ItemProgress> = {}): ItemProgress => ({
  userId: 'u1',
  itemId: 'i1',
  attemptCount: 4,
  correctCount: 3,
  correctStreak: 2,
  masteryLevel: 3,
  intervalMinutes: 10 * 24 * 60,
  lastReviewedAt: new Date(now.getTime() - DAY_MS),
  dueAt: new Date(now.getTime() + 9 * DAY_MS),
  ...overrides,
});

describe('applyAnswer', () => {
  it('starts progress for a new item and schedules it', () => {
    const result = applyAnswer(null, answer(true), scheduler);
    expect(result).toMatchObject({ attemptCount: 1, correctCount: 1, correctStreak: 1, masteryLevel: 2, lastReviewedAt: now });
    expect(result.dueAt?.getTime()).toBe(now.getTime() + 3 * DAY_MS);
  });

  it('counts a correct answer on a not-yet-due item without moving its review date', () => {
    const previous = known();
    const result = applyAnswer(previous, answer(true), scheduler);
    expect(result).toMatchObject({ attemptCount: 5, correctCount: 4, correctStreak: 3 });
    expect(result.dueAt).toEqual(previous.dueAt);
    expect(result.intervalMinutes).toBe(previous.intervalMinutes);
  });

  it('reschedules a correct answer once the item is due', () => {
    const result = applyAnswer(known({ dueAt: new Date(now.getTime() - 1000) }), answer(true), scheduler);
    expect(result.intervalMinutes).toBe(25 * 24 * 60);
  });

  it('brings an item back in 10 minutes after a mistake, even if it was not due', () => {
    const result = applyAnswer(known(), answer(false), scheduler);
    expect(result).toMatchObject({ correctStreak: 0, masteryLevel: 0, intervalMinutes: 10, correctCount: 3, attemptCount: 5 });
    expect(result.dueAt?.getTime()).toBe(now.getTime() + 10 * 60_000);
  });
});
