import { evaluateGoals, focusLanguage } from './daily-goals.js';
import type { DayActivity } from './entities/gamification.entity.js';

const day = (languageCode: string, values: Partial<DayActivity>): DayActivity => ({
  languageCode,
  xp: 0,
  attempts: 0,
  correct: 0,
  newItems: 0,
  reviews: 0,
  gamesCompleted: 0,
  ...values,
});

describe('daily goals', () => {
  it('adds up every language for the general goals and caps progress at the target', () => {
    const today = [day('ja', { newItems: 6, reviews: 25, attempts: 31 }), day('ko', { newItems: 5, attempts: 5, gamesCompleted: 1 })];
    const goals = evaluateGoals(today, 'ja', new Set());

    expect(goals.map(({ key, current, target, completed }) => ({ key, current, target, completed }))).toEqual([
      { key: 'LEARN_NEW', current: 10, target: 10, completed: true },
      { key: 'REVIEW', current: 20, target: 20, completed: true },
      { key: 'PLAY_GAME', current: 1, target: 1, completed: true },
      { key: 'PRACTICE_LANGUAGE', current: 10, target: 10, completed: true },
    ]);
    expect(goals[3].languageCode).toBe('ja');
  });

  it('only counts the focus language for the language goal', () => {
    const goals = evaluateGoals([day('ko', { attempts: 30 })], 'ja', new Set());
    expect(goals.find((goal) => goal.key === 'PRACTICE_LANGUAGE')).toMatchObject({ current: 0, completed: false });
  });

  it('keeps a paid goal completed', () => {
    expect(evaluateGoals([], null, new Set(['PLAY_GAME'])).find((goal) => goal.key === 'PLAY_GAME')?.completed).toBe(true);
  });

  it('hides the language goal until the user has studied something', () => {
    expect(evaluateGoals([], null, new Set()).map((goal) => goal.key)).not.toContain('PRACTICE_LANGUAGE');
  });

  it("picks the focus language from the last study day, so it stays fixed all day", () => {
    const yesterday = [day('de', { attempts: 4 }), day('ko', { attempts: 12 })];
    expect(focusLanguage(yesterday, [day('ja', { attempts: 50 })])).toBe('ko');
    expect(focusLanguage([], [day('ja', { attempts: 3 })])).toBe('ja');
    expect(focusLanguage([], [])).toBeNull();
  });
});
