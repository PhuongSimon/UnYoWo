import { describe, expect, it } from 'vitest'
import type { AnswerResult, ChoiceQuestion, GameSession } from '../types'
import { initBoard, matchedCardIds, matchReducer, type MatchState, type PendingPair } from './match-reducer'

const cards = [
  { id: '1', text: 'nu' },
  { id: '2', text: 'ne' },
]
const pair = (id: string): ChoiceQuestion => ({
  id,
  position: 0,
  kind: 'TEXT_TO_ROMANIZATION',
  prompt: id,
  audioUrl: null,
  options: cards,
  reveal: null,
  result: null,
})

const board: GameSession = {
  id: 's1',
  gameType: 'MATCHING',
  language: 'ja',
  source: 'SET',
  setId: 'set',
  status: 'ACTIVE',
  startedAt: '2026-10-05T00:00:00Z',
  expiresAt: '2026-10-05T01:00:00Z',
  summary: null,
  timer: null,
  serverNow: '2026-10-05T00:00:00Z',
  stats: { combo: 0, mistakes: 0 },
  questions: [pair('ぬ'), pair('ね')],
}

const sent = (questionId: string, optionId: string): PendingPair => ({ questionId, optionId, idempotencyKey: 'k', responseMs: 500 })
const verdict = (questionId: string, completed: boolean, correctOptionId: string | null, combo: number): AnswerResult => ({
  questionId,
  isCorrect: completed,
  questionCompleted: completed,
  correctOptionId,
  reveal: null,
  combo,
  xpGained: completed ? 5 : 0,
  progress: { masteryLevel: 0, dueAt: null },
})

const run = (state: MatchState, ...actions: Parameters<typeof matchReducer>[1][]) => actions.reduce(matchReducer, state)

describe('matching board', () => {
  it('toggles the selected card', () => {
    let state = run(initBoard(board), { type: 'SELECTED', side: 'prompt', id: 'ぬ' })
    expect(state).toMatchObject({ status: 'playing', selected: { side: 'prompt', id: 'ぬ' } })
    state = run(state, { type: 'SELECTED', side: 'prompt', id: 'ぬ' })
    expect(state).toMatchObject({ selected: null })
  })

  it('flashes a wrong pair, counts the mistake and keeps the pair open', () => {
    const state = run(initBoard(board), { type: 'PAIR_SENT', pair: sent('ぬ', '2') }, { type: 'PAIR_SUCCEEDED', result: verdict('ぬ', false, null, 0) })
    expect(state).toMatchObject({ status: 'playing', mistakes: 1, combo: 0, miss: { questionId: 'ぬ', optionId: '2' } })
    expect(state.session.questions[0].result).toBeNull()
  })

  it('locks a right pair and completes when every pair is found', () => {
    let state = run(initBoard(board), { type: 'PAIR_SENT', pair: sent('ぬ', '1') }, { type: 'PAIR_SUCCEEDED', result: verdict('ぬ', true, '1', 1) })
    expect(state).toMatchObject({ status: 'playing', combo: 1 })
    expect(matchedCardIds(state.session)).toEqual(new Set(['1']))

    state = run(state, { type: 'PAIR_SENT', pair: sent('ね', '2') }, { type: 'PAIR_SUCCEEDED', result: verdict('ね', true, '2', 2) })
    expect(state).toMatchObject({ status: 'completing', combo: 2 })
  })

  it('ignores new pairs while one is being checked and keeps it for a retry', () => {
    let state = run(initBoard(board), { type: 'PAIR_SENT', pair: sent('ぬ', '1') })
    expect(run(state, { type: 'PAIR_SENT', pair: sent('ね', '2') })).toBe(state)

    state = run(state, { type: 'PAIR_FAILED' })
    expect(state).toMatchObject({ status: 'answering', failed: true, pair: { questionId: 'ぬ' } })
  })

  it('resumes with the mistakes and combo the server counted', () => {
    expect(initBoard({ ...board, stats: { combo: 3, mistakes: 2 } })).toMatchObject({ combo: 3, mistakes: 2 })
  })
})
