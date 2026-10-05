import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { ErrorState, LoadingState } from '@/features/learn/components/ContentState'
import { useStudy } from '@/features/learn/context'
import SetCard from '../components/SetCard'
import { useStartGame } from '../hooks/useStartGame'
import { learningSetsQuery } from '../queries'
import type { LearningSet, NewGame } from '../types'

function PracticeHubPage() {
  const { t } = useTranslation()
  const { language } = useStudy()
  const { data: sets, isPending, isError, refetch } = useQuery(learningSetsQuery(language.code))
  const start = useStartGame()

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const startGame = (game: Omit<NewGame, 'language'>) => start.mutate({ ...game, language: language.code })
  const startingFor = (setId: string | undefined) =>
    start.isPending && start.variables?.setId === setId ? start.variables.gameType : null

  const due = sets.reduce((sum, set) => sum + set.progress.due, 0)
  const sections = [
    { key: 'alphabet', sets: sets.filter((set) => set.kind === 'ALPHABET') },
    { key: 'vocabulary', sets: sets.filter((set) => set.kind === 'VOCABULARY') },
  ].filter((section) => section.sets.length > 0)

  return (
    <div className="space-y-10">
      <section
        aria-labelledby="practice-review"
        className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface-raised p-5 shadow-sm sm:flex-row sm:items-center"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-accent">
          <CalendarCheck size={24} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="practice-review" className="text-lg font-bold">
            {t('practice.review.title')}
          </h2>
          <p className="text-muted">{due > 0 ? t('practice.review.due', { count: due }) : t('practice.review.none')}</p>
        </div>
        {due > 0 && (
          <Button
            onClick={() => startGame({ gameType: 'FLASHCARD', source: 'DUE' })}
            loading={startingFor(undefined) !== null}
            disabled={start.isPending}
            className="w-full sm:w-auto"
          >
            <RotateCcw size={18} aria-hidden="true" />
            {t('practice.review.start')}
          </Button>
        )}
      </section>

      {sections.map((section) => (
        <SetSection
          key={section.key}
          title={t(`practice.sections.${section.key}`)}
          sets={section.sets}
          busy={start.isPending}
          startingFor={startingFor}
          onStart={(set, gameType) => startGame({ gameType, source: 'SET', setId: set.id })}
        />
      ))}
    </div>
  )
}

interface SetSectionProps {
  title: string
  sets: LearningSet[]
  busy: boolean
  startingFor: (setId: string) => NewGame['gameType'] | null
  onStart: (set: LearningSet, gameType: NewGame['gameType']) => void
}

function SetSection({ title, sets, busy, startingFor, onStart }: SetSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sets.map((set) => (
          <SetCard
            key={set.id}
            set={set}
            starting={startingFor(set.id)}
            disabled={busy}
            onStart={(gameType) => onStart(set, gameType)}
          />
        ))}
      </div>
    </section>
  )
}

export default PracticeHubPage
