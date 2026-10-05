import { CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import { findStudyLanguage } from '@/features/learn/languages'
import ProgressBar from '@/features/practice/components/ProgressBar'
import type { DailyGoal } from '../types'

function DailyGoals({ goals }: { goals: DailyGoal[] }) {
  const { t } = useTranslation()
  const loc = useLocalized()

  return (
    <ul className="space-y-3">
      {goals.map((goal) => {
        const language = goal.languageCode ? findStudyLanguage(goal.languageCode) : undefined
        const label = t(`progress.goals.${goal.key}`, {
          count: goal.target,
          language: language ? loc(language.name) : goal.languageCode,
        })
        return (
          <li key={goal.key} className="flex items-center gap-3">
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${goal.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-line'}`}>
              <CircleCheck size={24} aria-hidden="true" className={goal.completed ? 'fill-emerald-500/15' : ''} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className={`text-sm font-semibold ${goal.completed ? 'text-muted line-through' : ''}`}>
                  {label}
                  {goal.completed && <span className="sr-only"> ({t('progress.goalDone')})</span>}
                </p>
                <span className="shrink-0 text-xs font-bold text-accent">+{goal.xp} XP</span>
              </div>
              <ProgressBar
                value={goal.current}
                max={goal.target}
                label={t('progress.goalProgress', { label, current: goal.current, target: goal.target })}
                className="mt-1.5 h-2"
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default DailyGoals
