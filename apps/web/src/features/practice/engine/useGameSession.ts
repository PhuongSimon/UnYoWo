import { useCallback, useEffect, useReducer, useRef } from 'react'
import { getApiError } from '@/lib/api-error'
import { practiceApi } from '../api'
import type { AnswerInput, GameSession } from '../types'
import { gameReducer, initGame, type GameAction, type PendingAnswer } from './game-reducer'
import { withRetry } from './retry'

/** Connects the game state machine to the API. The server keeps every answer, so a reload resumes the session. */
export function useGameSession(initialSession: GameSession) {
  const sessionId = initialSession.id
  const [state, dispatch] = useReducer(gameReducer, initialSession, initGame)
  const shownAt = useRef(0)
  const sentQuestions = useRef(new Set<string>())

  const questionId = 'index' in state ? state.session.questions[state.index].id : null
  useEffect(() => {
    shownAt.current = performance.now()
  }, [questionId])

  const fail = useCallback(
    (error: unknown, failed: GameAction) => {
      const { code } = getApiError(error)
      if (code === 'GAME_SESSION_EXPIRED') return dispatch({ type: 'EXPIRED' })
      if (code === 'QUESTION_ALREADY_ANSWERED' || code === 'GAME_SESSION_COMPLETED') {
        // Another tab got there first: continue from the server's copy.
        practiceApi.getSession(sessionId).then((session) => dispatch({ type: 'SYNCED', session }), () => dispatch(failed))
        return
      }
      dispatch(failed)
    },
    [sessionId],
  )

  const send = useCallback(
    (answer: PendingAnswer) => {
      withRetry(() => practiceApi.submitAnswer(sessionId, answer)).then(
        (result) => dispatch({ type: 'ANSWER_SUCCEEDED', result }),
        (error: unknown) => fail(error, { type: 'ANSWER_FAILED' }),
      )
    },
    [sessionId, fail],
  )

  const completing = state.status === 'completing' && !state.failed
  useEffect(() => {
    if (!completing) return
    let active = true
    withRetry(() => practiceApi.completeSession(sessionId)).then(
      (summary) => active && dispatch({ type: 'COMPLETE_SUCCEEDED', summary }),
      (error: unknown) => active && fail(error, { type: 'COMPLETE_FAILED' }),
    )
    return () => {
      active = false
    }
  }, [completing, sessionId, fail])

  const answer = (input: AnswerInput) => {
    if (state.status !== 'playing') return
    const question = state.session.questions[state.index]
    // Two taps in the same frame both see "playing"; only the first may reach the server.
    if (sentQuestions.current.has(question.id)) return
    sentQuestions.current.add(question.id)

    const pending: PendingAnswer = {
      ...input,
      questionId: question.id,
      // The same key is reused on retry, so the server records the answer once.
      idempotencyKey: crypto.randomUUID(),
      responseMs: Math.round(performance.now() - shownAt.current),
    }
    dispatch({ type: 'ANSWER_SENT', answer: pending })
    send(pending)
  }

  const retry = () => {
    if (state.status === 'answering' && state.failed) {
      dispatch({ type: 'RETRY' })
      send(state.answer)
    } else if (state.status === 'completing' && state.failed) {
      dispatch({ type: 'RETRY' })
    }
  }

  return {
    state,
    answer,
    retry,
    reveal: () => dispatch({ type: 'REVEALED' }),
    next: () => dispatch({ type: 'NEXT' }),
  }
}

export type GameController = ReturnType<typeof useGameSession>
