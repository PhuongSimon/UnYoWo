import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { practiceApi } from '@/features/practice/api'
import { useAuthStore } from '@/stores/auth.store'
import { dashboardApi } from '../api'
import type { Dashboard } from '../types'
import DashboardPage from './DashboardPage'

vi.mock('@/components/BunnyMascot', () => ({ default: () => null }))
vi.mock('@/features/practice/api', () => ({ practiceApi: { createSession: vi.fn() } }))

const hiragana = { en: 'Hiragana: basics', vi: 'Hiragana: cơ bản' }

const dashboard: Dashboard = {
  totalXp: 265,
  streak: { current: 3, longest: 5, studiedToday: true },
  today: { xp: 45, answers: 12 },
  dailyGoals: [
    { key: 'LEARN_NEW', target: 10, current: 6, xp: 50, completed: false, languageCode: null },
    { key: 'PLAY_GAME', target: 1, current: 1, xp: 20, completed: true, languageCode: null },
    { key: 'PRACTICE_LANGUAGE', target: 10, current: 4, xp: 30, completed: false, languageCode: 'ja' },
  ],
  languages: [
    { code: 'ja', nativeName: '日本語', total: 46, seen: 20, mastered: 3, due: 4, weak: 2 },
    { code: 'ko', nativeName: '한국어', total: 40, seen: 0, mastered: 0, due: 0, weak: 0 },
  ],
  suggestions: [
    { kind: 'REVIEW_DUE', languageCode: 'ja', setId: null, setTitle: null, count: 4, total: 4, gameType: 'FLASHCARD', source: 'DUE' },
    { kind: 'FIX_MISTAKES', languageCode: 'ja', setId: null, setTitle: hiragana, count: 2, total: 2, gameType: 'MULTIPLE_CHOICE', source: 'MISTAKES' },
    { kind: 'CONTINUE_SET', languageCode: 'ja', setId: 'hiragana', setTitle: hiragana, count: 20, total: 46, gameType: 'MULTIPLE_CHOICE', source: 'SET' },
  ],
  weakAreas: [{ setId: 'hiragana', languageCode: 'ja', setTitle: hiragana, weak: 2 }],
  recentSessions: [
    {
      id: 's1',
      gameType: 'MULTIPLE_CHOICE',
      languageCode: 'ja',
      source: 'SET',
      setTitle: hiragana,
      score: 120,
      correctCount: 8,
      answeredCount: 10,
      completedAt: new Date().toISOString(),
    },
  ],
}

function renderDashboard() {
  const router = createMemoryRouter(
    [
      { path: '/app', element: <DashboardPage /> },
      { path: '/app/play/:id', element: <p>playing</p> },
    ],
    { initialEntries: ['/app'] },
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(practiceApi.createSession).mockReset()
    useAuthStore.setState({
      user: {
        id: 'u1',
        email: 'mai@example.com',
        fullName: 'Mai',
        avatarUrl: null,
        emailVerified: true,
        hasPassword: true,
        timezone: 'Asia/Ho_Chi_Minh',
      },
    })
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows a loading skeleton while the dashboard is on its way', () => {
    vi.spyOn(dashboardApi, 'get').mockReturnValue(new Promise(() => {}))
    renderDashboard()

    expect(screen.getByRole('status', { name: 'Loading your dashboard…' })).toBeInTheDocument()
  })

  it('greets the learner and shows languages, today’s plan, progress and recent results', async () => {
    vi.spyOn(dashboardApi, 'get').mockResolvedValue(dashboard)
    renderDashboard()

    expect(await screen.findByRole('heading', { name: 'Hi, Mai 👋' })).toBeInTheDocument()
    expect(screen.getByText('3-day streak')).toBeInTheDocument()
    expect(screen.getByText('265 XP')).toBeInTheDocument()

    const languages = screen.getByRole('navigation', { name: 'Your languages' })
    expect(within(languages).getByRole('link', { name: /Japanese/ })).toHaveAttribute('href', '/app/ja/practice')
    expect(within(languages).getByText('3 mastered · 4 due')).toBeInTheDocument()
    expect(within(languages).getByRole('progressbar', { name: 'Japanese: 20 of 46 items practised' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    )
    expect(within(languages).getByRole('link', { name: /Review/ })).toHaveAttribute('href', '/app/review')
    expect(within(languages).getByText('4 due · 2 to fix')).toBeInTheDocument()

    expect(screen.getByText('Review 4 due items')).toBeInTheDocument()
    expect(screen.getByText('Fix 2 mistakes')).toBeInTheDocument()
    expect(screen.getByText('Japanese · Quiz · mostly in Hiragana: basics')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '20 of 46 practised' })).toBeInTheDocument()

    // Average of 6/10, 1/1 and 4/10
    expect(screen.getByRole('img', { name: "67% of today's goals done" })).toBeInTheDocument()
    expect(screen.getByText('Making progress!')).toBeInTheDocument()
    expect(screen.getByText('Keep going, Mai! 2 goals left today.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hiragana: basics · 2' })).toHaveAttribute('href', '/app/review')

    const recent = screen.getByRole('region', { name: 'Recent results' })
    expect(within(recent).getByText('Hiragana: basics')).toBeInTheDocument()
    expect(within(recent).getByText('Quiz · 8/10 right · 120 pts')).toBeInTheDocument()
    expect(within(recent).getByText('Today')).toBeInTheDocument()
  })

  it('starts the suggested round in one tap', async () => {
    await i18n.changeLanguage('vi')
    vi.spyOn(dashboardApi, 'get').mockResolvedValue(dashboard)
    vi.mocked(practiceApi.createSession).mockResolvedValue({ id: 'new-session' } as never)
    const user = userEvent.setup()
    renderDashboard()

    await user.click(await screen.findByRole('button', { name: 'Tiếp tục: Hiragana: cơ bản' }))

    expect(vi.mocked(practiceApi.createSession).mock.calls[0][0]).toEqual({
      gameType: 'MULTIPLE_CHOICE',
      language: 'ja',
      source: 'SET',
      setId: 'hiragana',
    })
    expect(await screen.findByText('playing')).toBeInTheDocument()
  })

  it('celebrates a finished day and invites a first round when there is nothing yet', async () => {
    vi.spyOn(dashboardApi, 'get').mockResolvedValue({
      ...dashboard,
      dailyGoals: dashboard.dailyGoals.map((goal) => ({ ...goal, current: goal.target, completed: true })),
      suggestions: [],
      weakAreas: [],
      recentSessions: [],
    })
    renderDashboard()

    expect(await screen.findByText('Brilliant, Mai! Every goal for today is done.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: "100% of today's goals done" })).toBeInTheDocument()
    expect(screen.getByText('All done!')).toBeInTheDocument()
    expect(screen.getByText(/You're all caught up/)).toBeInTheDocument()
    expect(screen.getByText('No mistakes to fix. Keep it up!')).toBeInTheDocument()
    expect(screen.getByText(/No rounds yet/)).toBeInTheDocument()
  })

  it('shows an error that can be retried', async () => {
    const get = vi.spyOn(dashboardApi, 'get').mockRejectedValueOnce(new Error('offline')).mockResolvedValue(dashboard)
    const user = userEvent.setup()
    renderDashboard()

    const alert = await screen.findByRole('alert')
    await user.click(within(alert).getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Hi, Mai 👋' })).toBeInTheDocument()
    expect(get).toHaveBeenCalledTimes(2)
  })
})
