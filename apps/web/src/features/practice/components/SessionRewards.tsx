import { CircleCheck, Flame, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AchievementIcon from '@/features/progress/components/AchievementIcon'
import type { SessionRewards as Rewards } from '../types'

/** XP earned, goals reached and achievements unlocked in this round. */
function SessionRewards({ rewards }: { rewards: Rewards }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="session-rewards" className="mt-6 w-full rounded-2xl border border-secondary-400/60 bg-secondary-50 p-4 text-left dark:border-secondary-700 dark:bg-secondary-950/40">
      <h2 id="session-rewards" className="flex items-center gap-2 font-extrabold">
        <Star size={20} aria-hidden="true" className="fill-secondary-400 text-secondary-600" />
        {t('practice.rewards.xp', { xp: rewards.xp })}
        <span className="ml-auto flex items-center gap-1 text-sm text-accent">
          <Flame size={16} aria-hidden="true" />
          {t('progress.days', { count: rewards.streak })}
        </span>
      </h2>

      {rewards.breakdown.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-sm text-muted">
          {rewards.breakdown.map(({ source, amount, count }) => (
            <li key={source} className="flex justify-between gap-3">
              <span>{t(`practice.rewards.source.${source}`, { count })}</span>
              <span className="font-semibold tabular-nums">+{amount}</span>
            </li>
          ))}
        </ul>
      )}

      {rewards.goals.length > 0 && (
        <ul className="mt-3 space-y-1">
          {rewards.goals.map((goal) => (
            <li key={goal} className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              <CircleCheck size={16} aria-hidden="true" />
              {t('practice.rewards.goalDone', { goal: t(`progress.goalNames.${goal}`) })}
            </li>
          ))}
        </ul>
      )}

      {rewards.achievements.length > 0 && (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {rewards.achievements.map((key) => {
            return (
              <li key={key} className="flex items-center gap-3 rounded-xl bg-secondary-400/25 p-2 motion-safe:animate-fade-in">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary-400 text-secondary-950">
                  <AchievementIcon achievementKey={key} size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold tracking-wide text-secondary-700 uppercase dark:text-secondary-300">
                    {t('practice.rewards.unlocked')}
                  </span>
                  <span className="block font-bold">{t(`achievements.${key}.title`)}</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default SessionRewards
