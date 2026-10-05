import type { Localized } from '@/features/learn/types'

export type GameType = 'FLASHCARD' | 'MULTIPLE_CHOICE' | 'MATCHING' | 'TYPING'
export type SessionSource = 'SET' | 'DUE' | 'MISTAKES'
export type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'
export type ChoiceKind = 'TEXT_TO_ROMANIZATION' | 'ROMANIZATION_TO_TEXT' | 'TEXT_TO_MEANING' | 'MEANING_TO_TEXT' | 'EMOJI_TO_TEXT'
export type QuestionKind = 'FLASHCARD' | ChoiceKind

export const REVIEW_RATINGS: ReviewRating[] = ['AGAIN', 'HARD', 'GOOD', 'EASY']

export interface SetProgress {
  seen: number
  mastered: number
  due: number
}

export interface LearningSet {
  id: string
  languageCode: string
  slug: string
  kind: 'ALPHABET' | 'VOCABULARY'
  script: string | null
  category: string | null
  title: Localized
  itemCount: number
  progress: SetProgress
}

export interface QuestionReveal {
  text: string
  reading: string | null
  romanization: string | null
  meaning: string | null
  emoji: string | null
}

export interface QuestionResult {
  isCorrect: boolean
  correctOptionId: string | null
  selectedOptionId: string | null
  /** What the user typed (typing game) */
  givenAnswer: string | null
  rating: ReviewRating | null
}

export interface ChoiceOption {
  id: string
  text: string
}

interface QuestionBase {
  id: string
  position: number
  prompt: string
  result: QuestionResult | null
}

/** Graded by the user, so the back of the card is known up front. */
export interface FlashcardQuestion extends QuestionBase {
  kind: 'FLASHCARD'
  options: null
  reveal: QuestionReveal
}

/** The right answer is only revealed by the server after answering. On a matching board every pair shares the same cards. */
export interface ChoiceQuestion extends QuestionBase {
  kind: ChoiceKind
  options: ChoiceOption[]
  reveal: QuestionReveal | null
}

/** Answered by typing; the accepted spellings stay on the server. */
export interface TypedQuestion extends QuestionBase {
  kind: ChoiceKind
  options: null
  reveal: QuestionReveal | null
}

export type Question = FlashcardQuestion | ChoiceQuestion | TypedQuestion

export type XpSource = 'ANSWER' | 'SESSION_COMPLETE' | 'PERFECT_SESSION' | 'DAILY_GOAL'

/** What a finished session earned; decided entirely by the server. */
export interface SessionRewards {
  xp: number
  breakdown: { source: XpSource; amount: number; count: number }[]
  /** Daily goal keys completed during the session */
  goals: string[]
  /** Achievement keys unlocked by the session */
  achievements: string[]
  streak: number
  totalXp: number
}

export interface SessionSummary {
  score: number
  /** Answered right on the first try */
  correctCount: number
  incorrectCount: number
  /** Every wrong attempt, including wrong matching pairs */
  mistakeCount: number
  answeredCount: number
  questionCount: number
  maxCombo: number
  durationSeconds: number
  rewards: SessionRewards
}

export interface GameSession {
  id: string
  gameType: GameType
  language: string
  source: SessionSource
  setId: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED'
  startedAt: string
  expiresAt: string
  questions: Question[]
  stats: { combo: number; mistakes: number }
  summary: SessionSummary | null
}

export interface AnswerResult {
  questionId: string
  /** Whether this attempt was right */
  isCorrect: boolean
  /** False after a wrong matching pair: the pair stays open */
  questionCompleted: boolean
  correctOptionId: string | null
  reveal: QuestionReveal | null
  combo: number
  /** XP this answer earned */
  xpGained: number
  progress: { masteryLevel: number; dueAt: string | null }
}

export type AnswerInput = { optionId: string } | { rating: ReviewRating } | { text: string }

export interface NewGame {
  gameType: GameType
  language: string
  source: SessionSource
  setId?: string
}
