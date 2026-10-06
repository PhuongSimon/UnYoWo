import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
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
  // Server clock minus local clock, so the countdown ends when the server says it does.
  const [clockOffset, setClockOffset] = useState(() => offsetFrom(initialSession.serverNow))

  const questionId = 'index' in state ? state.session.questions[state.index].id : null
  useEffect(() => {
    shownAt.current = performance.now()
  }, [questionId])

  const deadline = state.status !== 'completed' && state.status !== 'expired' ? state.session.timer?.deadline : null
  const deadlineAt = deadline ? Date.parse(deadline) - clockOffset : null
  const running = state.status === 'playing' || state.status === 'answering' || state.status === 'answered'

  useEffect(() => {
    if (!running || deadlineAt === null) return
    const timeout = setTimeout(() => dispatch({ type: 'TIME_UP' }), Math.max(0, deadlineAt - Date.now()))
    return () => clearTimeout(timeout)
  }, [running, deadlineAt])

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

  /** Timed games: starts the countdown on the server; rejects so the Start screen can offer a retry. */
  const start = async () => {
    if (state.status !== 'ready') return
    const { timer, serverNow } = await withRetry(() => practiceApi.startSession(sessionId))
    setClockOffset(offsetFrom(serverNow))
    dispatch({ type: 'TIMER_STARTED', timer })
  }

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
    /** Local time (ms) when a timed round ends, or null */
    deadlineAt,
    start,
    answer,
    retry,
    reveal: () => dispatch({ type: 'REVEALED' }),
    next: () => dispatch({ type: 'NEXT' }),
  }
}

const offsetFrom = (serverNow: string) => Date.parse(serverNow) - Date.now()

export type GameController = ReturnType<typeof useGameSession>
