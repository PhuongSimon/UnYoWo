import type {
  GameType,
  QuestionKind,
  ReviewRating,
  SessionSource,
  SessionStatus,
} from '../../../generated/prisma/enums.js';

export type UiLocale = 'en' | 'vi';

// Type aliases rather than interfaces so they can be stored in Prisma JSON columns.

/** `itemId` stays on the server: it would tell the client which option belongs to which item. */
export type ChoiceOption = { id: string; text: string; itemId: string };

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
  options: { id: string; text: string }[] | null;
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
  questions: QuestionView[];
  /** Lets a reloaded game continue with the right combo and mistake count */
  stats: { combo: number; mistakes: number };
  summary: SessionSummary | null;
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
  progress: { masteryLevel: number; dueAt: Date | null };
}
