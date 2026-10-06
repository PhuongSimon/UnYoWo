import type { ContentRepository } from '../content/repositories/content.repository.js';
import type { ProgressSummaryView } from '../gamification/entities/gamification.entity.js';
import type { GamificationService } from '../gamification/gamification.service.js';
import type { RecentSession, SetStats } from './dashboard.entity.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardRepository } from './repositories/dashboard.repository.js';

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

class InMemoryDashboardRepository extends DashboardRepository {
  constructor(
    private readonly sets: SetStats[],
    private readonly recent: RecentSession[] = [],
  ) {
    super();
  }
  async findSetStats() {
    return this.sets;
  }
  async findRecentSessions(_userId: string, limit: number) {
    return this.recent.slice(0, limit);
  }
}

const summary = (goalLanguage: string | null = null): ProgressSummaryView => ({
  totalXp: 100,
  streak: { current: 2, longest: 4, studiedToday: true },
  today: { xp: 10, answers: 5 },
  dailyGoals: goalLanguage
    ? [{ key: 'PRACTICE_LANGUAGE', target: 10, current: 3, xp: 30, completed: false, languageCode: goalLanguage }]
    : [],
});

const language = (code: string) => ({ code, nativeName: code, speechLang: code, setCount: 0, itemCount: 0 });
const content = { findLanguages: async () => [language('ja'), language('ko'), language('de')] } as unknown as ContentRepository;
const gamification = (view: ProgressSummaryView) => ({ summary: async () => view }) as unknown as GamificationService;

describe('DashboardService', () => {
  const now = new Date('2026-10-06T08:00:00Z');

  it('adds up each language and lists the weakest sets first', async () => {
    const sets = [
      set('hiragana', 'ja', 0, { seen: 6, mastered: 2, due: 3, weak: 1 }),
      set('katakana', 'ja', 1, { seen: 4, mastered: 1, due: 1, weak: 4 }),
      set('consonants', 'ko', 0, { seen: 2, weak: 2 }),
    ];
    const service = new DashboardService(new InMemoryDashboardRepository(sets), content, gamification(summary()));

    const view = await service.overview('u1', now);

    expect(view.totalXp).toBe(100);
    expect(view.languages).toEqual([
      { code: 'ja', nativeName: 'ja', total: 20, seen: 10, mastered: 3, due: 4, weak: 5 },
      { code: 'ko', nativeName: 'ko', total: 10, seen: 2, mastered: 0, due: 0, weak: 2 },
      // A language without sets still gets a card, with zeros.
      { code: 'de', nativeName: 'de', total: 0, seen: 0, mastered: 0, due: 0, weak: 0 },
    ]);
    expect(view.weakAreas.map((area) => [area.setId, area.weak])).toEqual([
      ['katakana', 4],
      ['consonants', 2],
      ['hiragana', 1],
    ]);
  });

  it('starts something new in the language of the "practise a language" goal', async () => {
    const sets = [set('hiragana', 'ja', 0, { seen: 10, lastStudiedAt: new Date('2026-10-05') }), set('consonants', 'ko', 0)];
    const service = new DashboardService(new InMemoryDashboardRepository(sets), content, gamification(summary('ko')));

    const view = await service.overview('u1', now);

    expect(view.suggestions[0]).toMatchObject({ kind: 'START_SET', languageCode: 'ko', setId: 'consonants' });
  });

  it('falls back to the language studied last when no goal names one', async () => {
    const sets = [
      set('hiragana', 'ja', 0, { seen: 10, lastStudiedAt: new Date('2026-10-01') }),
      set('katakana', 'ja', 1),
      set('consonants', 'ko', 0, { seen: 10, lastStudiedAt: new Date('2026-10-05') }),
      set('vowels', 'ko', 1),
    ];
    const service = new DashboardService(new InMemoryDashboardRepository(sets), content, gamification(summary()));

    const view = await service.overview('u1', now);

    expect(view.suggestions[0]).toMatchObject({ kind: 'START_SET', languageCode: 'ko', setId: 'vowels' });
  });
});
