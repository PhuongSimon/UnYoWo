import { Flame, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import ProgressBar from './ProgressBar'

interface GameShellProps {
  answered: number
  total: number
  combo: number
  backTo: string
  /** Keyboard shortcuts for this game; only shown on larger screens */
  hint: string
  /** Extra counter next to the progress, e.g. mistakes on a matching board */
  extra?: ReactNode
  /** Timed games show the countdown instead of the progress bar */
  timer?: ReactNode
  children: ReactNode
}

function GameShell({ answered, total, combo, backTo, hint, extra, timer, children }: GameShellProps) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-3 pb-8 sm:px-6 sm:pt-6">
      <div className="flex items-center gap-3">
        <Link
          to={backTo}
          aria-label={t('practice.quit')}
          title={t('practice.quit')}
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-raised hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <X size={22} aria-hidden="true" />
        </Link>
        {timer ?? (
          <>
            <ProgressBar value={answered} max={total} label={t('practice.progress', { current: answered, total })} className="flex-1" />
            <span className="shrink-0 text-sm font-semibold text-muted tabular-nums">
              {answered}/{total}
            </span>
          </>
        )}
        {extra}
        {combo >= 2 && (
          <span
            key={combo}
            aria-label={t('practice.combo', { count: combo })}
            className="flex shrink-0 items-center gap-0.5 rounded-full bg-primary-500/15 px-2 py-1 text-sm font-extrabold text-accent motion-safe:animate-fade-in"
          >
            <Flame size={16} aria-hidden="true" />
            {combo}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col sm:mt-8">{children}</div>

      <p className="mt-8 hidden text-center text-xs text-muted sm:block">{hint}</p>
    </div>
  )
}

export default GameShell
