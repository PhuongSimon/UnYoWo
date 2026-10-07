import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUiLanguage } from '@/features/learn/hooks/useLocalized'
import RequestError from '../components/RequestError'
import { boardCards, matchedCardIds, type BoardSide, type MatchState } from '../engine/match-reducer'
import { useHotkeys } from '../hooks/useHotkeys'
import type { ChoiceKind } from '../types'
import { ANSWER_FIELD, fieldLang, PROMPT_FIELD } from './question-fields'

type BoardState = Extract<MatchState, { status: 'playing' | 'answering' }>
type CardState = 'idle' | 'selected' | 'matched' | 'miss'

const CARD_LETTERS = 'abcdefgh'

const CARD_CLASSES: Record<CardState, string> = {
  idle: 'border-line-soft bg-surface-raised hover:border-primary-400',
  selected: 'border-primary-500 bg-primary-50 ring-2 ring-primary-300 dark:bg-primary-950/40 dark:ring-primary-700',
  matched: 'border-emerald-600/60 bg-emerald-50 text-emerald-900 opacity-70 dark:bg-emerald-950/40 dark:text-emerald-100',
  miss: 'border-red-600 bg-red-50 text-red-950 motion-safe:animate-shake dark:bg-red-950/50 dark:text-red-50',
}

interface MatchingGameProps {
  state: BoardState
  studyLang: string
  onPick: (side: BoardSide, id: string) => void
  onRetry: () => void
}

function MatchingGame({ state, studyLang, onPick, onRetry }: MatchingGameProps) {
  const { t } = useTranslation()
  const uiLang = useUiLanguage()
  const { session } = state
  const cards = boardCards(session)
  const matched = matchedCardIds(session)
  // Every pair on a board is asked the same way (ぬ ↔ nu, or Apfel ↔ quả táo).
  const first = session.questions[0]
  const kind: ChoiceKind = first && first.kind !== 'FLASHCARD' && first.kind !== 'BUILD' ? first.kind : 'TEXT_TO_ROMANIZATION'
  const playing = state.status === 'playing'
  const selected = playing ? state.selected : null
  const miss = playing ? state.miss : null
  const pending = state.status === 'answering' ? state.pair : null

  const promptState = (questionId: string, done: boolean): CardState => {
    if (done) return 'matched'
    if (miss?.questionId === questionId) return 'miss'
    if (pending?.questionId === questionId || (selected?.side === 'prompt' && selected.id === questionId)) return 'selected'
    return 'idle'
  }
  const cardState = (cardId: string): CardState => {
    if (matched.has(cardId)) return 'matched'
    if (miss?.optionId === cardId) return 'miss'
    if (pending?.optionId === cardId || (selected?.side === 'card' && selected.id === cardId)) return 'selected'
    return 'idle'
  }

  // 1–6 pick a prompt, a–f pick a card.
  useHotkeys(
    Object.fromEntries([
      ...session.questions.map((question, index) => [String(index + 1), () => !question.result && onPick('prompt', question.id)]),
      ...cards.map((card, index) => [CARD_LETTERS[index], () => !matched.has(card.id) && onPick('card', card.id)]),
    ]),
    playing,
  )

  const columns: { side: BoardSide; label: string; lang: string | undefined; entries: { id: string; text: string; state: CardState; key: string }[] }[] = [
    {
      side: 'prompt',
      label: t('practice.matching.prompts'),
      lang: fieldLang(PROMPT_FIELD[kind], studyLang, uiLang),
      entries: session.questions.map((question, index) => ({
        id: question.id,
        text: question.prompt,
        state: promptState(question.id, question.result !== null),
        key: String(index + 1),
      })),
    },
    {
      side: 'card',
      label: t('practice.matching.cards'),
      lang: fieldLang(ANSWER_FIELD[kind], studyLang, uiLang),
      entries: cards.map((card, index) => ({ id: card.id, text: card.text, state: cardState(card.id), key: CARD_LETTERS[index] })),
    },
  ]

  return (
    <>
      <p className="text-center text-sm font-semibold text-muted">{t('practice.matching.instructions')}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        {columns.map((column) => (
          <ul key={column.side} aria-label={column.label} className="flex flex-col gap-2.5">
            {column.entries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  disabled={entry.state === 'matched' || !playing}
                  aria-pressed={entry.state === 'selected'}
                  onClick={() => onPick(column.side, entry.id)}
                  className={`relative flex min-h-14 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-b-4 px-2 py-2 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default sm:text-lg ${CARD_CLASSES[entry.state]}`}
                >
                  <kbd aria-hidden="true" className="absolute top-1 left-1.5 hidden font-sans text-[10px] font-bold text-muted sm:block">
                    {entry.key}
                  </kbd>
                  {entry.state === 'matched' && <Check size={16} strokeWidth={3} aria-hidden="true" className="shrink-0" />}
                  <span lang={column.lang} className="break-words">
                    {entry.text}
                  </span>
                  {entry.state === 'matched' && <span className="sr-only">({t('practice.matching.matched')})</span>}
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <p role="status" className="mt-4 min-h-6 text-center text-sm font-semibold text-red-700 dark:text-red-300">
        {miss ? t('practice.matching.miss') : ''}
      </p>

      {state.status === 'answering' && state.failed && <RequestError message={t('practice.sendFailed')} onRetry={onRetry} />}
    </>
  )
}

export default MatchingGame
