import type { Localized } from '@/features/learn/types'

export type GameType = 'FLASHCARD' | 'MULTIPLE_CHOICE' | 'MATCHING' | 'TYPING' | 'LISTENING' | 'SPEED' | 'BUILDER'
export type SessionSource = 'SET' | 'DUE' | 'MISTAKES'
export type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'
export type ChoiceKind =
  | 'TEXT_TO_ROMANIZATION'
  | 'ROMANIZATION_TO_TEXT'
  | 'TEXT_TO_MEANING'
  | 'MEANING_TO_TEXT'
  | 'EMOJI_TO_TEXT'
  | 'AUDIO_TO_TEXT'
  | 'AUDIO_TO_MEANING'
export type QuestionKind = 'FLASHCARD' | 'BUILD' | ChoiceKind
export type ComponentRole = 'INITIAL' | 'VOWEL' | 'FINAL' | 'BASE' | 'SMALL' | 'MARK'

export const REVIEW_RATINGS: ReviewRating[] = ['AGAIN', 'HARD', 'GOOD', 'EASY']

export interface SetProgress {
  seen: number
  mastered: number
  due: number
}

export type PartOfSpeech =
  | 'NOUN'
  | 'VERB'
  | 'ADJECTIVE'
  | 'ADVERB'
  | 'PRONOUN'
  | 'DETERMINER'
  | 'NUMERAL'
  | 'COUNTER'
  | 'PREPOSITION'
  | 'CONJUNCTION'
  | 'PARTICLE'
  | 'INTERJECTION'
  | 'PHRASE'
  | 'AFFIX'

/** One step of an exam ladder: JLPT N5, CEFR B1, TOPIK I */
export interface ProficiencyLevel {
  code: string
  framework: string
  title: Localized
  /** Easiest first */
  sortOrder: number
}

/** A vocabulary topic shared by every language */
export interface Topic {
  slug: string
  title: Localized
  emoji: string | null
}

export interface LearningSet {
  id: string
  languageCode: string
  slug: string
  kind: 'ALPHABET' | 'VOCABULARY'
  script: string | null
  category: string | null
  /** Exam level of a word-list set; null for alphabets and starter sets */
  level: ProficiencyLevel | null
  /** Big topics are split into parts: 1, 2, 3… */
  part: number | null
  topic: Topic | null
  title: Localized
  itemCount: number
  /** Items are built from parts, so the character builder can use this set */
  buildable: boolean
  progress: SetProgress
}

/** A word's meaning per UI language; an English word has no English meaning. */
export type Meaning = Partial<Localized>

/** One entry of a set's word list */
export interface SetItem {
  id: string
  type: 'CHARACTER' | 'SYLLABLE' | 'WORD'
  text: string
  reading: string | null
  romanization: string | null
  ipa: string | null
  meaning: Meaning | null
  partOfSpeech: PartOfSpeech | null
  emoji: string | null
  /** German { article, plural }, Japanese { hanViet, masu }, Korean { hanja } */
  attributes: Record<string, string> | null
  audioUrl: string | null
}

export interface SetItemsPage {
  set: Omit<LearningSet, 'progress'>
  items: SetItem[]
  page: number
  pageSize: number
  total: number
}

/** A dataset the language's words came from, credited in the app */
export interface ContentSource {
  id: string
  name: string
  url: string
  license: string
  attribution: string
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

/** A part the user can place in a builder slot */
export interface BuilderTile extends ChoiceOption {
  slot: number
  role: ComponentRole
}

interface QuestionBase {
  id: string
  position: number
  /** For listening, the text to speak (never shown); for the builder, the romanization to build */
  prompt: string
  /** Recorded clip for listening; null means speech synthesis */
  audioUrl: string | null
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

/** "gok" → pick ㄱ, ㅗ, ㄱ in their slots. `result.correctOptionId` lists the right tiles: "1b|2a|3c". */
export interface BuildQuestion extends QuestionBase {
  kind: 'BUILD'
  options: BuilderTile[]
  reveal: QuestionReveal | null
}

export type Question = FlashcardQuestion | ChoiceQuestion | TypedQuestion | BuildQuestion

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
  /** Timed games only */
  personalBest: { previous: number | null; isNewBest: boolean } | null
}

export interface SessionTimer {
  limitSeconds: number
  startedAt: string | null
  deadline: string | null
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
  /** Timed games only */
  timer: SessionTimer | null
  /** The server's clock when this was sent, to correct the client's countdown */
  serverNow: string
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

export type AnswerInput = { optionId: string } | { rating: ReviewRating } | { text: string } | { parts: string[] }

export interface NewGame {
  gameType: GameType
  language: string
  source: SessionSource
  setId?: string
}
