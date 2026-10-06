import type { SessionRewards } from '../../gamification/entities/gamification.entity.js';
import type {
  ComponentRole,
  GameType,
  QuestionKind,
  ReviewRating,
  SessionSource,
  SessionStatus,
} from '../../../generated/prisma/enums.js';

export type UiLocale = 'en' | 'vi';

// Type aliases rather than interfaces so they can be stored in Prisma JSON columns.

/**
 * `itemId` stays on the server: it would tell the client which option belongs to which item.
 * Builder tiles have no item but belong to a slot (0 = first part) with a role (INITIAL…).
 */
export type ChoiceOption = { id: string; text: string; itemId: string | null; slot?: number; role?: ComponentRole };

/** Everything about the item, shown once the question is answered (or on a flashcard's back). */
export type QuestionReveal = {
  text: string;
  reading: string | null;
  romanization: string | null;
  meaning: string | null;
  emoji: string | null;
};

export interface GeneratedQuestion {
  itemId: string;
  kind: QuestionKind;
  prompt: string;
  options: ChoiceOption[] | null;
  correctOptionId: string | null;
  /** Typing games: every spelling that counts as right */
  acceptedAnswers: string[];
  /** Listening: recorded clip, when the item has one */
  audioUrl: string | null;
  reveal: QuestionReveal;
}

export interface GameQuestionRecord extends GeneratedQuestion {
  id: string;
  position: number;
  answeredAt: Date | null;
  /** True only when answered right on the first try */
  isCorrect: boolean | null;
}

/** One answer in a session, oldest first. A matching pair can take several. */
export interface SessionAttempt {
  questionId: string | null;
  isCorrect: boolean;
  givenAnswer: string | null;
  rating: ReviewRating;
  createdAt: Date;
}

export interface GameSessionRecord {
  id: string;
  userId: string;
  gameType: GameType;
  languageCode: string;
  source: SessionSource;
  setId: string | null;
  locale: UiLocale;
  status: SessionStatus;
  startedAt: Date;
  expiresAt: Date;
  completedAt: Date | null;
  timeLimitSeconds: number | null;
  timerStartedAt: Date | null;
  score: number;
  correctCount: number;
  incorrectCount: number;
  maxCombo: number;
  questions: GameQuestionRecord[];
  attempts: SessionAttempt[];
}

export interface CreateGameSessionData {
  userId: string;
  gameType: GameType;
  languageCode: string;
  source: SessionSource;
  setId: string | null;
  locale: UiLocale;
  expiresAt: Date;
  timeLimitSeconds: number | null;
  questions: (GeneratedQuestion & { position: number })[];
}

export interface CompleteSessionData {
  completedAt: Date;
  score: number;
  correctCount: number;
  incorrectCount: number;
  maxCombo: number;
}

// ─── Shapes sent to the client ───────────────────────────────────────────────

export interface QuestionResultView {
  isCorrect: boolean;
  correctOptionId: string | null;
  selectedOptionId: string | null;
  /** What the user typed (typing games) */
  givenAnswer: string | null;
  rating: ReviewRating | null;
}

export interface QuestionView {
  id: string;
  position: number;
  kind: QuestionKind;
  prompt: string;
  options: { id: string; text: string; slot?: number; role?: ComponentRole }[] | null;
  /** Listening: play this clip; without one the client speaks `prompt` with speech synthesis */
  audioUrl: string | null;
  /** Null until answered, except for flashcards, which are graded by the user. */
  reveal: QuestionReveal | null;
  result: QuestionResultView | null;
}

export interface SessionSummary {
  score: number;
  /** Questions answered right on the first try */
  correctCount: number;
  incorrectCount: number;
  /** Every wrong attempt, including the wrong pairs of a matching board */
  mistakeCount: number;
  answeredCount: number;
  questionCount: number;
  maxCombo: number;
  durationSeconds: number;
}

export interface PersonalBest {
  /** Best score before this session, if there was one */
  previous: number | null;
  isNewBest: boolean;
}

/** A finished session with what it earned (XP, goals, achievements) and, for timed games, the personal best. */
export type CompletedSessionSummary = SessionSummary & { rewards: SessionRewards; personalBest: PersonalBest | null };

export interface SessionTimer {
  limitSeconds: number;
  startedAt: Date | null;
  deadline: Date | null;
}

export interface GameSessionView {
  id: string;
  gameType: GameType;
  language: string;
  source: SessionSource;
  setId: string | null;
  /** EXPIRED is derived: an ACTIVE session past its expiry time */
  status: SessionStatus | 'EXPIRED';
  startedAt: Date;
  expiresAt: Date;
  /** Timed games only */
  timer: SessionTimer | null;
  /** Lets the client correct its clock for the countdown */
  serverNow: Date;
  questions: QuestionView[];
  /** Lets a reloaded game continue with the right combo and mistake count */
  stats: { combo: number; mistakes: number };
  summary: CompletedSessionSummary | null;
}

export interface AnswerResultView {
  questionId: string;
  /** Whether this attempt was right */
  isCorrect: boolean;
  /** False after a wrong matching pair: the question stays open for another try */
  questionCompleted: boolean;
  /** Only sent once the question is completed */
  correctOptionId: string | null;
  reveal: QuestionReveal | null;
  /** Correct answers in a row so far in this session */
  combo: number;
  /** XP this answer earned (0 for a wrong one) */
  xpGained: number;
  progress: { masteryLevel: number; dueAt: Date | null };
}
