import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { practiceApi } from '../api'
import type { AnswerResult, GameSession, QuestionReveal, SessionSummary } from '../types'
import PlayPage from './PlayPage'

vi.mock('@/components/BunnyMascot', () => ({ default: () => null }))
vi.mock('../api', () => ({
  practiceApi: { getSession: vi.fn(), submitAnswer: vi.fn(), completeSession: vi.fn(), createSession: vi.fn() },
}))

const api = vi.mocked(practiceApi)

const reveal = (text: string, romanization: string): QuestionReveal => ({ text, reading: null, romanization, meaning: null, emoji: null })
const summary: SessionSummary = { score: 10, correctCount: 1, incorrectCount: 1, answeredCount: 2, questionCount: 2, maxCombo: 1, durationSeconds: 42 }

const baseSession = {
  id: 's1',
  language: 'ja',
  source: 'SET',
  setId: 'set-1',
  status: 'ACTIVE',
  startedAt: '2026-10-04T00:00:00Z',
  expiresAt: '2099-01-01T00:00:00Z',
  summary: null,
} as const

const flashcards: GameSession = {
  ...baseSession,
  gameType: 'FLASHCARD',
  questions: [
    { id: 'q1', position: 0, kind: 'FLASHCARD', prompt: 'ぬ', options: null, reveal: reveal('ぬ', 'nu'), result: null },
    { id: 'q2', position: 1, kind: 'FLASHCARD', prompt: 'め', options: null, reveal: reveal('め', 'me'), result: null },
  ],
}

const quiz: GameSession = {
  ...baseSession,
  gameType: 'MULTIPLE_CHOICE',
  questions: [
    {
      id: 'q1',
      position: 0,
      kind: 'TEXT_TO_ROMANIZATION',
      prompt: 'ぬ',
      options: [
        { id: '1', text: 'nu' },
        { id: '2', text: 'ne' },
      ],
      reveal: null,
      result: null,
    },
  ],
}

function answerResult(questionId: string, isCorrect: boolean, correctOptionId: string | null = null): AnswerResult {
  return { questionId, isCorrect, correctOptionId, reveal: reveal('ぬ', 'nu'), combo: isCorrect ? 1 : 0, progress: { masteryLevel: 2, dueAt: null } }
}

function renderPlay() {
  const router = createMemoryRouter([{ path: '/app/play/:sessionId', element: <PlayPage /> }], {
    initialEntries: ['/app/play/s1'],
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('PlayPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.completeSession.mockResolvedValue(summary)
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('runs a flashcard round: show the answer, rate it, see the results', async () => {
    api.getSession.mockResolvedValue(flashcards)
    api.submitAnswer.mockImplementation(async (_id, body) => answerResult(body.questionId, !('rating' in body) || body.rating !== 'AGAIN'))
    const user = userEvent.setup()
    renderPlay()

    expect(await screen.findByText('ぬ')).toBeInTheDocument()
    expect(screen.queryByText('nu')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByText('nu')).toBeInTheDocument()

    await user.keyboard('3')
    expect(api.submitAnswer).toHaveBeenCalledWith('s1', expect.objectContaining({ questionId: 'q1', rating: 'GOOD' }))

    expect(await screen.findByText('め')).toBeInTheDocument()
    await user.keyboard(' ')
    await user.click(screen.getByRole('button', { name: /Easy/ }))

    expect(await screen.findByRole('heading', { name: 'Round complete!' })).toBeInTheDocument()
    expect(api.completeSession).toHaveBeenCalledWith('s1')
    expect(screen.getByText('0:42')).toBeInTheDocument()
  })

  it('shows the verdict of a quiz answer in Vietnamese and sends it only once', async () => {
    await i18n.changeLanguage('vi')
    api.getSession.mockResolvedValue(quiz)
    api.submitAnswer.mockResolvedValue(answerResult('q1', false, '1'))
    const user = userEvent.setup()
    renderPlay()

    expect(await screen.findByText('Chữ này đọc là gì?')).toBeInTheDocument()
    await user.keyboard('22')

    expect(await screen.findByText('Chưa đúng')).toBeInTheDocument()
    expect(api.submitAnswer).toHaveBeenCalledTimes(1)
    expect(api.submitAnswer).toHaveBeenCalledWith('s1', expect.objectContaining({ questionId: 'q1', optionId: '2' }))
    expect(screen.getByText('(đáp án đúng)')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Xem kết quả/ }))
    expect(await screen.findByRole('heading', { name: 'Hoàn thành lượt chơi!' })).toBeInTheDocument()
  })

  it('keeps the answer when saving fails and sends it again with the same key', async () => {
    api.getSession.mockResolvedValue(quiz)
    const rejected = Object.assign(new Error('Bad request'), {
      isAxiosError: true,
      response: { data: { statusCode: 400, code: 'VALIDATION_ERROR' } },
    })
    api.submitAnswer.mockRejectedValueOnce(rejected).mockResolvedValueOnce(answerResult('q1', true, '1'))
    const user = userEvent.setup()
    renderPlay()

    await user.click(await screen.findByRole('button', { name: 'nu' }))
    expect(await screen.findByRole('alert')).toHaveTextContent("Your answer couldn't be saved")

    await user.click(screen.getByRole('button', { name: /Try again/ }))
    expect(await screen.findByText('Correct!')).toBeInTheDocument()

    const [first, second] = api.submitAnswer.mock.calls.map(([, body]) => body.idempotencyKey)
    expect(second).toBe(first)
  })

  it('shows a not-found page for a session that is not yours', async () => {
    api.getSession.mockRejectedValue(
      Object.assign(new Error('Not found'), { isAxiosError: true, response: { data: { statusCode: 404, code: 'GAME_SESSION_NOT_FOUND' } } }),
    )
    renderPlay()
    await waitFor(() => expect(screen.getByText('Nothing here yet')).toBeInTheDocument())
  })
})
