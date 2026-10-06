import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { StudyContext } from '@/features/learn/context'
import { findStudyLanguage } from '@/features/learn/languages'
import type { StudyContent } from '@/features/learn/types'
import { practiceApi } from '../api'
import type { LearningSet, SetItem } from '../types'
import PracticeHubPage from './PracticeHubPage'
import SetWordsPage from './SetWordsPage'

vi.mock('@/components/BunnyMascot', () => ({ default: () => null }))
vi.mock('../api', () => ({
  practiceApi: { listSets: vi.fn(), listSources: vi.fn(), listItems: vi.fn(), createSession: vi.fn() },
}))

const api = vi.mocked(practiceApi)
const n5 = { code: 'N5', framework: 'JLPT', title: { en: 'N5 · Beginner', vi: 'N5 · Sơ cấp 1' }, sortOrder: 4 }
const n4 = { code: 'N4', framework: 'JLPT', title: { en: 'N4 · Elementary', vi: 'N4 · Sơ cấp 2' }, sortOrder: 5 }
const food = { slug: 'food', title: { en: 'Food & drink', vi: 'Đồ ăn & đồ uống' }, emoji: '🍽️' }
const animals = { slug: 'animals', title: { en: 'Animals', vi: 'Động vật' }, emoji: '🐾' }

const set = (id: string, extra: Partial<LearningSet> = {}): LearningSet => ({
  id,
  languageCode: 'ja',
  slug: id,
  kind: 'VOCABULARY',
  script: null,
  category: null,
  level: null,
  part: null,
  topic: null,
  title: { en: id, vi: id },
  itemCount: 20,
  buildable: false,
  progress: { seen: 0, mastered: 0, due: 0 },
  ...extra,
})

const sets: LearningSet[] = [
  set('hiragana-basic', { kind: 'ALPHABET', title: { en: 'Hiragana: basic', vi: 'Hiragana cơ bản' } }),
  set('n5-food-1', {
    level: n5,
    topic: food,
    part: 1,
    category: 'food',
    title: { en: 'Food & drink 1', vi: 'Đồ ăn & đồ uống 1' },
    itemCount: 25,
    progress: { seen: 5, mastered: 1, due: 2 },
  }),
  set('n5-food-2', { level: n5, topic: food, part: 2, category: 'food', title: { en: 'Food & drink 2', vi: 'Đồ ăn & đồ uống 2' }, itemCount: 24 }),
  set('n5-animals-1', { level: n5, topic: animals, part: 1, category: 'animals', title: animals.title, itemCount: 10 }),
  set('n4-food-1', { level: n4, topic: food, part: 1, category: 'food', title: food.title, itemCount: 23 }),
]

const japanese = findStudyLanguage('ja')!

function renderPage(path: string, routePath: string, element: ReactNode) {
  const router = createMemoryRouter(
    [
      { path: routePath, element: <StudyContext value={{ language: japanese, content: {} as StudyContent }}>{element}</StudyContext> },
      { path: '/app/play/:id', element: <p>playing</p> },
      { path: '/app/ja/practice', element: <p>practice page</p> },
    ],
    { initialEntries: [path] },
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

describe('practice hub with exam levels', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.listSets.mockResolvedValue(sets)
    api.listSources.mockResolvedValue([
      { id: 'jlpt-waller', name: 'JLPT vocabulary lists', url: 'https://www.tanos.co.uk/jlpt/', license: 'CC BY', attribution: 'By Jonathan Waller.' },
    ])
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows one tab per shelf and the sets of the chosen level grouped by topic', async () => {
    const user = userEvent.setup()
    const router = renderPage('/app/ja/practice', '/app/ja/practice', <PracticeHubPage />)

    const alphabet = await screen.findByRole('button', { name: /Alphabet/ })
    expect(alphabet).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Hiragana: basic' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /N5/ })).toHaveTextContent('59 items')

    await user.click(screen.getByRole('button', { name: /N5/ }))
    expect(router.state.location.search).toBe('?shelf=N5')
    expect(screen.getByRole('heading', { name: 'N5 · Beginner' })).toBeInTheDocument()

    const foodSection = screen.getByRole('region', { name: /Food & drink/ })
    expect(within(foodSection).getByText('5/49 practised')).toBeInTheDocument()
    expect(within(foodSection).getAllByRole('heading', { level: 4 }).map((h) => h.textContent)).toEqual(['Part 1', 'Part 2'])
    expect(within(foodSection).getByText('2 due')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: /Animals/ })).getByRole('heading', { name: 'Whole topic' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: /^Part|^Whole/ })).toHaveLength(3)

    expect(screen.getByRole('link', { name: 'Food & drink' })).toHaveAttribute('href', '#topic-food')
    expect(screen.getByRole('link', { name: 'JLPT vocabulary lists' })).toHaveAttribute('href', 'https://www.tanos.co.uk/jlpt/')
  })

  it('opens a level from the address and starts a game on a part', async () => {
    api.createSession.mockResolvedValue({ id: 'new-session' } as never)
    const user = userEvent.setup()
    renderPage('/app/ja/practice?shelf=N4', '/app/ja/practice', <PracticeHubPage />)

    expect(await screen.findByRole('heading', { name: 'N4 · Elementary' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Flashcards: Food & drink' }))
    expect(api.createSession.mock.calls[0][0]).toEqual({ gameType: 'FLASHCARD', language: 'ja', source: 'SET', setId: 'n4-food-1' })
    expect(await screen.findByText('playing')).toBeInTheDocument()
  })
})

describe('set word list', () => {
  const word = (id: string, extra: Partial<SetItem>): SetItem => ({
    id,
    type: 'WORD',
    text: id,
    reading: null,
    romanization: null,
    ipa: null,
    meaning: null,
    partOfSpeech: 'NOUN',
    emoji: null,
    attributes: null,
    audioUrl: null,
    ...extra,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    api.listItems.mockResolvedValue({
      set: sets[1],
      items: [
        word('neko', { text: '猫', reading: 'ねこ', romanization: 'neko', meaning: { vi: 'con mèo', en: 'cat' }, attributes: { hanViet: 'Miêu' } }),
        word('taberu', { text: '食べる', reading: 'たべる', romanization: 'taberu', meaning: { vi: 'ăn' }, partOfSpeech: 'VERB', attributes: { masu: '食べます' } }),
      ],
      page: 1,
      pageSize: 100,
      total: 2,
    })
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('lists every word with its reading, meaning and details, in the UI language when it has one', async () => {
    await i18n.changeLanguage('vi')
    renderPage('/app/ja/practice/sets/n5-food-1', '/app/ja/practice/sets/:setId', <SetWordsPage />)

    expect(await screen.findByRole('heading', { name: /Đồ ăn & đồ uống/ })).toBeInTheDocument()
    expect(screen.getByText('N5 · Sơ cấp 1')).toBeInTheDocument()
    expect(screen.getByText('ねこ · neko')).toBeInTheDocument()
    expect(screen.getByText('con mèo')).toBeInTheDocument()
    expect(screen.getByText('danh từ · Hán Việt: Miêu')).toBeInTheDocument()
    expect(screen.getByText('động từ · Thể ます: 食べます')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Về trang luyện tập/ })).toHaveAttribute('href', '/app/ja/practice?shelf=N5')
  })

  it('falls back to the other UI language when the word has no meaning in this one', async () => {
    renderPage('/app/ja/practice/sets/n5-food-1', '/app/ja/practice/sets/:setId', <SetWordsPage />)
    expect(await screen.findByText('cat')).toBeInTheDocument()
    expect(screen.getByText('ăn')).toHaveAttribute('lang', 'vi')
  })
})
