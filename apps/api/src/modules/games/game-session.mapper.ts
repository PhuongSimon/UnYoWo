import type {
  GameQuestionRecord,
  GameSessionRecord,
  GameSessionView,
  QuestionView,
  SessionAttempt,
} from './entities/game-session.entity.js';
import { GAME_DEFINITIONS } from './game-definitions.js';
import { comboStats, summarize } from './scoring.js';

export function isExpired(session: GameSessionRecord, now: Date): boolean {
  return session.status === 'ACTIVE' && session.expiresAt <= now;
}

/** Hides the answer of every unanswered question; flashcards are graded by the user, so their back is shown. */
export function toQuestionView(question: GameQuestionRecord, lastAttempt: SessionAttempt | undefined): QuestionView {
  const answered = question.answeredAt !== null;
  const given = lastAttempt?.givenAnswer ?? null;

  return {
    id: question.id,
    position: question.position,
    kind: question.kind,
    prompt: question.prompt,
    options: question.options?.map(({ id, text }) => ({ id, text })) ?? null,
    reveal: answered || question.kind === 'FLASHCARD' ? question.reveal : null,
    result: answered
      ? {
          isCorrect: question.isCorrect === true,
          correctOptionId: question.correctOptionId,
          selectedOptionId: question.options?.find((option) => option.text === given)?.id ?? null,
          givenAnswer: given,
          rating: lastAttempt?.rating ?? null,
        }
      : null,
  };
}

export function toSessionView(session: GameSessionRecord, now: Date): GameSessionView {
  const lastAttempts = new Map(session.attempts.map((attempt) => [attempt.questionId, attempt]));
  const results = session.attempts.map((attempt) => attempt.isCorrect);

  return {
    id: session.id,
    gameType: session.gameType,
    language: session.languageCode,
    source: session.source,
    setId: session.setId,
    status: isExpired(session, now) ? 'EXPIRED' : session.status,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    questions: session.questions.map((question) => toQuestionView(question, lastAttempts.get(question.id))),
    stats: { combo: comboStats(results).current, mistakes: results.filter((correct) => !correct).length },
    summary:
      session.status === 'COMPLETED' && session.completedAt
        ? summarize(
            session.questions,
            session.attempts,
            GAME_DEFINITIONS[session.gameType].pointsPerCorrect,
            session.startedAt,
            session.completedAt,
          )
        : null,
  };
}
