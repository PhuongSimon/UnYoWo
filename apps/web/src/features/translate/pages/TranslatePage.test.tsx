import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { translateApi } from '../api'
import type { TranslationResult } from '../types'
import TranslatePage from './TranslatePage'

vi.mock('../api', () => ({ translateApi: { translate: vi.fn() } }))

const translate = vi.mocked(translateApi.translate)

const result: TranslationResult = {
  source: 'vi',
  target: 'ja',
  detected: true,
  translation: '猫',
  provider: 'mymemory',
  cached: false,
  dictionary: [
    {
      itemId: 'neko',
      setId: 'n5-animals-1',
      language: 'ja',
      text: '猫',
      reading: 'ねこ',
      romanization: 'neko',
      meaning: { vi: 'con mèo', en: 'cat' },
      partOfSpeech: 'NOUN',
      level: 'N5',
      attributes: { hanViet: 'Miêu' },
    },
  ],
}

function renderPage() {
  const router = createMemoryRouter([{ path: '/app/translate', element: <TranslatePage /> }], { initialEntries: ['/app/translate'] })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('TranslatePage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()
    await i18n.changeLanguage('vi')
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('detects the language by default, translates with Ctrl+Enter and lists matching words', async () => {
    translate.mockResolvedValue(result)
    const user = userEvent.setup()
    renderPage()

    expect(screen.getByLabelText('Từ')).toHaveValue('auto')
    expect(screen.getByLabelText('Sang')).toHaveValue('vi')
    await user.selectOptions(screen.getByLabelText('Sang'), 'ja')
    await user.type(screen.getByLabelText('Nội dung cần dịch'), 'con mèo')
    await user.keyboard('{Control>}{Enter}{/Control}')

    expect(translate.mock.calls[0][0]).toEqual({ text: 'con mèo', source: 'auto', target: 'ja' })
    expect(await screen.findByText('Đã nhận diện: Tiếng Việt')).toBeInTheDocument()
    expect(screen.getByText('Dịch máy bởi MyMemory')).toBeInTheDocument()
    expect(screen.getByText('Hán Việt: Miêu')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Xem bộ từ' })).toHaveAttribute('href', '/app/ja/practice/sets/n5-animals-1')
    expect(JSON.parse(localStorage.getItem('unyowo.translate.languages') ?? '{}')).toEqual({ source: 'auto', target: 'ja' })
  })

  it('swaps the languages and moves the translation into the box', async () => {
    translate.mockResolvedValue(result)
    const user = userEvent.setup()
    renderPage()

    await user.selectOptions(screen.getByLabelText('Sang'), 'ja')
    await user.type(screen.getByLabelText('Nội dung cần dịch'), 'con mèo')
    await user.click(screen.getByRole('button', { name: 'Dịch' }))
    await screen.findByText('Đã nhận diện: Tiếng Việt')

    await user.click(screen.getByRole('button', { name: 'Đổi chiều dịch' }))
    expect(screen.getByLabelText('Từ')).toHaveValue('ja')
    expect(screen.getByLabelText('Sang')).toHaveValue('vi')
    expect(screen.getByLabelText('Nội dung cần dịch')).toHaveValue('猫')
  })

  it('blocks the same language on both sides and shows API errors', async () => {
    translate.mockRejectedValue(
      new AxiosError('unavailable', '503', undefined, undefined, {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { statusCode: 503, code: 'TRANSLATION_UNAVAILABLE' },
      }),
    )
    const user = userEvent.setup()
    renderPage()

    await user.selectOptions(screen.getByLabelText('Từ'), 'vi')
    await user.type(screen.getByLabelText('Nội dung cần dịch'), 'xin chào')
    expect(screen.getByText('Hãy chọn hai ngôn ngữ khác nhau.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dịch' })).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Sang'), 'de')
    await user.click(screen.getByRole('button', { name: 'Dịch' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Dịch vụ dịch đang bận')
  })
})
