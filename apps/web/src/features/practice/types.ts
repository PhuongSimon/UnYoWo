import type { Localized } from '@/features/learn/types'

export type GameType = 'FLASHCARD' | 'MULTIPLE_CHOICE'
export type SessionSource = 'SET' | 'DUE'
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

/** The right answer is only revealed by the server after answering. */
export interface ChoiceQuestion extends QuestionBase {
  kind: ChoiceKind
  options: ChoiceOption[]
  reveal: QuestionReveal | null
}

export type Question = FlashcardQuestion | ChoiceQuestion

export interface SessionSummary {
  score: number
  correctCount: number
  incorrectCount: number
  answeredCount: number
  questionCount: number
  maxCombo: number
  durationSeconds: number
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
  summary: SessionSummary | null
}

export interface AnswerResult {
  questionId: string
  isCorrect: boolean
  correctOptionId: string | null
  reveal: QuestionReveal
  combo: number
  progress: { masteryLevel: number; dueAt: string | null }
}

export type AnswerInput = { optionId: string } | { rating: ReviewRating }

export interface NewGame {
  gameType: GameType
  language: string
  source: SessionSource
  setId?: string
}
