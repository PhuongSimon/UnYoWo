import { useCallback, useEffect, useReducer, useRef } from 'react'
import { practiceApi } from '../api'
import type { GameSession } from '../types'
import { initBoard, matchReducer, type BoardSide, type PendingPair } from './match-reducer'
import { withRetry } from './retry'
import { handleRequestFailure, useSessionCompletion } from './session-sync'

/** Connects the matching board to the API: every pair the user forms is checked by the server. */
export function useMatchingBoard(initialSession: GameSession) {
  const sessionId = initialSession.id
  const [state, dispatch] = useReducer(matchReducer, initialSession, initBoard)
  const lastPairAt = useRef(0)
  const inFlight = useRef(false)

  useEffect(() => {
    lastPairAt.current = performance.now()
  }, [])

  const send = useCallback(
    (pair: PendingPair) => {
      inFlight.current = true
      withRetry(() => practiceApi.submitAnswer(sessionId, pair))
        .then(
          (result) => dispatch({ type: 'PAIR_SUCCEEDED', result }),
          (error: unknown) => handleRequestFailure(error, sessionId, dispatch, { type: 'PAIR_FAILED' }),
        )
        .finally(() => {
          inFlight.current = false
        })
    },
    [sessionId],
  )

  useSessionCompletion(sessionId, state.status === 'completing' && !state.failed, dispatch)

  /** Selects a prompt or a card; picking one of each side submits the pair. */
  const pick = (side: BoardSide, id: string) => {
    if (state.status !== 'playing' || inFlight.current) return
    const other = state.selected
    if (!other || other.side === side) {
      dispatch({ type: 'SELECTED', side, id })
      return
    }

    const now = performance.now()
    const pair: PendingPair = {
      questionId: side === 'prompt' ? id : other.id,
      optionId: side === 'card' ? id : other.id,
      idempotencyKey: crypto.randomUUID(),
      responseMs: Math.round(now - lastPairAt.current),
    }
    lastPairAt.current = now
    dispatch({ type: 'PAIR_SENT', pair })
    send(pair)
  }

  const retry = () => {
    if (state.status === 'answering' && state.failed) {
      dispatch({ type: 'RETRY' })
      send(state.pair)
    } else if (state.status === 'completing' && state.failed) {
      dispatch({ type: 'RETRY' })
    }
  }

  return { state, pick, retry }
}
