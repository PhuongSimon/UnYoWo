import type { SessionRewards } from '../gamification/entities/gamification.entity.js';
import type {
  GameQuestionRecord,
  PersonalBest,
  SessionTimer,
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
    options: question.options?.map(({ itemId: _itemId, ...option }) => option) ?? null,
    audioUrl: question.audioUrl,
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

export function timerOf(session: GameSessionRecord): SessionTimer | null {
  if (!session.timeLimitSeconds) return null;
  const { timeLimitSeconds, timerStartedAt } = session;
  return {
    limitSeconds: timeLimitSeconds,
    startedAt: timerStartedAt,
    deadline: timerStartedAt ? new Date(timerStartedAt.getTime() + timeLimitSeconds * 1000) : null,
  };
}

/** `rewards` and `personalBest` are only needed (and only loaded) for a completed session. */
export function toSessionView(
  session: GameSessionRecord,
  now: Date,
  rewards: SessionRewards | null = null,
  personalBest: PersonalBest | null = null,
): GameSessionView {
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
    timer: timerOf(session),
    serverNow: now,
    questions: session.questions.map((question) => toQuestionView(question, lastAttempts.get(question.id))),
    stats: { combo: comboStats(results).current, mistakes: results.filter((correct) => !correct).length },
    summary:
      session.status === 'COMPLETED' && session.completedAt && rewards
        ? {
            ...summarize(
              session.questions,
              session.attempts,
              GAME_DEFINITIONS[session.gameType].pointsPerCorrect,
              session.startedAt,
              session.completedAt,
            ),
            rewards,
            personalBest,
          }
        : null,
  };
}
