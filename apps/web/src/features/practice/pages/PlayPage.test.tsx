import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { practiceApi } from '../api'
import { playClip } from '../audio/audio-provider'
import type { AnswerResult, GameSession, QuestionReveal, SessionSummary } from '../types'
import PlayPage from './PlayPage'

vi.mock('@/components/BunnyMascot', () => ({ default: () => null }))
vi.mock('../api', () => ({
  practiceApi: { getSession: vi.fn(), submitAnswer: vi.fn(), completeSession: vi.fn(), createSession: vi.fn(), startSession: vi.fn() },
}))
vi.mock('../audio/audio-provider', () => ({
  canPlay: () => true,
  playClip: vi.fn(() => Promise.resolve()),
  stopClips: vi.fn(),
}))

const api = vi.mocked(practiceApi)

const reveal = (text: string, romanization: string): QuestionReveal => ({ text, reading: null, romanization, meaning: null, emoji: null })
const summary: SessionSummary = {
  score: 10,
  correctCount: 1,
  incorrectCount: 1,
  mistakeCount: 1,
  answeredCount: 2,
  questionCount: 2,
  maxCombo: 1,
  durationSeconds: 42,
  rewards: {
    xp: 45,
    breakdown: [
      { source: 'ANSWER', amount: 5, count: 1 },
      { source: 'SESSION_COMPLETE', amount: 20, count: 1 },
      { source: 'DAILY_GOAL', amount: 20, count: 1 },
    ],
    goals: ['PLAY_GAME'],
    achievements: ['FIRST_STEPS'],
    streak: 3,
    totalXp: 120,
  },
  personalBest: null,
}

const baseSession = {
  id: 's1',
  language: 'ja',
  source: 'SET',
  setId: 'set-1',
  status: 'ACTIVE',
  startedAt: '2026-10-04T00:00:00Z',
  expiresAt: '2099-01-01T00:00:00Z',
  summary: null,
  timer: null,
  serverNow: '2026-10-04T00:00:00Z',
  stats: { combo: 0, mistakes: 0 },
} as const

const flashcards: GameSession = {
  ...baseSession,
  gameType: 'FLASHCARD',
  questions: [
    { id: 'q1', position: 0, kind: 'FLASHCARD', prompt: 'ぬ', audioUrl: null, options: null, reveal: reveal('ぬ', 'nu'), result: null },
    { id: 'q2', position: 1, kind: 'FLASHCARD', prompt: 'め', audioUrl: null, options: null, reveal: reveal('め', 'me'), result: null },
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
      audioUrl: null,
      options: [
        { id: '1', text: 'nu' },
        { id: '2', text: 'ne' },
      ],
      reveal: null,
      result: null,
    },
  ],
}

const typing: GameSession = {
  ...baseSession,
  gameType: 'TYPING',
  language: 'de',
  questions: [
    { id: 'q1', position: 0, kind: 'MEANING_TO_TEXT', prompt: 'quả táo', audioUrl: null, options: null, reveal: null, result: null },
    { id: 'q2', position: 1, kind: 'MEANING_TO_TEXT', prompt: 'bánh mì', audioUrl: null, options: null, reveal: null, result: null },
  ],
}

const cards = [
  { id: '1', text: 'ne' },
  { id: '2', text: 'nu' },
]
const matching: GameSession = {
  ...baseSession,
  gameType: 'MATCHING',
  questions: [
    { id: 'q1', position: 0, kind: 'TEXT_TO_ROMANIZATION', prompt: 'ぬ', audioUrl: null, options: cards, reveal: null, result: null },
    { id: 'q2', position: 1, kind: 'TEXT_TO_ROMANIZATION', prompt: 'ね', audioUrl: null, options: cards, reveal: null, result: null },
  ],
}

function answerResult(questionId: string, isCorrect: boolean, correctOptionId: string | null = null): AnswerResult {
  return {
    questionId,
    isCorrect,
    questionCompleted: true,
    correctOptionId,
    reveal: reveal('ぬ', 'nu'),
    combo: isCorrect ? 1 : 0,
    xpGained: isCorrect ? 5 : 0,
    progress: { masteryLevel: 2, dueAt: null },
  }
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
    expect(screen.getByText('+45 XP')).toBeInTheDocument()
    expect(screen.getByText('Goal reached: finish a round')).toBeInTheDocument()
    expect(screen.getByText('First steps')).toBeInTheDocument()
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
    expect(screen.getByText('+5 XP')).toBeInTheDocument()

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

  it('checks a typed answer on the server and shows what was typed when wrong', async () => {
    await i18n.changeLanguage('vi')
    api.getSession.mockResolvedValue(typing)
    api.submitAnswer
      .mockResolvedValueOnce({ ...answerResult('q1', true), reveal: { text: 'Apfel', reading: null, romanization: null, meaning: 'quả táo', emoji: '🍎' } })
      .mockResolvedValueOnce({ ...answerResult('q2', false), reveal: { text: 'Brot', reading: null, romanization: null, meaning: 'bánh mì', emoji: '🍞' } })
    const user = userEvent.setup()
    renderPlay()

    const input = await screen.findByRole('textbox', { name: 'Câu trả lời của bạn' })
    expect(screen.getByText('Có thể gõ kèm mạo từ, ví dụ: der Apfel.')).toBeInTheDocument()
    await user.type(input, 'der Apfel{Enter}')
    expect(api.submitAnswer).toHaveBeenCalledWith('s1', expect.objectContaining({ questionId: 'q1', text: 'der Apfel' }))
    expect(await screen.findByText('Chính xác!')).toBeInTheDocument()

    await user.keyboard('{Enter}')
    await user.type(await screen.findByRole('textbox', { name: 'Câu trả lời của bạn' }), 'Brod{Enter}')
    expect(await screen.findByText('Bạn đã gõ: Brod')).toBeInTheDocument()
    expect(screen.getByText('Brot')).toBeInTheDocument()
  })

  it('pairs cards by tapping, flags a wrong pair and finishes the board', async () => {
    api.getSession.mockResolvedValue(matching)
    api.submitAnswer.mockImplementation(async (_id, body) => {
      const right = 'optionId' in body && ((body.questionId === 'q1' && body.optionId === '2') || (body.questionId === 'q2' && body.optionId === '1'))
      return { ...answerResult(body.questionId, right, right && 'optionId' in body ? body.optionId : null), questionCompleted: right }
    })
    const user = userEvent.setup()
    renderPlay()

    await user.click(await screen.findByRole('button', { name: 'ぬ' }))
    await user.click(screen.getByRole('button', { name: 'ne' }))
    expect(await screen.findByText('Not a pair. Try again!')).toBeInTheDocument()
    expect(screen.getByLabelText('1 wrong pair')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'nu' }))
    await user.click(screen.getByRole('button', { name: 'ぬ' }))
    await waitFor(() => expect(screen.getByRole('button', { name: /ぬ/ })).toBeDisabled())

    await user.keyboard('2a')
    expect(await screen.findByRole('heading', { name: 'Round complete!' })).toBeInTheDocument()
    expect(api.submitAnswer).toHaveBeenCalledTimes(3)
    expect(api.completeSession).toHaveBeenCalledWith('s1')
  })

  it('plays the sound of a listening question, and again on R, without showing it', async () => {
    api.getSession.mockResolvedValue({
      ...quiz,
      gameType: 'LISTENING',
      language: 'ko',
      questions: [{ ...quiz.questions[0], kind: 'AUDIO_TO_TEXT', prompt: '기역' }],
    })
    const user = userEvent.setup()
    renderPlay()

    expect(await screen.findByText('What did you hear?')).toBeInTheDocument()
    expect(screen.queryByText('기역')).not.toBeInTheDocument()
    expect(playClip).toHaveBeenCalledWith({ url: null, text: '기역', lang: 'ko-KR' })

    await user.keyboard('r')
    expect(playClip).toHaveBeenCalledTimes(2)
    await user.click(screen.getByRole('button', { name: 'Play the sound again' }))
    expect(playClip).toHaveBeenCalledTimes(3)
  })

  it('starts a speed round only when the player presses Start, then moves on without stopping', async () => {
    api.getSession.mockResolvedValue({
      ...quiz,
      gameType: 'SPEED',
      timer: { limitSeconds: 60, startedAt: null, deadline: null },
      questions: [quiz.questions[0], { ...quiz.questions[0], id: 'q2', position: 1, prompt: 'ね' }],
    })
    api.startSession.mockResolvedValue({
      timer: { limitSeconds: 60, startedAt: '2026-10-04T00:00:00Z', deadline: '2026-10-04T00:01:00Z' },
      serverNow: '2026-10-04T00:00:00Z',
    })
    api.submitAnswer.mockResolvedValue(answerResult('q1', true, '1'))
    const user = userEvent.setup()
    renderPlay()

    await user.click(await screen.findByRole('button', { name: 'Start' }))
    expect(api.startSession).toHaveBeenCalledWith('s1')
    expect(await screen.findByRole('progressbar', { name: '60 seconds left' })).toBeInTheDocument()

    await user.keyboard('1')
    expect(await screen.findByText('ね')).toBeInTheDocument()
    expect(screen.queryByText('Correct!', { selector: 'p.text-lg' })).not.toBeInTheDocument()
  })

  it('builds a syllable part by part and sends the tiles in order', async () => {
    api.getSession.mockResolvedValue({
      ...quiz,
      gameType: 'BUILDER',
      language: 'ko',
      questions: [
        {
          id: 'q1',
          position: 0,
          kind: 'BUILD',
          prompt: 'gok',
          audioUrl: null,
          reveal: null,
          result: null,
          options: [
            { id: '1a', text: 'ㄱ', slot: 0, role: 'INITIAL' },
            { id: '1b', text: 'ㅋ', slot: 0, role: 'INITIAL' },
            { id: '2a', text: 'ㅗ', slot: 1, role: 'VOWEL' },
            { id: '2b', text: 'ㅓ', slot: 1, role: 'VOWEL' },
            { id: '3a', text: 'ㄱ', slot: 2, role: 'FINAL' },
            { id: '3b', text: 'ㄴ', slot: 2, role: 'FINAL' },
          ],
        },
      ],
    })
    api.submitAnswer.mockResolvedValue({
      ...answerResult('q1', true, '1a|2a|3a'),
      reveal: { text: '곡', reading: null, romanization: 'gok', meaning: null, emoji: null },
    })
    const user = userEvent.setup()
    renderPlay()

    expect(await screen.findByText('gok')).toBeInTheDocument()
    const check = screen.getByRole('button', { name: /Check/ })
    expect(check).toBeDisabled()

    const rows = screen.getAllByRole('group')
    await user.click(within(rows[0]).getByRole('button', { name: 'ㄱ' }))
    await user.click(within(rows[1]).getByRole('button', { name: 'ㅗ' }))
    await user.click(within(rows[2]).getByRole('button', { name: 'ㄱ' }))
    expect(screen.getByText('곡')).toBeInTheDocument()

    await user.click(check)
    expect(api.submitAnswer).toHaveBeenCalledWith('s1', expect.objectContaining({ questionId: 'q1', parts: ['1a', '2a', '3a'] }))
    expect(await screen.findByText('Correct!')).toBeInTheDocument()
  })
})
