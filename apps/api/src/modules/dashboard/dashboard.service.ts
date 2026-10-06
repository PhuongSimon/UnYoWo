import { Injectable } from '@nestjs/common';
import { ContentRepository } from '../content/repositories/content.repository.js';
import { GamificationService } from '../gamification/gamification.service.js';
import type { DashboardView, LanguageStats, SetStats } from './dashboard.entity.js';
import { DashboardRepository } from './repositories/dashboard.repository.js';
import { planToday } from './suggestions.js';

const RECENT_SESSIONS = 4;
const WEAK_AREAS = 4;

/** Everything the home screen shows, in one request. */
@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboard: DashboardRepository,
    private readonly content: ContentRepository,
    private readonly gamification: GamificationService,
  ) {}

  async overview(userId: string, now: Date): Promise<DashboardView> {
    const [summary, sets, languages, recentSessions] = await Promise.all([
      this.gamification.summary(userId, now),
      this.dashboard.findSetStats(userId, now),
      this.content.findLanguages(),
      this.dashboard.findRecentSessions(userId, RECENT_SESSIONS),
    ]);

    // The "practise <language>" goal already knows the focus language; otherwise the last one studied.
    const focus =
      summary.dailyGoals.find((goal) => goal.languageCode)?.languageCode ??
      [...sets].sort((a, b) => (b.lastStudiedAt?.getTime() ?? 0) - (a.lastStudiedAt?.getTime() ?? 0)).find((set) => set.lastStudiedAt)
        ?.languageCode ??
      null;

    return {
      ...summary,
      languages: languages.map(({ code, nativeName }) => ({ code, nativeName, ...totals(sets.filter((set) => set.languageCode === code)) })),
      suggestions: planToday(sets, focus),
      weakAreas: sets
        .filter((set) => set.weak > 0)
        .sort((a, b) => b.weak - a.weak)
        .slice(0, WEAK_AREAS)
        .map(({ setId, languageCode, title, weak }) => ({ setId, languageCode, setTitle: title, weak })),
      recentSessions,
    };
  }
}

function totals(sets: SetStats[]): Omit<LanguageStats, 'code' | 'nativeName'> {
  return sets.reduce(
    (sum, set) => ({
      total: sum.total + set.total,
      seen: sum.seen + set.seen,
      mastered: sum.mastered + set.mastered,
      due: sum.due + set.due,
      weak: sum.weak + set.weak,
    }),
    { total: 0, seen: 0, mastered: 0, due: 0, weak: 0 },
  );
}
