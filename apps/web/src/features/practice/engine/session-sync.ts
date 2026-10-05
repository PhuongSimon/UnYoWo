import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getApiError } from '@/lib/api-error'
import { practiceApi } from '../api'
import type { GameSession, SessionSummary } from '../types'
import { withRetry } from './retry'

/** Actions every game engine understands: the session-level part of a game. */
export type SessionAction =
  /** Replaces local state with the server's copy, e.g. after another tab answered. */
  | { type: 'SYNCED'; session: GameSession }
  | { type: 'EXPIRED' }
  | { type: 'COMPLETE_SUCCEEDED'; summary: SessionSummary }
  | { type: 'COMPLETE_FAILED' }

/** A request failed for good: expire, resync with the server, or show a retry button (`failed`). */
export function handleRequestFailure<const A extends { type: string }>(
  error: unknown,
  sessionId: string,
  dispatch: (action: SessionAction | A) => void,
  failed: A,
) {
  const { code } = getApiError(error)
  if (code === 'GAME_SESSION_EXPIRED') return dispatch({ type: 'EXPIRED' })
  if (code === 'QUESTION_ALREADY_ANSWERED' || code === 'GAME_SESSION_COMPLETED') {
    practiceApi.getSession(sessionId).then(
      (session) => dispatch({ type: 'SYNCED', session }),
      () => dispatch(failed),
    )
    return
  }
  dispatch(failed)
}

/** Saves the result while `completing` is true. Completing is idempotent on the server, so retries are safe. */
export function useSessionCompletion(sessionId: string, completing: boolean, dispatch: (action: SessionAction) => void) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!completing) return
    let active = true
    withRetry(() => practiceApi.completeSession(sessionId)).then(
      (summary) => {
        // XP, streak, goals, achievements and set progress have all changed.
        void queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey[0] !== 'game-session' })
        if (active) dispatch({ type: 'COMPLETE_SUCCEEDED', summary })
      },
      (error: unknown) => active && handleRequestFailure(error, sessionId, dispatch, { type: 'COMPLETE_FAILED' }),
    )
    return () => {
      active = false
    }
  }, [completing, sessionId, dispatch, queryClient])
}
