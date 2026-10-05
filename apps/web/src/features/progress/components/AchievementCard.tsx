import { useTranslation } from 'react-i18next'
import ProgressBar from '@/features/practice/components/ProgressBar'
import type { Achievement } from '../types'
import AchievementIcon from './AchievementIcon'

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { t, i18n } = useTranslation()
  const unlocked = achievement.unlockedAt !== null
  const title = t(`achievements.${achievement.key}.title`)

  return (
    <article
      className={`flex gap-3 rounded-2xl border p-4 ${
        unlocked ? 'border-secondary-400/70 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-950/40' : 'border-line-soft bg-surface-raised'
      }`}
    >
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
          unlocked ? 'bg-secondary-400 text-secondary-950' : 'bg-line-soft/60 text-muted'
        }`}
      >
        <AchievementIcon achievementKey={achievement.key} size={24} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted">{t(`achievements.${achievement.key}.description`)}</p>
        {unlocked && achievement.unlockedAt ? (
          <p className="mt-1.5 text-xs font-semibold text-secondary-700 dark:text-secondary-300">
            {t('progress.unlockedOn', { date: new Date(achievement.unlockedAt).toLocaleDateString(i18n.language) })}
          </p>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar
              value={achievement.current}
              max={achievement.target}
              label={t('progress.achievementProgress', { title, current: achievement.current, target: achievement.target })}
              className="h-2 flex-1"
            />
            <span className="shrink-0 text-xs font-semibold text-muted tabular-nums">
              {achievement.current}/{achievement.target}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

export default AchievementCard
