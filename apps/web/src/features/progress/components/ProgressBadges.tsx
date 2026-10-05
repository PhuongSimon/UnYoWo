import { useQuery } from '@tanstack/react-query'
import { Flame, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { progressSummaryQuery } from '../queries'

/** Streak and XP in the header; both open the progress page. */
function ProgressBadges() {
  const { t } = useTranslation()
  const { data } = useQuery(progressSummaryQuery)
  if (!data) return null

  const { streak, totalXp } = data
  return (
    <Link
      to="/app/progress"
      aria-label={`${t('progress.streakLabel', { count: streak.current })}, ${t('progress.xpLabel', { count: totalXp })}`}
      className="flex min-h-9 items-center gap-2 rounded-full px-2 text-sm font-extrabold tabular-nums transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-primary-400"
    >
      <span className={`flex items-center gap-0.5 ${streak.studiedToday ? 'text-accent' : 'text-muted'}`}>
        <Flame size={18} aria-hidden="true" className={streak.studiedToday ? 'fill-primary-400/40' : ''} />
        {streak.current}
      </span>
      <span className="hidden items-center gap-0.5 text-secondary-600 sm:flex dark:text-secondary-300">
        <Star size={17} aria-hidden="true" className="fill-secondary-400/50" />
        {totalXp}
      </span>
    </Link>
  )
}

export default ProgressBadges
