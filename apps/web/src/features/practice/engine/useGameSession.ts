import { useCallback, useEffect, useReducer, useRef } from 'react'
import { practiceApi } from '../api'
import type { AnswerInput, GameSession } from '../types'
import { gameReducer, initGame, type PendingAnswer } from './game-reducer'
import { withRetry } from './retry'
import { handleRequestFailure, useSessionCompletion } from './session-sync'

/** Connects the question-by-question state machine to the API. The server keeps every answer, so a reload resumes the session. */
export function useGameSession(initialSession: GameSession) {
  const sessionId = initialSession.id
  const [state, dispatch] = useReducer(gameReducer, initialSession, initGame)
  const shownAt = useRef(0)
  const sentQuestions = useRef(new Set<string>())

  const questionId = 'index' in state ? state.session.questions[state.index].id : null
  useEffect(() => {
    shownAt.current = performance.now()
  }, [questionId])

  const send = useCallback(
    (answer: PendingAnswer) => {
      withRetry(() => practiceApi.submitAnswer(sessionId, answer)).then(
        (result) => dispatch({ type: 'ANSWER_SUCCEEDED', result }),
        (error: unknown) => handleRequestFailure(error, sessionId, dispatch, { type: 'ANSWER_FAILED' }),
      )
    },
    [sessionId],
  )

  useSessionCompletion(sessionId, state.status === 'completing' && !state.failed, dispatch)

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
