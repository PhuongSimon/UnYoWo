import type { GameQuestionRecord, SessionAttempt, SessionSummary } from './entities/game-session.entity.js';

/** Each correct answer in a row adds this much on top of the base points, up to MAX_COMBO_STEPS times. */
const COMBO_STEP_POINTS = 2;
const MAX_COMBO_STEPS = 5;

/** `current` = correct answers in a row at the end; `max` = longest such run. */
export function comboStats(results: boolean[]): { current: number; max: number } {
  let current = 0;
  let max = 0;
  for (const correct of results) {
    current = correct ? current + 1 : 0;
    max = Math.max(max, current);
  }
  return { current, max };
}

/** 10, 12, 14 … 20 points for answers in a row; a mistake resets the bonus but costs nothing. */
export function scoreAttempts(results: boolean[], pointsPerCorrect: number): number {
  let combo = 0;
  let score = 0;
  for (const correct of results) {
    combo = correct ? combo + 1 : 0;
    if (correct) score += pointsPerCorrect + Math.min(combo - 1, MAX_COMBO_STEPS) * COMBO_STEP_POINTS;
  }
  return score;
}

export function summarize(
  questions: GameQuestionRecord[],
  attempts: SessionAttempt[],
  pointsPerCorrect: number,
  startedAt: Date,
  completedAt: Date,
): SessionSummary {
  const results = attempts.map((attempt) => attempt.isCorrect);
  const answered = questions.filter((question) => question.answeredAt);
  const correctCount = answered.filter((question) => question.isCorrect).length;

  return {
    score: scoreAttempts(results, pointsPerCorrect),
    correctCount,
    incorrectCount: answered.length - correctCount,
    mistakeCount: results.filter((correct) => !correct).length,
    answeredCount: answered.length,
    questionCount: questions.length,
    maxCombo: comboStats(results).max,
    durationSeconds: Math.max(0, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000)),
  };
}
