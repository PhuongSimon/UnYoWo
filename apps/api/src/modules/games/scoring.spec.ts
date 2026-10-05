import { comboStats } from './scoring.js';

describe('comboStats', () => {
  it('tracks the current and the longest run of correct answers', () => {
    expect(comboStats([])).toEqual({ current: 0, max: 0 });
    expect(comboStats([true, true, false, true])).toEqual({ current: 1, max: 2 });
    expect(comboStats([false, true, true, true])).toEqual({ current: 3, max: 3 });
  });
});
