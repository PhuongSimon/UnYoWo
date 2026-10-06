import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowLeft, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import { ErrorState, LoadingState, NotFoundState } from '@/features/learn/components/ContentState'
import SpeakButton from '@/features/learn/components/SpeakButton'
import { useStudy } from '@/features/learn/context'
import { useLocalized, useUiLanguage } from '@/features/learn/hooks/useLocalized'
import { getApiError } from '@/lib/api-error'
import { useStartGame } from '../hooks/useStartGame'
import { setItemsQuery } from '../queries'
import type { LearningSet, SetItem } from '../types'

/** Which practice tab a set lives on, so "back" returns to it. */
function shelfOf(set: Pick<LearningSet, 'kind' | 'level'>) {
  if (set.level) return set.level.code
  return set.kind === 'ALPHABET' ? 'alphabet' : 'starter'
}

const ARTICLE_COLOR: Record<string, string> = {
  der: 'text-sky-600 dark:text-sky-400',
  die: 'text-rose-600 dark:text-rose-400',
  das: 'text-emerald-600 dark:text-emerald-400',
}

function SetWordsPage() {
  const { t } = useTranslation()
  const loc = useLocalized()
  const { setId = '' } = useParams()
  const { language } = useStudy()
  const query = useInfiniteQuery(setItemsQuery(setId))
  const start = useStartGame()

  if (query.isPending) return <LoadingState />
  if (query.isError) {
    return getApiError(query.error).code === 'SET_NOT_FOUND' ? (
      <NotFoundState backTo={`/app/${language.code}/practice`} backLabel={t('practice.words.back')} />
    ) : (
      <ErrorState onRetry={() => void query.refetch()} />
    )
  }

  const { set, total } = query.data.pages[0]
  const items = query.data.pages.flatMap((page) => page.items)
  const title = loc(set.title)

  return (
    <div className="space-y-6">
      <Link
        to={`/app/${language.code}/practice?shelf=${shelfOf(set)}`}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('practice.words.back')}
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {set.level && <p className="text-sm font-semibold text-accent">{loc(set.level.title)}</p>}
          <h2 className="text-2xl font-extrabold">
            {set.topic?.emoji && (
              <span aria-hidden="true" className="mr-2">
                {set.topic.emoji}
              </span>
            )}
            {title}
          </h2>
          <p className="text-muted">{t('practice.set.items', { count: total })}</p>
        </div>
        <Button
          onClick={() => start.mutate({ gameType: 'FLASHCARD', source: 'SET', setId: set.id, language: language.code })}
          loading={start.isPending}
          className="w-full sm:w-auto"
        >
          <Layers size={18} aria-hidden="true" />
          {t('practice.words.practise')}
        </Button>
      </header>

      <ul className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface-raised shadow-sm">
        {items.map((item) => (
          <WordRow key={item.id} item={item} languageCode={language.code} />
        ))}
      </ul>

      {query.hasNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => void query.fetchNextPage()} loading={query.isFetchingNextPage}>
            {t('practice.words.more')}
          </Button>
        </div>
      )}
    </div>
  )
}

function WordRow({ item, languageCode }: { item: SetItem; languageCode: string }) {
  const { t } = useTranslation()
  const ui = useUiLanguage()
  const other = ui === 'vi' ? 'en' : 'vi'
  // An English word has no English meaning: show the Vietnamese one rather than nothing.
  const meaning = item.meaning?.[ui] ?? item.meaning?.[other] ?? null
  const meaningLang = item.meaning?.[ui] ? ui : other
  const { article, plural, hanViet, hanja, masu, speak } = item.attributes ?? {}
  const pronunciation = [item.reading, item.romanization].filter(Boolean).join(' · ')
  const details = [
    item.partOfSpeech && t(`practice.pos.${item.partOfSpeech}`),
    plural && t('practice.words.plural', { value: plural }),
    hanViet && t('practice.words.hanViet', { value: hanViet }),
    hanja && t('practice.words.hanja', { value: hanja }),
    masu && t('practice.words.masu', { value: masu }),
  ].filter(Boolean)

  return (
    <li className="flex items-start gap-3 px-4 py-3 sm:px-5">
      <SpeakButton text={speak ?? (article ? `${article} ${item.text}` : item.text)} size="md" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span lang={languageCode} className="text-lg font-bold break-words">
            {article && <span className={`font-semibold ${ARTICLE_COLOR[article] ?? ''}`}>{article} </span>}
            {item.text}
          </span>
          {pronunciation && <span className="text-sm text-muted">{pronunciation}</span>}
        </p>
        {meaning && (
          <p lang={meaningLang} className="font-medium">
            {meaning}
          </p>
        )}
        {details.length > 0 && <p className="mt-0.5 text-xs text-muted">{details.join(' · ')}</p>}
      </div>
      {item.emoji && (
        <span aria-hidden="true" className="text-2xl">
          {item.emoji}
        </span>
      )}
    </li>
  )
}

export default SetWordsPage
