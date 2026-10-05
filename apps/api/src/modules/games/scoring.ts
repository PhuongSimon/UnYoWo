import type { GameQuestionRecord, SessionSummary } from './entities/game-session.entity.js';

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

/** Results of answered questions in the order they were answered. */
export function answeredResults(questions: GameQuestionRecord[]): boolean[] {
  return questions
    .filter((question) => question.answeredAt)
    .sort((a, b) => (a.answeredAt?.getTime() ?? 0) - (b.answeredAt?.getTime() ?? 0) || a.position - b.position)
    .map((question) => question.isCorrect === true);
}

export function summarize(
  questions: GameQuestionRecord[],
  pointsPerCorrect: number,
  startedAt: Date,
  completedAt: Date,
): SessionSummary {
  const results = answeredResults(questions);
  const correctCount = results.filter(Boolean).length;
  return {
    score: correctCount * pointsPerCorrect,
    correctCount,
    incorrectCount: results.length - correctCount,
    answeredCount: results.length,
    questionCount: questions.length,
    maxCombo: comboStats(results).max,
    durationSeconds: Math.max(0, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000)),
  };
}
