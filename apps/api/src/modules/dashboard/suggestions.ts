import type { SetStats, Suggestion } from './dashboard.entity.js';

const MAX_SUGGESTIONS = 4;

const sumBy = (sets: SetStats[], field: 'due' | 'weak') =>
  sets.reduce((totals, set) => totals.set(set.languageCode, (totals.get(set.languageCode) ?? 0) + set[field]), new Map<string, number>());

const largest = (totals: Map<string, number>) => [...totals].filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1])[0];

/**
 * "What should I study today?", most useful first: overdue reviews (spaced repetition
 * only works if they are done), then mistakes, then the set in progress, then something
 * new in the focus language and, for a fresh start, in the other languages.
 */
export function planToday(sets: SetStats[], focusLanguage: string | null): Suggestion[] {
  const plan: Suggestion[] = [];

  const due = largest(sumBy(sets, 'due'));
  if (due) {
    const [languageCode, count] = due;
    plan.push({ kind: 'REVIEW_DUE', languageCode, setId: null, setTitle: null, count, total: count, gameType: 'FLASHCARD', source: 'DUE' });
  }

  const weak = largest(sumBy(sets, 'weak'));
  if (weak) {
    const [languageCode, count] = weak;
    const weakest = sets.filter((set) => set.languageCode === languageCode).sort((a, b) => b.weak - a.weak)[0];
    plan.push({
      kind: 'FIX_MISTAKES',
      languageCode,
      setId: null,
      setTitle: weakest?.title ?? null,
      count,
      total: count,
      gameType: 'MULTIPLE_CHOICE',
      source: 'MISTAKES',
    });
  }

  const inProgress = sets
    .filter((set) => set.seen > 0 && set.seen < set.total && set.lastStudiedAt)
    .sort((a, b) => (b.lastStudiedAt?.getTime() ?? 0) - (a.lastStudiedAt?.getTime() ?? 0))[0];
  if (inProgress) plan.push(setSuggestion('CONTINUE_SET', inProgress));

  // Something new: the focus language first, then each other language in order.
  const languages = [...new Set(sets.map((set) => set.languageCode))];
  const order = focusLanguage ? [focusLanguage, ...languages.filter((code) => code !== focusLanguage)] : languages;
  for (const languageCode of order) {
    if (plan.length >= MAX_SUGGESTIONS) break;
    const fresh = sets.filter((set) => set.languageCode === languageCode && set.seen === 0).sort((a, b) => a.sortOrder - b.sortOrder)[0];
    if (fresh) plan.push(setSuggestion('START_SET', fresh));
    if (plan.length >= 2 && languageCode === focusLanguage) break;
  }

  return plan.slice(0, MAX_SUGGESTIONS);
}

function setSuggestion(kind: 'CONTINUE_SET' | 'START_SET', set: SetStats): Suggestion {
  return {
    kind,
    languageCode: set.languageCode,
    setId: set.setId,
    setTitle: set.title,
    count: set.seen,
    total: set.total,
    // Something new is met with flashcards first; a set in progress is practised with a quiz.
    gameType: kind === 'START_SET' ? 'FLASHCARD' : 'MULTIPLE_CHOICE',
    source: 'SET',
  };
}
