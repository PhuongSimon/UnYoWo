import { addDays, type LocalDate } from './calendar.js';

export interface StreakState {
  current: number;
  longest: number;
  lastStudyDate: LocalDate | null;
}

/** Studying today keeps the streak if yesterday was a study day, otherwise it starts again at 1. */
export function recordStudyDay(state: StreakState, today: LocalDate): StreakState {
  if (state.lastStudyDate === today) return state;
  const current = state.lastStudyDate === addDays(today, -1) ? state.current + 1 : 1;
  return { current, longest: Math.max(state.longest, current), lastStudyDate: today };
}

/** The stored streak is only updated when the user studies, so a missed day must be detected on read. */
export function displayedStreak(state: StreakState, today: LocalDate): number {
  if (!state.lastStudyDate) return 0;
  return state.lastStudyDate === today || state.lastStudyDate === addDays(today, -1) ? state.current : 0;
}
