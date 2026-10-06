import { addDays, localDate } from './calendar.js';
import { displayedStreak, recordStudyDay } from './streak.js';

describe('calendar', () => {
  it("uses the user's own date, not UTC", () => {
    const lateEvening = new Date('2026-10-04T18:30:00Z');
    expect(localDate(lateEvening, 'Asia/Ho_Chi_Minh')).toBe('2026-10-05');
    expect(localDate(lateEvening, 'UTC')).toBe('2026-10-04');
    expect(localDate(lateEvening, 'America/Los_Angeles')).toBe('2026-10-04');
  });

  it('falls back to UTC for an unknown zone', () => {
    expect(localDate(new Date('2026-10-04T18:30:00Z'), 'Mars/Olympus')).toBe('2026-10-04');
  });

  it('adds days across month and year ends', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
  });
});

describe('streak', () => {
  const fresh = { current: 0, longest: 0, lastStudyDate: null };

  it('starts at 1 and grows on consecutive days', () => {
    let state = recordStudyDay(fresh, '2026-10-01');
    state = recordStudyDay(state, '2026-10-02');
    state = recordStudyDay(state, '2026-10-03');
    expect(state).toEqual({ current: 3, longest: 3, lastStudyDate: '2026-10-03' });
  });

  it('counts a day once however many answers it has', () => {
    const state = recordStudyDay(fresh, '2026-10-01');
    expect(recordStudyDay(state, '2026-10-01')).toBe(state);
  });

  it('starts again after a missed day but keeps the longest streak', () => {
    const state = recordStudyDay({ current: 5, longest: 5, lastStudyDate: '2026-10-01' }, '2026-10-03');
    expect(state).toEqual({ current: 1, longest: 5, lastStudyDate: '2026-10-03' });
  });

  it('shows 0 once a day has been missed, before the user studies again', () => {
    const state = { current: 4, longest: 6, lastStudyDate: '2026-10-03' };
    expect(displayedStreak(state, '2026-10-03')).toBe(4);
    expect(displayedStreak(state, '2026-10-04')).toBe(4);
    expect(displayedStreak(state, '2026-10-05')).toBe(0);
  });
});
