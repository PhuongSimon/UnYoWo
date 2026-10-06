import type { DailyGoalView, DayActivity } from './entities/gamification.entity.js';

type Totals = Omit<DayActivity, 'languageCode'>;

export interface DaySummary {
  total: Totals;
  byLanguage: Map<string, DayActivity>;
}

export interface DailyGoalDefinition {
  key: string;
  target: number;
  xp: number;
  /** Progress towards the target today; `focus` is the language the user has been studying */
  current(day: DaySummary, focus: string | null): number;
  /** Shown only when the user has a focus language */
  needsFocus?: boolean;
}

/** Today's goals. Add one here and it appears on the dashboard and pays out automatically. */
export const DAILY_GOALS: DailyGoalDefinition[] = [
  { key: 'LEARN_NEW', target: 10, xp: 50, current: (day) => day.total.newItems },
  { key: 'REVIEW', target: 20, xp: 30, current: (day) => day.total.reviews },
  { key: 'PLAY_GAME', target: 1, xp: 20, current: (day) => day.total.gamesCompleted },
  {
    key: 'PRACTICE_LANGUAGE',
    target: 10,
    xp: 30,
    needsFocus: true,
    current: (day, focus) => (focus ? (day.byLanguage.get(focus)?.attempts ?? 0) : 0),
  },
];

const ZERO: Totals = { xp: 0, attempts: 0, correct: 0, newItems: 0, reviews: 0, gamesCompleted: 0 };

export function summarizeDay(rows: DayActivity[]): DaySummary {
  const total = { ...ZERO };
  for (const row of rows) {
    for (const key of Object.keys(ZERO) as (keyof Totals)[]) total[key] += row[key];
  }
  return { total, byLanguage: new Map(rows.map((row) => [row.languageCode, row])) };
}

const mostPractised = (rows: DayActivity[]) =>
  [...rows].filter((row) => row.attempts > 0).sort((a, b) => b.attempts - a.attempts)[0]?.languageCode ?? null;

/**
 * The language of the "practise X" goal: what the user studied most on their last study day
 * before today, so it stays the same all day. A brand-new user gets today's language.
 */
export function focusLanguage(previousDay: DayActivity[], today: DayActivity[]): string | null {
  return mostPractised(previousDay) ?? mostPractised(today);
}

export function evaluateGoals(today: DayActivity[], focus: string | null, claimed: Set<string>): DailyGoalView[] {
  const day = summarizeDay(today);
  return DAILY_GOALS.filter((goal) => !goal.needsFocus || focus).map((goal) => {
    const current = Math.min(goal.current(day, focus), goal.target);
    return {
      key: goal.key,
      target: goal.target,
      current,
      xp: goal.xp,
      completed: claimed.has(goal.key) || current >= goal.target,
      languageCode: goal.needsFocus ? focus : null,
    };
  });
}
