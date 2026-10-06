import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const WARNING_SECONDS = 10

/**
 * Countdown for timed rounds; stands still at the full time until the round starts (`deadlineAt` null).
 * The round itself ends from useGameSession; this only shows the time.
 */
function GameTimer({ deadlineAt, limitSeconds }: { deadlineAt: number | null; limitSeconds: number }) {
  const { t } = useTranslation()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    if (deadlineAt === null) return
    const interval = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(interval)
  }, [deadlineAt])

  const remainingMs = now === null || deadlineAt === null ? limitSeconds * 1000 : Math.max(0, deadlineAt - now)
  const seconds = Math.ceil(remainingMs / 1000)
  const warning = seconds <= WARNING_SECONDS
  const percent = Math.min(100, (remainingMs / (limitSeconds * 1000)) * 100)

  return (
    <div className="flex flex-1 items-center gap-3">
      <div
        role="progressbar"
        aria-label={t('practice.speed.timeLeft', { count: seconds })}
        aria-valuemin={0}
        aria-valuemax={limitSeconds}
        aria-valuenow={seconds}
        className="h-2.5 flex-1 overflow-hidden rounded-full bg-line-soft/70"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-200 ease-linear motion-reduce:transition-none ${warning ? 'bg-red-500' : 'bg-brand'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className={`flex shrink-0 items-center gap-1 text-sm font-extrabold tabular-nums ${warning ? 'text-red-700 dark:text-red-300' : 'text-muted'}`}
      >
        <Timer size={16} aria-hidden="true" />
        {seconds}s
      </span>
      {/* Spoken once, not every tick */}
      <span className="sr-only" aria-live="polite">
        {warning && seconds > 0 ? t('practice.speed.hurry') : ''}
      </span>
    </div>
  )
}

export default GameTimer
