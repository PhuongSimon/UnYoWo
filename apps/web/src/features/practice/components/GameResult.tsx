import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import BunnyMascot from '@/components/BunnyMascot'
import Button from '@/components/ui/Button'
import type { GameType, SessionSummary } from '../types'
import SessionRewards from './SessionRewards'

interface GameResultProps {
  gameType: GameType
  summary: SessionSummary
  backTo: string
  starting: boolean
  onPlayAgain: () => void
}

const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

function GameResult({ gameType, summary, backTo, starting, onPlayAgain }: GameResultProps) {
  const { t } = useTranslation()
  const accuracy = summary.answeredCount > 0 ? Math.round((summary.correctCount / summary.answeredCount) * 100) : 0

  // A matching board is about finding every pair with as few wrong tries as possible.
  const firstStats =
    gameType === 'MATCHING'
      ? [
          { label: t('practice.result.pairs'), value: `${summary.answeredCount}/${summary.questionCount}` },
          { label: t('practice.result.mistakes'), value: summary.mistakeCount },
        ]
      : [
          { label: t('practice.result.correct'), value: `${summary.correctCount}/${summary.answeredCount}` },
          { label: t('practice.result.accuracy'), value: `${accuracy}%` },
        ]
  const stats = [
    ...firstStats,
    { label: t('practice.result.bestCombo'), value: summary.maxCombo },
    { label: t('practice.result.time'), value: formatDuration(summary.durationSeconds) },
  ]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-8 text-center sm:py-12">
      <BunnyMascot size={96} interactive={false} />
      <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{t('practice.result.title')}</h1>

      <p className="mt-5 text-6xl font-extrabold text-accent tabular-nums motion-safe:animate-fade-in">{summary.score}</p>
      <p className="text-sm font-semibold text-muted">{t('practice.result.score')}</p>

      <dl className="mt-6 grid w-full grid-cols-2 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-line-soft bg-surface-raised p-3">
            <dt className="text-xs font-semibold text-muted">{label}</dt>
            <dd className="mt-0.5 text-xl font-extrabold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <SessionRewards rewards={summary.rewards} />

      {summary.answeredCount < summary.questionCount && (
        <p className="mt-4 text-sm text-muted">
          {t('practice.result.partial', { answered: summary.answeredCount, total: summary.questionCount })}
        </p>
      )}

      <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
        <Button onClick={onPlayAgain} loading={starting} className="flex-1">
          <RotateCcw size={18} aria-hidden="true" />
          {t('practice.result.playAgain')}
        </Button>
        <Link
          to={backTo}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-b-4 border-line-soft bg-surface-raised px-6 py-3 text-sm font-bold transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          {t('practice.result.back')}
        </Link>
      </div>
    </div>
  )
}

export default GameResult
