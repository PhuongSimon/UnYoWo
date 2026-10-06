import { MASTERED_LEVEL } from './mastery.js';
import { masteryForInterval, SimpleIntervalScheduler } from './simple-interval.scheduler.js';

const DAY = 24 * 60;
const now = new Date('2026-10-04T10:00:00Z');
const scheduler = new SimpleIntervalScheduler();

describe('SimpleIntervalScheduler', () => {
  it.each([
    ['AGAIN', 10],
    ['HARD', 1 * DAY],
    ['GOOD', 3 * DAY],
    ['EASY', 7 * DAY],
  ] as const)('schedules a new item rated %s %i minutes ahead', (rating, minutes) => {
    const result = scheduler.schedule(null, rating, now);
    expect(result.intervalMinutes).toBe(minutes);
    expect(result.dueAt.getTime() - now.getTime()).toBe(minutes * 60_000);
  });

  it('grows the interval on each successful review', () => {
    const first = scheduler.schedule(null, 'GOOD', now).intervalMinutes;
    const second = scheduler.schedule(first, 'GOOD', now).intervalMinutes;
    expect(second).toBe(Math.round(3 * DAY * 2.5));
    expect(scheduler.schedule(second, 'EASY', now).intervalMinutes).toBe(Math.round(second * 3.5));
  });

  it('never schedules a known item sooner than the base interval of its rating', () => {
    expect(scheduler.schedule(60, 'GOOD', now).intervalMinutes).toBe(3 * DAY);
  });

  it('resets to 10 minutes and mastery 0 after a mistake', () => {
    expect(scheduler.schedule(40 * DAY, 'AGAIN', now)).toMatchObject({ intervalMinutes: 10, masteryLevel: 0 });
  });

  it('caps the interval at one year', () => {
    expect(scheduler.schedule(300 * DAY, 'EASY', now).intervalMinutes).toBe(365 * DAY);
  });

  it('reaches "mastered" after about four good reviews', () => {
    let interval: number | null = null;
    const levels: number[] = [];
    for (let review = 0; review < 4; review++) {
      const result = scheduler.schedule(interval, 'GOOD', now);
      interval = result.intervalMinutes;
      levels.push(result.masteryLevel);
    }
    expect(levels).toEqual([2, 3, 3, MASTERED_LEVEL]);
    expect(masteryForInterval(21 * DAY)).toBe(MASTERED_LEVEL);
  });
});
