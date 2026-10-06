import { ListChecks, RotateCcw, Target } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import type { DrillSummary } from '../drill'

interface DrillResultProps {
  summary: DrillSummary
  lang: string
  onRetry: () => void
  onRetryMistakes: () => void
  onReselect: () => void
}

const formatDuration = (ms: number) => {
  const seconds = Math.round(ms / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

/** Step 4: score, speed and the characters to look at again. */
function DrillResult({ summary, lang, onRetry, onRetryMistakes, onReselect }: DrillResultProps) {
  const { t, i18n } = useTranslation()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const seconds = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1, minimumFractionDigits: 1 })

  // Move focus (and the view) to the result: the input that had it is gone.
  useEffect(() => headingRef.current?.focus(), [])

  const stats = [
    { label: t('drill.result.correct'), value: `${summary.correct}/${summary.total}` },
    { label: t('drill.result.time'), value: formatDuration(summary.durationMs) },
    { label: t('drill.result.average'), value: t('drill.result.seconds', { value: seconds.format(summary.averageMs / 1000) }) },
    { label: t('drill.result.bestStreak'), value: summary.bestStreak },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h2 ref={headingRef} tabIndex={-1} className="scroll-mt-32 text-2xl font-extrabold outline-none sm:text-3xl">
          {t('drill.result.title')}
        </h2>
        <p className="mt-4 text-6xl font-extrabold text-accent tabular-nums motion-safe:animate-fade-in">{summary.accuracy}%</p>
        <p className="text-sm font-semibold text-muted">{t('drill.result.accuracy')}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-line-soft bg-surface-raised p-3 text-center">
            <dt className="text-xs font-semibold text-muted">{label}</dt>
            <dd className="mt-0.5 text-xl font-extrabold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="drill-mistakes" className="space-y-3">
        <h3 id="drill-mistakes" className="text-lg font-bold">
          {t('drill.result.mistakes', { count: summary.mistakes.length })}
        </h3>
        {summary.mistakes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line-soft p-5 text-center text-muted">{t('drill.result.noMistakes')}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {summary.mistakes.map((mistake) => (
              <li key={mistake.char} className="rounded-2xl border border-red-200 bg-surface-raised p-3 dark:border-red-900/60">
                <div className="flex items-baseline justify-between gap-2">
                  <span lang={lang} className="text-3xl font-bold">
                    {mistake.char}
                  </span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{mistake.expected}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {t('drill.result.typed')}{' '}
                  {mistake.given.map((given, index) => (
                    <span key={index}>
                      {index > 0 && ', '}
                      {given ? <span className="font-semibold text-red-700 line-through dark:text-red-300">{given}</span> : t('drill.round.skipped')}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={onRetry} className="sm:flex-1">
          <RotateCcw size={18} aria-hidden="true" />
          {t('drill.result.retry')}
        </Button>
        {summary.mistakes.length > 0 && (
          <Button variant="outline" onClick={onRetryMistakes} className="sm:flex-1">
            <Target size={18} aria-hidden="true" />
            {t('drill.result.retryMistakes', { count: summary.mistakes.length })}
          </Button>
        )}
        <Button variant="outline" onClick={onReselect} className="sm:flex-1">
          <ListChecks size={18} aria-hidden="true" />
          {t('drill.result.reselect')}
        </Button>
      </div>
    </div>
  )
}

export default DrillResult
