import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { practiceApi } from '@/features/practice/api'
import { progressApi } from '../api'
import type { LanguageMistakes, ProgressSummary } from '../types'
import ProgressPage from './ProgressPage'
import ReviewPage from './ReviewPage'

vi.mock('@/components/BunnyMascot', () => ({ default: () => null }))
vi.mock('../api', () => ({ progressApi: { summary: vi.fn(), achievements: vi.fn(), mistakes: vi.fn() } }))
vi.mock('@/features/practice/api', () => ({ practiceApi: { createSession: vi.fn() } }))

const summary: ProgressSummary = {
  totalXp: 120,
  streak: { current: 3, longest: 5, studiedToday: true },
  today: { xp: 45, answers: 12 },
  dailyGoals: [
    { key: 'LEARN_NEW', target: 10, current: 6, xp: 50, completed: false, languageCode: null },
    { key: 'PLAY_GAME', target: 1, current: 1, xp: 20, completed: true, languageCode: null },
    { key: 'PRACTICE_LANGUAGE', target: 10, current: 4, xp: 30, completed: false, languageCode: 'ja' },
  ],
}

const kana = (id: string, text: string, romanization: string) => ({
  id,
  languageCode: 'ja',
  text,
  reading: null,
  romanization,
  meaning: null,
  emoji: null,
})

const mistakes: LanguageMistakes[] = [
  {
    languageCode: 'ja',
    dueCount: 4,
    weakCount: 2,
    weakItems: [{ item: kana('nu', 'ぬ', 'nu'), attemptCount: 3, correctCount: 1 }],
    confusions: [{ items: [kana('nu', 'ぬ', 'nu'), kana('me', 'め', 'me')], count: 3 }],
  },
]

function renderAt(path: string, element: ReactNode) {
  const router = createMemoryRouter(
    [
      { path, element },
      { path: '/app/play/:id', element: <p>playing</p> },
    ],
    { initialEntries: [path] },
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('progress pages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(progressApi.summary).mockResolvedValue(summary)
    vi.mocked(progressApi.achievements).mockResolvedValue([
      { key: 'FIRST_STEPS', current: 1, target: 1, unlockedAt: '2026-10-05T08:00:00Z' },
      { key: 'HIRAGANA_BEGINNER', current: 20, target: 46, unlockedAt: null },
    ])
    vi.mocked(progressApi.mistakes).mockResolvedValue(mistakes)
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows XP, streak, goals with their progress, and achievements', async () => {
    renderAt('/app/progress', <ProgressPage />)

    expect(await screen.findByRole('heading', { name: 'Progress' })).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('3 days')).toBeInTheDocument()

    expect(screen.getByText('Learn 10 new items')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Learn 10 new items: 6 of 10' })).toHaveAttribute('aria-valuenow', '6')
    expect(screen.getByText('Answer 10 questions in Japanese')).toBeInTheDocument()

    const beginner = screen.getByRole('heading', { name: 'Hiragana beginner' }).closest('article')
    expect(within(beginner as HTMLElement).getByText('20/46')).toBeInTheDocument()
    expect(screen.getByText(/Unlocked on/)).toBeInTheDocument()
  })

  it('lists due items, mistakes and confused pairs, and starts a mistakes round', async () => {
    await i18n.changeLanguage('vi')
    vi.mocked(practiceApi.createSession).mockResolvedValue({ id: 'new-session' } as never)
    const user = userEvent.setup()
    renderAt('/app/review', <ReviewPage />)

    expect(await screen.findByText('4 mục đến hạn ôn')).toBeInTheDocument()
    expect(screen.getByText('2 mục cần sửa')).toBeInTheDocument()
    expect(screen.getByText('Hay nhầm')).toBeInTheDocument()
    expect(screen.getByText('3 lần')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Luyện lỗi sai' }))
    expect(vi.mocked(practiceApi.createSession).mock.calls[0][0]).toEqual({ gameType: 'MULTIPLE_CHOICE', language: 'ja', source: 'MISTAKES' })
    expect(await screen.findByText('playing')).toBeInTheDocument()
  })
})
