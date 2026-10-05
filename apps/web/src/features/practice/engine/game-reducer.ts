import type { AnswerInput, AnswerResult, GameSession, Question, SessionSummary } from '../types'
import type { SessionAction } from './session-sync'

export type PendingAnswer = AnswerInput & { questionId: string; idempotencyKey: string; responseMs: number }

interface InGame {
  session: GameSession
  /** Correct answers in a row */
  combo: number
}

/**
 * One explicit status instead of isLoading/isAnswered/isFinished flags:
 * playing → answering → answered → playing … → completing → completed.
 * A failed request keeps its status (with `failed`) so nothing the user did is lost.
 */
export type GameState =
  | (InGame & { status: 'playing'; index: number; revealed: boolean })
  | (InGame & { status: 'answering'; index: number; answer: PendingAnswer; failed: boolean })
  | (InGame & { status: 'answered'; index: number })
  | (InGame & { status: 'completing'; failed: boolean })
  | { status: 'completed'; session: GameSession; summary: SessionSummary }
  | { status: 'expired'; session: GameSession }

export type QuestionState = Extract<GameState, { index: number }>

export type GameAction =
  | SessionAction
  | { type: 'REVEALED' }
  | { type: 'ANSWER_SENT'; answer: PendingAnswer }
  | { type: 'ANSWER_SUCCEEDED'; result: AnswerResult }
  | { type: 'ANSWER_FAILED' }
  | { type: 'RETRY' }
  | { type: 'NEXT' }

const nextUnanswered = (questions: Question[], from: number) => questions.findIndex((q, i) => i >= from && !q.result)

function moveTo(session: GameSession, combo: number, from: number): GameState {
  const index = nextUnanswered(session.questions, from)
  return index === -1
    ? { status: 'completing', session, combo, failed: false }
    : { status: 'playing', session, combo, index, revealed: false }
}

/** Where a loaded (or resumed) session starts: at its first unanswered question. */
export function initGame(session: GameSession): GameState {
  if (session.status === 'COMPLETED' && session.summary) return { status: 'completed', session, summary: session.summary }
  if (session.status === 'EXPIRED') return { status: 'expired', session }
  return moveTo(session, session.stats.combo, 0)
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

    case 'REVEALED':
      return state.status === 'playing' ? { ...state, revealed: true } : state

    case 'ANSWER_SENT':
      // Ignored unless waiting for an answer: a double tap cannot answer twice.
      return state.status === 'playing'
        ? { status: 'answering', session: state.session, combo: state.combo, index: state.index, answer: action.answer, failed: false }
        : state

    case 'ANSWER_SUCCEEDED': {
      if (state.status !== 'answering' || action.result.questionId !== state.answer.questionId) return state
      const session = withResult(state.session, state.answer, action.result)
      // A flashcard is graded by the user, so there is no feedback to read: go straight on.
      if (session.questions[state.index].kind === 'FLASHCARD') return moveTo(session, action.result.combo, state.index + 1)
      return { status: 'answered', session, combo: action.result.combo, index: state.index }
    }

    case 'ANSWER_FAILED':
    case 'COMPLETE_FAILED':
      return state.status === 'answering' || state.status === 'completing' ? { ...state, failed: true } : state

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
