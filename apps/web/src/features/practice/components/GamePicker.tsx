import { AudioLines, Blocks, Keyboard, ListChecks, Puzzle, X, Zap, type LucideIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameType, LearningSet } from '../types'

const GAMES: { type: GameType; Icon: LucideIcon; needsParts?: boolean }[] = [
  { type: 'MULTIPLE_CHOICE', Icon: ListChecks },
  { type: 'MATCHING', Icon: Puzzle },
  { type: 'TYPING', Icon: Keyboard },
  { type: 'LISTENING', Icon: AudioLines },
  { type: 'SPEED', Icon: Zap },
  { type: 'BUILDER', Icon: Blocks, needsParts: true },
]

interface GamePickerProps {
  set: LearningSet
  title: string
  open: boolean
  onClose: () => void
  onPick: (gameType: GameType) => void
}

/** Every game a set can be played with, in a native <dialog>: focus trap and Esc come for free. */
function GamePicker({ set, title, open, onClose, onPick }: GamePickerProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      aria-labelledby={`picker-${set.id}`}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-line-soft bg-surface-raised p-0 text-fg shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
        <h2 id={`picker-${set.id}`} className="min-w-0 flex-1 font-bold">
          {t('practice.picker.title', { title })}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('practice.picker.close')}
          className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <ul className="max-h-[70dvh] overflow-y-auto p-2">
        {GAMES.filter((game) => !game.needsParts || set.buildable).map(({ type, Icon }) => (
          <li key={type}>
            <button
              type="button"
              onClick={() => onPick(type)}
              className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-primary-400"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 text-accent">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold">{t(`practice.games.${type}`)}</span>
                <span className="block text-sm text-muted">{t(`practice.gameDescriptions.${type}`)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  )
}

export default GamePicker
