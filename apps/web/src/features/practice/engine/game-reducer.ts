import type { AnswerInput, AnswerResult, GameSession, Question, SessionSummary, SessionTimer } from '../types'
import type { SessionAction } from './session-sync'

export type PendingAnswer = AnswerInput & { questionId: string; idempotencyKey: string; responseMs: number }

interface InGame {
  session: GameSession
  /** Correct answers in a row */
  combo: number
  /** Timed games: the clock ran out while an answer was on its way; finish once it lands */
  timeUp: boolean
}

/** The verdict of the last answer in a game that does not stop for feedback (Speed Challenge). */
export interface Flash {
  questionId: string
  isCorrect: boolean
}

/**
 * One explicit status instead of isLoading/isAnswered/isFinished flags:
 * (ready →) playing → answering → answered → playing … → completing → completed.
 * A failed request keeps its status (with `failed`) so nothing the user did is lost.
 */
export type GameState =
  /** A timed game waiting for the player to press Start */
  | (InGame & { status: 'ready' })
  | (InGame & { status: 'playing'; index: number; revealed: boolean; flash: Flash | null })
  | (InGame & { status: 'answering'; index: number; answer: PendingAnswer; failed: boolean })
  | (InGame & { status: 'answered'; index: number; xpGained: number })
  | (InGame & { status: 'completing'; failed: boolean })
  | { status: 'completed'; session: GameSession; summary: SessionSummary }
  | { status: 'expired'; session: GameSession }

export type QuestionState = Extract<GameState, { index: number }>

export type GameAction =
  | SessionAction
  | { type: 'TIMER_STARTED'; timer: SessionTimer }
  | { type: 'REVEALED' }
  | { type: 'ANSWER_SENT'; answer: PendingAnswer }
  | { type: 'ANSWER_SUCCEEDED'; result: AnswerResult }
  | { type: 'ANSWER_FAILED' }
  | { type: 'RETRY' }
  | { type: 'NEXT' }

/** Games that move on right after an answer instead of showing feedback first. */
const answersWithoutStopping = (session: GameSession, question: Question) =>
  question.kind === 'FLASHCARD' || session.gameType === 'SPEED'

const nextUnanswered = (questions: Question[], from: number) => questions.findIndex((q, i) => i >= from && !q.result)

function moveTo(session: GameSession, combo: number, from: number, flash: Flash | null = null, timeUp = false): GameState {
  const index = timeUp ? -1 : nextUnanswered(session.questions, from)
  return index === -1
    ? { status: 'completing', session, combo, timeUp, failed: false }
    : { status: 'playing', session, combo, timeUp, index, revealed: false, flash }
}

/** Where a loaded (or resumed) session starts: at its first unanswered question, or the Start screen. */
export function initGame(session: GameSession): GameState {
  if (session.status === 'COMPLETED' && session.summary) return { status: 'completed', session, summary: session.summary }
  if (session.status === 'EXPIRED') return { status: 'expired', session }

  const { timer } = session
  if (timer && !timer.startedAt) return { status: 'ready', session, combo: 0, timeUp: false }
  // Reloaded after the clock ran out: nothing left to answer.
  const ranOut = timer?.deadline ? Date.parse(timer.deadline) <= Date.parse(session.serverNow) : false
  return moveTo(session, session.stats.combo, 0, null, ranOut)
}

function answered(question: Question, answer: AnswerInput, result: AnswerResult): Question {
  const verdict = {
    isCorrect: result.isCorrect,
    correctOptionId: result.correctOptionId,
    selectedOptionId: 'optionId' in answer ? answer.optionId : null,
    givenAnswer: 'text' in answer ? answer.text.trim() || null : null,
    rating: 'rating' in answer ? answer.rating : null,
  }
  // A flashcard already has its back; other questions learn the answer from the server now.
  return question.kind === 'FLASHCARD'
    ? { ...question, result: verdict }
    : { ...question, reveal: result.reveal ?? question.reveal, result: verdict }
}

/** Marks a question answered with the server's verdict (shared with the matching board). */
export function withResult(session: GameSession, answer: AnswerInput, result: AnswerResult): GameSession {
  return {
    ...session,
    questions: session.questions.map((question) => (question.id === result.questionId ? answered(question, answer, result) : question)),
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SYNCED':
      return initGame(action.session)

    case 'TIMER_STARTED':
      return state.status === 'ready' ? moveTo({ ...state.session, timer: action.timer }, 0, 0) : state

    case 'TIME_UP':
      if (state.status === 'playing' || state.status === 'answered' || (state.status === 'answering' && action.final)) {
        return { status: 'completing', session: state.session, combo: state.combo, timeUp: true, failed: false }
      }
      // An answer is on its way: let it land, then finish.
      return state.status === 'answering' ? { ...state, timeUp: true } : state

    case 'REVEALED':
      return state.status === 'playing' ? { ...state, revealed: true } : state

    case 'ANSWER_SENT':
      // Ignored unless waiting for an answer: a double tap cannot answer twice.
      return state.status === 'playing'
        ? {
            status: 'answering',
            session: state.session,
            combo: state.combo,
            timeUp: state.timeUp,
            index: state.index,
            answer: action.answer,
            failed: false,
          }
        : state

    case 'ANSWER_SUCCEEDED': {
      if (state.status !== 'answering' || action.result.questionId !== state.answer.questionId) return state
      const session = withResult(state.session, state.answer, action.result)
      const { combo, isCorrect, questionId, xpGained } = action.result
      if (answersWithoutStopping(session, session.questions[state.index])) {
        return moveTo(session, combo, state.index + 1, { questionId, isCorrect }, state.timeUp)
      }
      if (state.timeUp) return { status: 'completing', session, combo, timeUp: true, failed: false }
      return { status: 'answered', session, combo, timeUp: false, index: state.index, xpGained }
    }

    case 'ANSWER_FAILED':
      if (state.status === 'answering' && state.timeUp) {
        return { status: 'completing', session: state.session, combo: state.combo, timeUp: true, failed: false }
      }
      return state.status === 'answering' ? { ...state, failed: true } : state

    case 'COMPLETE_FAILED':
      return state.status === 'completing' ? { ...state, failed: true } : state

    case 'RETRY':
      return state.status === 'answering' || state.status === 'completing' ? { ...state, failed: false } : state

    case 'NEXT':
      return state.status === 'answered' ? moveTo(state.session, state.combo, state.index + 1) : state

    case 'COMPLETE_SUCCEEDED':
      return state.status === 'completing' ? { status: 'completed', session: state.session, summary: action.summary } : state

    case 'EXPIRED':
      return { status: 'expired', session: state.session }
  }
}
