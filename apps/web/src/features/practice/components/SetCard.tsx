import { Gamepad2, Layers } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DotsLoader from '@/components/ui/DotsLoader'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import type { GameType, LearningSet } from '../types'
import GamePicker from './GamePicker'
import ProgressBar from './ProgressBar'

interface SetCardProps {
  set: LearningSet
  /** Game currently being created for this set, if any */
  starting: GameType | null
  disabled: boolean
  onStart: (gameType: GameType) => void
}

const BUTTON =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-b-4 border-line-soft bg-surface px-2 text-sm font-bold whitespace-nowrap transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-primary-400 disabled:opacity-60'

/** Flashcards one tap away; every other game in the picker, so the card stays small. */
function SetCard({ set, starting, disabled, onStart }: SetCardProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const [picking, setPicking] = useState(false)
  const title = loc(set.title)
  const { seen, mastered, due } = set.progress
  const flashcards = t('practice.games.FLASHCARD')

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
        <button
          type="button"
          disabled={disabled}
          onClick={() => onStart('FLASHCARD')}
          aria-label={t('practice.start', { game: flashcards, title })}
          className={BUTTON}
        >
          {starting === 'FLASHCARD' ? <DotsLoader size="sm" /> : <Layers size={18} aria-hidden="true" className="text-accent" />}
          {flashcards}
        </button>
        <button type="button" disabled={disabled} onClick={() => setPicking(true)} aria-haspopup="dialog" className={BUTTON}>
          {starting && starting !== 'FLASHCARD' ? <DotsLoader size="sm" /> : <Gamepad2 size={18} aria-hidden="true" className="text-accent" />}
          {t('practice.picker.open')}
        </button>
      </div>

      <GamePicker
        set={set}
        title={title}
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(gameType) => {
          setPicking(false)
          onStart(gameType)
        }}
      />
    </article>
  )
}

export default SetCard
