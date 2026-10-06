import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StudyContext } from '@/features/learn/context'
import { findStudyLanguage } from '@/features/learn/languages'
import type { StudyContent } from '@/features/learn/types'
import ScriptDrillPage from './ScriptDrillPage'

function renderPage(code: 'ja' | 'ko' | 'en', search = '') {
  const language = findStudyLanguage(code)!
  const router = createMemoryRouter(
    [
      {
        path: '/app/:lang/practice/script',
        element: (
          <StudyContext value={{ language, content: {} as StudyContent }}>
            <ScriptDrillPage />
          </StudyContext>
        ),
      },
    ],
    { initialEntries: [`/app/${code}/practice/script${search}`] },
  )
  render(<RouterProvider router={router} />)
  return router
}

/** The character on screen: "Character: か" → "か" */
const shownChar = () => screen.getByText('Character:').parentElement!.textContent!.replace('Character:', '').trim()

const KA_ROW: Record<string, string> = { か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko' }

describe('ScriptDrillPage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('picks a script, drills a whole row in continuous mode and practises the mistakes again', async () => {
    const user = userEvent.setup()
    const router = renderPage('ja')

    expect(screen.getByText('Which script do you want to practise?')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /Hiragana/ }))
    expect(router.state.location.search).toBe('?script=hiragana')

    await user.click(screen.getByRole('checkbox', { name: 'Select the か row' }))
    expect(screen.getByRole('checkbox', { name: 'Select the か row' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getAllByRole('checkbox', { name: 'Select the a column' })[0]).toHaveAttribute('aria-checked', 'mixed')
    expect(screen.getByText('5 characters selected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))

    // Four right, one wrong; each answer goes through without pressing Enter.
    const answer = screen.getByLabelText('Romanisation of this character')
    let missed = ''
    for (let round = 0; round < 5; round++) {
      const char = shownChar()
      if (round === 2) {
        missed = char
        await user.type(answer, 'xa')
      } else {
        await user.type(answer, KA_ROW[char])
      }
      if (round < 4) expect(answer).toHaveValue('')
    }

    expect(screen.getByRole('heading', { name: 'Done!' })).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('4/5')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '1 character to review' })).toBeInTheDocument()
    expect(screen.getByText(KA_ROW[missed])).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Practise the 1 mistake' }))
    expect(shownChar()).toBe(missed)
    await user.type(screen.getByLabelText('Romanisation of this character'), KA_ROW[missed])
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('No mistakes. Excellent!')).toBeInTheDocument()

    // The selection is remembered for next time.
    await user.click(screen.getByRole('button', { name: 'Choose characters' }))
    expect(screen.getByText('5 characters selected')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('unyowo.drill.hiragana.selected')!)).toEqual(['か', 'き', 'く', 'け', 'こ'])
    // Role queries over 100+ table buttons are slow in jsdom when the whole suite runs in parallel.
  }, 20_000)

  it('moves on from ん after a single "n"', async () => {
    // Fisher–Yates with 0 swaps the two characters: ん comes first, then か.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const user = userEvent.setup()
    renderPage('ja', '?script=hiragana')

    await user.click(screen.getByRole('checkbox', { name: 'か ka' }))
    await user.click(screen.getByRole('checkbox', { name: 'ん n' }))
    await user.click(screen.getByRole('button', { name: 'Start' }))

    expect(shownChar()).toBe('ん')
    await user.type(screen.getByLabelText('Romanisation of this character'), 'n')
    expect(shownChar()).toBe('か')
    expect(screen.getByLabelText('Romanisation of this character')).toHaveValue('')
    await user.type(screen.getByLabelText('Romanisation of this character'), 'ka')

    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('waits for Enter in Enter mode and starts Korean straight at the tables', async () => {
    const user = userEvent.setup()
    renderPage('ko')

    expect(screen.queryByText('Which script do you want to practise?')).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: /Press Enter/ }))
    await user.click(screen.getByRole('checkbox', { name: '거 geo' }))
    await user.click(screen.getByRole('button', { name: 'Start' }))

    const answer = screen.getByLabelText('Romanisation of this character')
    await user.type(answer, 'geo')
    expect(answer).toHaveValue('geo')
    expect(screen.queryByRole('heading', { name: 'Done!' })).not.toBeInTheDocument()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Done!' })).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('unyowo.drill.prefs')!)).toEqual({ mode: 'enter', speak: false })
  })

  it('has nothing to drill for languages written in Latin letters', () => {
    renderPage('en')
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to practice' })).toHaveAttribute('href', '/app/en/practice')
  })
})
