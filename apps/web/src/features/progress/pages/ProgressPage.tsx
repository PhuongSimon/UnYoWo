import { useQuery } from '@tanstack/react-query'
import { Flame, Star, Trophy, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorState, LoadingState } from '@/features/learn/components/ContentState'
import AchievementCard from '../components/AchievementCard'
import DailyGoals from '../components/DailyGoals'
import { achievementsQuery, progressSummaryQuery } from '../queries'

function ProgressPage() {
  const { t } = useTranslation()
  const summary = useQuery(progressSummaryQuery)
  const achievements = useQuery(achievementsQuery)

  if (summary.isPending || achievements.isPending) return <LoadingState />
  if (summary.isError || achievements.isError) {
    return <ErrorState onRetry={() => void Promise.all([summary.refetch(), achievements.refetch()])} />
  }

  const { totalXp, streak, today, dailyGoals } = summary.data
  const unlocked = achievements.data.filter((achievement) => achievement.unlockedAt).length

  return (
    <div className="mx-auto w-full max-w-app px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="text-3xl font-extrabold">{t('progress.title')}</h1>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Star size={20} className="fill-secondary-400/50 text-secondary-600" />} label={t('progress.totalXp')} value={totalXp} />
        <Stat icon={<Zap size={20} className="text-accent" />} label={t('progress.todayXp')} value={today.xp} />
        <Stat
          icon={<Flame size={20} className="fill-primary-400/40 text-accent" />}
          label={t('progress.streak')}
          value={t('progress.days', { count: streak.current })}
        />
        <Stat icon={<Trophy size={20} className="text-secondary-600" />} label={t('progress.longest')} value={t('progress.days', { count: streak.longest })} />
      </dl>

      <section aria-labelledby="progress-goals" className="mt-8 rounded-3xl border border-line-soft bg-surface-raised p-5 shadow-sm sm:p-6">
        <h2 id="progress-goals" className="text-xl font-bold">
          {t('progress.goalsTitle')}
        </h2>
        <div className="mt-4">
          <DailyGoals goals={dailyGoals} />
        </div>
      </section>

      <section aria-labelledby="progress-achievements" className="mt-8">
        <h2 id="progress-achievements" className="text-xl font-bold">
          {t('progress.achievementsTitle')}{' '}
          <span className="text-base font-semibold text-muted">
            {unlocked}/{achievements.data.length}
          </span>
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {achievements.data.map((achievement) => (
            <AchievementCard key={achievement.key} achievement={achievement} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line-soft bg-surface-raised p-4">
      <dt className="flex items-center gap-2 text-sm font-semibold text-muted">
        <span aria-hidden="true">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-extrabold tabular-nums">{value}</dd>
    </div>
  )
}

export default ProgressPage
