import { comboStats, scoreAttempts } from './scoring.js';

describe('comboStats', () => {
  it('tracks the current and the longest run of correct answers', () => {
    expect(comboStats([])).toEqual({ current: 0, max: 0 });
    expect(comboStats([true, true, false, true])).toEqual({ current: 1, max: 2 });
    expect(comboStats([false, true, true, true])).toEqual({ current: 3, max: 3 });
  });
});

describe('scoreAttempts', () => {
  it('adds 2 bonus points per answer in a row, up to +10', () => {
    expect(scoreAttempts([true], 10)).toBe(10);
    expect(scoreAttempts([true, true, true], 10)).toBe(10 + 12 + 14);
    expect(scoreAttempts(Array<boolean>(8).fill(true), 10)).toBe(10 + 12 + 14 + 16 + 18 + 20 + 20 + 20);
  });

  it('resets the bonus after a mistake without taking points away', () => {
    expect(scoreAttempts([true, true, false, true], 10)).toBe(10 + 12 + 10);
    expect(scoreAttempts([false, false], 10)).toBe(0);
  });
});
