import type { SetStats } from './dashboard.entity.js';
import { planToday } from './suggestions.js';

const set = (setId: string, languageCode: string, sortOrder: number, values: Partial<SetStats> = {}): SetStats => ({
  setId,
  languageCode,
  title: { en: setId, vi: setId },
  sortOrder,
  total: 10,
  seen: 0,
  mastered: 0,
  due: 0,
  weak: 0,
  lastStudiedAt: null,
  ...values,
});

describe('planToday', () => {
  it('puts overdue reviews first, then mistakes, then the set in progress, then something new', () => {
    const plan = planToday(
      [
        set('hiragana', 'ja', 0, { seen: 6, due: 4, weak: 2, lastStudiedAt: new Date('2026-10-05') }),
        set('katakana', 'ja', 1),
        set('consonants', 'ko', 0, { seen: 10, due: 7, lastStudiedAt: new Date('2026-10-01') }),
      ],
      'ja',
    );

    expect(plan.map((s) => [s.kind, s.languageCode, s.setId])).toEqual([
      ['REVIEW_DUE', 'ko', null],
      ['FIX_MISTAKES', 'ja', null],
      ['CONTINUE_SET', 'ja', 'hiragana'],
      ['START_SET', 'ja', 'katakana'],
    ]);
    expect(plan[0]).toMatchObject({ count: 7, gameType: 'FLASHCARD', source: 'DUE' });
    expect(plan[1]).toMatchObject({ count: 2, gameType: 'MULTIPLE_CHOICE', source: 'MISTAKES', setTitle: { en: 'hiragana' } });
    expect(plan[3]).toMatchObject({ gameType: 'FLASHCARD', source: 'SET' });
  });

  it('suggests the first set of several languages to a brand-new learner', () => {
    const plan = planToday([set('en-1', 'en', 0), set('en-2', 'en', 1), set('ja-1', 'ja', 0), set('ko-1', 'ko', 0)], null);
    expect(plan.map((s) => s.setId)).toEqual(['en-1', 'ja-1', 'ko-1']);
  });

  it('starts with the focus language and never suggests more than four things', () => {
    const sets = ['en', 'de', 'ja', 'ko'].flatMap((code) => [set(`${code}-1`, code, 0), set(`${code}-2`, code, 1)]);
    const plan = planToday(sets, 'ko');
    expect(plan[0].setId).toBe('ko-1');
    expect(plan.length).toBeLessThanOrEqual(4);
  });

  it('suggests nothing new once every set has been started', () => {
    expect(planToday([set('done', 'ja', 0, { seen: 10, total: 10, lastStudiedAt: new Date() })], 'ja')).toEqual([]);
  });
});
