import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, CircleAlert, Shuffle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import BunnyMascot from '@/components/BunnyMascot'
import Button from '@/components/ui/Button'
import { ErrorState, LoadingState } from '@/features/learn/components/ContentState'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import { findStudyLanguage } from '@/features/learn/languages'
import { useStartGame } from '@/features/practice/hooks/useStartGame'
import { mistakesQuery } from '../queries'
import type { ItemSummary, LanguageMistakes } from '../types'

function ReviewPage() {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = useQuery(mistakesQuery)
  const start = useStartGame()

  return (
    <div className="mx-auto w-full max-w-app px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="text-3xl font-extrabold">{t('review.title')}</h1>
      <p className="mt-2 text-muted">{t('review.subtitle')}</p>

      <div className="mt-8">
        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <BunnyMascot size={96} interactive={false} />
            <h2 className="text-lg font-bold">{t('review.empty.title')}</h2>
            <p className="max-w-md text-muted">{t('review.empty.description')}</p>
            <Link to="/app" className="mt-2 font-semibold text-accent hover:underline">
              {t('review.empty.cta')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {data.map((language) => (
              <LanguageReview
                key={language.languageCode}
                review={language}
                starting={start.isPending ? (start.variables?.language === language.languageCode ? start.variables.source : null) : null}
                busy={start.isPending}
                onReviewDue={() => start.mutate({ gameType: 'FLASHCARD', language: language.languageCode, source: 'DUE' })}
                onPracticeMistakes={() => start.mutate({ gameType: 'MULTIPLE_CHOICE', language: language.languageCode, source: 'MISTAKES' })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface LanguageReviewProps {
  review: LanguageMistakes
  starting: string | null
  busy: boolean
  onReviewDue: () => void
  onPracticeMistakes: () => void
}

function LanguageReview({ review, starting, busy, onReviewDue, onPracticeMistakes }: LanguageReviewProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const language = findStudyLanguage(review.languageCode)
  const lang = review.languageCode

  return (
    <section
      aria-labelledby={`review-${lang}`}
      className={`rounded-3xl border border-line-soft bg-surface-raised p-5 shadow-sm sm:p-6 ${lang === 'ko' ? 'break-keep' : ''}`}
    >
      <h2 id={`review-${lang}`} className="flex items-center gap-3 text-xl font-bold">
        {language && <language.Flag className="h-5 w-7 rounded-[3px] shadow-sm" />}
        {language ? loc(language.name) : lang}
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <p className="flex items-center gap-2 font-semibold">
            <CalendarCheck size={20} aria-hidden="true" className="text-accent" />
            {review.dueCount > 0 ? t('review.due', { count: review.dueCount }) : t('review.noneDue')}
          </p>
          <Button onClick={onReviewDue} disabled={review.dueCount === 0 || busy} loading={starting === 'DUE'} className="w-full">
            {t('review.reviewDue')}
          </Button>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert size={20} aria-hidden="true" className="text-red-600 dark:text-red-400" />
            {review.weakCount > 0 ? t('review.weak', { count: review.weakCount }) : t('review.noneWeak')}
          </p>
          <Button
            variant="outline"
            onClick={onPracticeMistakes}
            disabled={review.weakCount === 0 || busy}
            loading={starting === 'MISTAKES'}
            className="w-full"
          >
            {t('review.practiceMistakes')}
          </Button>
        </div>
      </div>

      {review.weakItems.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-muted">{t('review.weakTitle')}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {review.weakItems.map(({ item, attemptCount, correctCount }) => (
              <li
                key={item.id}
                title={t('review.weakStats', { wrong: attemptCount - correctCount, total: attemptCount })}
                className="flex items-baseline gap-1.5 rounded-xl border border-red-300/70 bg-red-50 px-3 py-1.5 dark:border-red-800 dark:bg-red-950/40"
              >
                <ItemLabel item={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {review.confusions.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-muted">{t('review.confusionsTitle')}</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {review.confusions.map(({ items: [first, second], count }) => (
              <li key={`${first.id}-${second.id}`} className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2">
                <ItemLabel item={first} />
                <Shuffle size={16} aria-label={t('review.versus')} className="shrink-0 text-muted" />
                <ItemLabel item={second} />
                <span className="ml-auto shrink-0 text-xs font-semibold text-muted">{t('review.confusedTimes', { count })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function ItemLabel({ item }: { item: ItemSummary }) {
  const loc = useLocalized()
  return (
    <span className="flex min-w-0 items-baseline gap-1.5">
      <span lang={item.languageCode} className="text-lg font-bold">
        {item.text}
      </span>
      <span className="truncate text-xs text-muted">{item.romanization ?? (item.meaning ? loc(item.meaning) : '')}</span>
    </span>
  )
}

export default ReviewPage
