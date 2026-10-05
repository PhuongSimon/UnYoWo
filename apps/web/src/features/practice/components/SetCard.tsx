import { Keyboard, Layers, ListChecks, Puzzle, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DotsLoader from '@/components/ui/DotsLoader'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import type { GameType, LearningSet } from '../types'
import ProgressBar from './ProgressBar'

const GAMES: { type: GameType; Icon: LucideIcon }[] = [
  { type: 'FLASHCARD', Icon: Layers },
  { type: 'MULTIPLE_CHOICE', Icon: ListChecks },
  { type: 'MATCHING', Icon: Puzzle },
  { type: 'TYPING', Icon: Keyboard },
]

interface SetCardProps {
  set: LearningSet
  /** Game currently being created for this set, if any */
  starting: GameType | null
  disabled: boolean
  onStart: (gameType: GameType) => void
}

function SetCard({ set, starting, disabled, onStart }: SetCardProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const title = loc(set.title)
  const { seen, mastered, due } = set.progress

  return (
    <article className="flex flex-col rounded-2xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        {due > 0 && (
          <span className="shrink-0 rounded-full bg-primary-500/15 px-2 py-0.5 text-xs font-bold text-accent">
            {t('practice.set.due', { count: due })}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        {t('practice.set.items', { count: set.itemCount })} · {t('practice.set.mastered', { count: mastered })}
      </p>

      <ProgressBar value={seen} max={set.itemCount} label={t('practice.set.progressLabel', { title })} className="mt-3" />
      <p className="mt-1 text-xs text-muted tabular-nums">{t('practice.set.seen', { seen, total: set.itemCount })}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {GAMES.map(({ type, Icon }) => {
          const name = t(`practice.games.${type}`)
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onStart(type)}
              aria-label={t('practice.start', { game: name, title })}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-b-4 border-line-soft bg-surface px-2 text-sm font-bold whitespace-nowrap transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-primary-400 disabled:opacity-60"
            >
              {starting === type ? <DotsLoader size="sm" /> : <Icon size={18} aria-hidden="true" className="text-accent" />}
              {name}
            </button>
          )
        })}
      </div>
    </article>
  )
}

export default SetCard
