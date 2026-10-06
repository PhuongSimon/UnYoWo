import { ArrowRight, Check, Flag, SkipForward, X } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { speak as sayAloud } from '@/features/learn/lib/speech'
import ProgressBar from '@/features/practice/components/ProgressBar'
import { normalizeRomaji, readContinuous, type DrillAnswer, type DrillMode } from '../drill'
import type { DrillCell } from '../scripts'

interface DrillRoundProps {
  /** Already shuffled */
  cells: DrillCell[]
  lang: string
  speechLang: string
  mode: DrillMode
  speak: boolean
  onFinish: (answers: DrillAnswer[], durationMs: number) => void
  onQuit: () => void
}

/** Step 3: one character at a time; the result of the previous one stays visible while typing the next. */
function DrillRound({ cells, lang, speechLang, mode, speak, onFinish, onQuit }: DrillRoundProps) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [answers, setAnswers] = useState<DrillAnswer[]>([])
  const startedAt = useRef(0)
  const shownAt = useRef(0)
  // While an IME is composing (e.g. a Japanese keyboard) the text is not final yet.
  const composing = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cell = cells[index]
  const last = answers.at(-1)
  const correctCount = answers.filter((answer) => answer.correct).length

  useEffect(() => {
    startedAt.current = Date.now()
    shownAt.current = startedAt.current
    // Bring the character and the input into view under the sticky header, above a phone keyboard.
    rootRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  const commit = (given: string) => {
    const now = Date.now()
    const answer: DrillAnswer = { char: cell.char, expected: cell.answers[0], given, correct: cell.answers.includes(given), ms: now - shownAt.current }
    const next = [...answers, answer]
    if (speak) sayAloud(cell.char, speechLang, `${speechLang}:${cell.char}`)

    if (index + 1 >= cells.length) {
      onFinish(next, now - startedAt.current)
      return
    }
    setAnswers(next)
    setIndex(index + 1)
    setText('')
    shownAt.current = now
    inputRef.current?.focus()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (mode === 'continuous' && !composing.current) {
      const read = readContinuous(value, cell.answers)
      if (read.done) {
        commit(read.given)
        return
      }
    }
    setText(value)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const given = normalizeRomaji(text)
    if (given) commit(given)
    else inputRef.current?.focus()
  }

  const end = () => (answers.length > 0 ? onFinish(answers, Date.now() - startedAt.current) : onQuit())

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-xl scroll-mt-32 space-y-4">
      <div className="flex items-center gap-3">
        <ProgressBar value={index} max={cells.length} label={t('drill.round.progressLabel')} className="flex-1" />
        <span className="text-sm font-semibold text-muted tabular-nums">{t('drill.round.progress', { current: index + 1, total: cells.length })}</span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 tabular-nums dark:text-emerald-400" title={t('drill.result.correct')}>
          <Check size={16} aria-hidden="true" />
          <span className="sr-only">{t('drill.result.correct')}:</span>
          {correctCount}
        </span>
      </div>

      <div className="flex min-h-36 items-center justify-center rounded-3xl border border-line-soft bg-surface-raised shadow-sm sm:min-h-48">
        <p key={index} lang={lang} className="text-7xl leading-none font-bold motion-safe:animate-fade-in sm:text-8xl">
          <span className="sr-only">{t('drill.round.charLabel')} </span>
          {cell.char}
        </p>
      </div>

      <LastAnswer answer={last} lang={lang} />

      <form onSubmit={submit}>
        <label htmlFor="drill-answer" className="sr-only">
          {t('drill.round.label')}
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="drill-answer"
            lang="en"
            value={text}
            onChange={onChange}
            onCompositionStart={() => (composing.current = true)}
            onCompositionEnd={() => (composing.current = false)}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint={mode === 'enter' ? 'done' : 'next'}
            maxLength={12}
            placeholder={t('drill.round.placeholder')}
            aria-describedby="drill-answer-hint"
            className="min-h-14 min-w-0 flex-1 rounded-2xl border-2 border-line-soft bg-surface-raised px-4 text-center text-2xl font-semibold tracking-wide transition-colors outline-none placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-muted focus:border-primary-500"
          />
          <Button type="submit" disabled={!text.trim()} className="shrink-0" aria-label={t('drill.round.submit')}>
            <ArrowRight size={20} aria-hidden="true" />
          </Button>
        </div>
        <p id="drill-answer-hint" className="mt-2 text-sm text-muted">
          {t(`drill.round.hint.${mode}`)}
        </p>
      </form>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => commit('')}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-sm font-semibold text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <SkipForward size={16} aria-hidden="true" />
          {t('drill.round.skip')}
        </button>
        <button
          type="button"
          onClick={end}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-sm font-semibold text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <Flag size={16} aria-hidden="true" />
          {t('drill.round.end')}
        </button>
      </div>
    </div>
  )
}

/** "✓ し = shi" or "✗ し = shi · you typed sa"; announced to screen readers. */
function LastAnswer({ answer, lang }: { answer: DrillAnswer | undefined; lang: string }) {
  const { t } = useTranslation()

  return (
    <p aria-live="polite" className="flex min-h-11 items-center justify-center text-center">
      {answer && (
        <span
          key={`${answer.char}-${answer.ms}`}
          className={`inline-flex flex-wrap items-center justify-center gap-x-2 rounded-full px-4 py-1.5 text-sm font-semibold motion-safe:animate-fade-in ${
            answer.correct
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
              : 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200'
          }`}
        >
          {answer.correct ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
          <span className="sr-only">{answer.correct ? t('drill.round.correct') : t('drill.round.wrong')}:</span>
          <span>
            <span lang={lang} className="text-base font-bold">
              {answer.char}
            </span>{' '}
            = {answer.expected}
          </span>
          {!answer.correct && (
            <span className="font-medium opacity-80">· {answer.given ? t('drill.round.youTyped', { given: answer.given }) : t('drill.round.skipped')}</span>
          )}
        </span>
      )}
    </p>
  )
}

export default DrillRound
