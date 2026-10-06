import type { AnswerResult, ChoiceOption, GameSession, SessionSummary } from '../types'
import { withResult } from './game-reducer'
import type { SessionAction } from './session-sync'

/** A matching board has prompts (ぬ, Apfel) on one side and answer cards (nu, quả táo) on the other. */
export type BoardSide = 'prompt' | 'card'

export interface PendingPair {
  questionId: string
  optionId: string
  idempotencyKey: string
  responseMs: number
}

interface OnBoard {
  session: GameSession
  combo: number
  mistakes: number
}

/**
 * Unlike the question-by-question games there is no "current question": the user picks
 * a prompt and a card in either order. A wrong pair is flashed (`miss`) and stays open.
 */
export type MatchState =
  | (OnBoard & {
      status: 'playing'
      selected: { side: BoardSide; id: string } | null
      miss: { questionId: string; optionId: string } | null
    })
  | (OnBoard & { status: 'answering'; pair: PendingPair; failed: boolean })
  | (OnBoard & { status: 'completing'; failed: boolean })
  | { status: 'completed'; session: GameSession; summary: SessionSummary }
  | { status: 'expired'; session: GameSession }

export type MatchAction =
  | SessionAction
  | { type: 'SELECTED'; side: BoardSide; id: string }
  | { type: 'PAIR_SENT'; pair: PendingPair }
  | { type: 'PAIR_SUCCEEDED'; result: AnswerResult }
  | { type: 'PAIR_FAILED' }
  | { type: 'RETRY' }

/** Every pair shares the same answer cards. */
export const boardCards = (session: GameSession): ChoiceOption[] => session.questions[0]?.options ?? []

export function matchedCardIds(session: GameSession): Set<string> {
  return new Set(session.questions.flatMap((question) => question.result?.correctOptionId ?? []))
}

const allMatched = (session: GameSession) => session.questions.every((question) => question.result)

function backToBoard(board: OnBoard, miss: { questionId: string; optionId: string } | null = null): MatchState {
  return allMatched(board.session)
    ? { ...board, status: 'completing', failed: false }
    : { ...board, status: 'playing', selected: null, miss }
}

export function initBoard(session: GameSession): MatchState {
  if (session.status === 'COMPLETED' && session.summary) return { status: 'completed', session, summary: session.summary }
  if (session.status === 'EXPIRED') return { status: 'expired', session }
  return backToBoard({ session, combo: session.stats.combo, mistakes: session.stats.mistakes })
}

export function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SYNCED':
      return initBoard(action.session)

    case 'SELECTED': {
      if (state.status !== 'playing') return state
      const same = state.selected?.side === action.side && state.selected.id === action.id
      return { ...state, selected: same ? null : { side: action.side, id: action.id }, miss: null }
    }

    case 'PAIR_SENT':
      return state.status === 'playing'
        ? { status: 'answering', session: state.session, combo: state.combo, mistakes: state.mistakes, pair: action.pair, failed: false }
        : state

    case 'PAIR_SUCCEEDED': {
      if (state.status !== 'answering' || action.result.questionId !== state.pair.questionId) return state
      const { session, mistakes, pair } = state
      if (!action.result.questionCompleted) {
        return backToBoard({ session, combo: 0, mistakes: mistakes + 1 }, { questionId: pair.questionId, optionId: pair.optionId })
      }
      return backToBoard({ session: withResult(session, { optionId: pair.optionId }, action.result), combo: action.result.combo, mistakes })
    }

    case 'PAIR_FAILED':
    case 'COMPLETE_FAILED':
      return state.status === 'answering' || state.status === 'completing' ? { ...state, failed: true } : state

    case 'RETRY':
      return state.status === 'answering' || state.status === 'completing' ? { ...state, failed: false } : state

    case 'COMPLETE_SUCCEEDED':
      return state.status === 'completing' ? { status: 'completed', session: state.session, summary: action.summary } : state

    case 'EXPIRED':
      return { status: 'expired', session: state.session }

    // Matching boards are not timed.
    case 'TIME_UP':
      return state
  }
}
