import type { GameQuestionRecord, GameSessionRecord, GameSessionView, QuestionView } from './entities/game-session.entity.js';
import { GAME_DEFINITIONS } from './game-definitions.js';
import { summarize } from './scoring.js';

export function isExpired(session: GameSessionRecord, now: Date): boolean {
  return session.status === 'ACTIVE' && session.expiresAt <= now;
}

/** Hides the answer of every unanswered multiple-choice question. */
export function toQuestionView(question: GameQuestionRecord): QuestionView {
  const answered = question.answeredAt !== null;
  const given = question.lastAttempt?.givenAnswer ?? null;

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
          rating: question.lastAttempt?.rating ?? null,
        }
      : null,
  };
}

export function toSessionView(session: GameSessionRecord, now: Date): GameSessionView {
  return {
    id: session.id,
    gameType: session.gameType,
    language: session.languageCode,
    source: session.source,
    setId: session.setId,
    status: isExpired(session, now) ? 'EXPIRED' : session.status,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    questions: session.questions.map(toQuestionView),
    summary:
      session.status === 'COMPLETED' && session.completedAt
        ? summarize(session.questions, GAME_DEFINITIONS[session.gameType].pointsPerCorrect, session.startedAt, session.completedAt)
        : null,
  };
}
