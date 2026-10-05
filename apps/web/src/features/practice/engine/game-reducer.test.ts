import { describe, expect, it } from 'vitest'
import type { AnswerResult, ChoiceQuestion, GameSession } from '../types'
import { gameReducer, initGame, type GameState, type PendingAnswer } from './game-reducer'

const question = (id: string, answered?: boolean): ChoiceQuestion => ({
  id,
  position: Number(id.slice(1)),
  kind: 'TEXT_TO_ROMANIZATION',
  prompt: id,
  options: [
    { id: '1', text: 'a' },
    { id: '2', text: 'b' },
  ],
  reveal: answered === undefined ? null : { text: id, reading: null, romanization: id, meaning: null, emoji: null },
  result: answered === undefined ? null : { isCorrect: answered, correctOptionId: '1', selectedOptionId: '1', givenAnswer: null, rating: null },
})

const session = (questions: ChoiceQuestion[], extra: Partial<GameSession> = {}): GameSession => ({
  id: 's1',
  gameType: 'MULTIPLE_CHOICE',
  language: 'ja',
  source: 'SET',
  setId: 'set',
  status: 'ACTIVE',
  startedAt: '2026-10-04T00:00:00Z',
  expiresAt: '2026-10-04T01:00:00Z',
  summary: null,
  stats: { combo: 0, mistakes: 0 },
  questions,
  ...extra,
})

const pending = (questionId: string): PendingAnswer => ({ questionId, optionId: '1', idempotencyKey: 'k', responseMs: 900 })
const result = (questionId: string, isCorrect: boolean, combo: number): AnswerResult => ({
  questionId,
  isCorrect,
  questionCompleted: true,
  correctOptionId: '1',
  reveal: { text: questionId, reading: null, romanization: questionId, meaning: null, emoji: null },
  combo,
  xpGained: isCorrect ? 5 : 0,
  progress: { masteryLevel: 2, dueAt: null },
})

const run = (state: GameState, ...actions: Parameters<typeof gameReducer>[1][]) => actions.reduce(gameReducer, state)

describe('game state machine', () => {
  it('resumes at the first unanswered question with the current combo', () => {
    const state = initGame(session([question('q0', true), question('q1', true), question('q2')], { stats: { combo: 2, mistakes: 0 } }))
    expect(state).toMatchObject({ status: 'playing', index: 2, combo: 2 })
  })

  it('goes playing → answering → answered → next question', () => {
    let state = initGame(session([question('q0'), question('q1')]))
    state = run(state, { type: 'ANSWER_SENT', answer: pending('q0') })
    expect(state.status).toBe('answering')

    state = run(state, { type: 'ANSWER_SUCCEEDED', result: result('q0', true, 1) })
    expect(state).toMatchObject({ status: 'answered', index: 0, combo: 1 })
    expect(state.session.questions[0].result).toMatchObject({ isCorrect: true, selectedOptionId: '1' })

    expect(run(state, { type: 'NEXT' })).toMatchObject({ status: 'playing', index: 1, revealed: false })
  })

  it('ignores a second answer while the first is on its way', () => {
    const answering = run(initGame(session([question('q0')])), { type: 'ANSWER_SENT', answer: pending('q0') })
    expect(run(answering, { type: 'ANSWER_SENT', answer: { ...pending('q0'), optionId: '2' } })).toBe(answering)
  })

  it('keeps the pending answer when sending fails, so it can be retried', () => {
    let state = run(initGame(session([question('q0')])), { type: 'ANSWER_SENT', answer: pending('q0') }, { type: 'ANSWER_FAILED' })
    expect(state).toMatchObject({ status: 'answering', failed: true, answer: { optionId: '1' } })

    state = run(state, { type: 'RETRY' })
    expect(state).toMatchObject({ status: 'answering', failed: false })
  })

  it('completes after the last question', () => {
    let state = run(
      initGame(session([question('q0')])),
      { type: 'ANSWER_SENT', answer: pending('q0') },
      { type: 'ANSWER_SUCCEEDED', result: result('q0', false, 0) },
      { type: 'NEXT' },
    )
    expect(state.status).toBe('completing')

    const summary = { score: 0, correctCount: 0, incorrectCount: 1, mistakeCount: 1, answeredCount: 1, questionCount: 1, maxCombo: 0, durationSeconds: 4, rewards: { xp: 0, breakdown: [], goals: [], achievements: [], streak: 1, totalXp: 0 } }
    state = run(state, { type: 'COMPLETE_SUCCEEDED', summary })
    expect(state).toMatchObject({ status: 'completed', summary })
  })

  it('opens finished and expired sessions on their final screens', () => {
    const summary = { score: 10, correctCount: 1, incorrectCount: 0, mistakeCount: 0, answeredCount: 1, questionCount: 1, maxCombo: 1, durationSeconds: 3, rewards: { xp: 0, breakdown: [], goals: [], achievements: [], streak: 1, totalXp: 0 } }
    expect(initGame(session([question('q0', true)], { status: 'COMPLETED', summary })).status).toBe('completed')
    expect(initGame(session([question('q0')], { status: 'EXPIRED' })).status).toBe('expired')
  })
})
