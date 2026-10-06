import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Layers } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import SearchField from '@/components/ui/SearchField'
import { ErrorState, LoadingState, NotFoundState } from '@/features/learn/components/ContentState'
import SpeakButton from '@/features/learn/components/SpeakButton'
import { useStudy } from '@/features/learn/context'
import { useLocalized, useUiLanguage } from '@/features/learn/hooks/useLocalized'
import { getApiError } from '@/lib/api-error'
import { searchList } from '@/lib/search'
import { useStartGame } from '../hooks/useStartGame'
import { setItemsQuery } from '../queries'
import { paginate } from '../shelves'
import type { LearningSet, SetItem, SetItemsPage } from '../types'

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

/** Fills 1, 2 or 3 columns evenly. */
const WORDS_PER_PAGE = 24

/** Everything a learner might type to find a word: the word, how it is read, either meaning, Hán Việt… */
const searchableText = (item: SetItem) => [
  item.text,
  item.reading,
  item.romanization,
  item.meaning?.vi,
  item.meaning?.en,
  item.attributes?.article && `${item.attributes.article} ${item.text}`,
  item.attributes?.plural,
  item.attributes?.hanViet,
  item.attributes?.hanja,
]

function SetWordsPage() {
  const { t } = useTranslation()
  const { setId = '' } = useParams()
  const { language } = useStudy()
  const query = useQuery(setItemsQuery(setId))

  if (query.isPending) return <LoadingState />
  if (query.isError) {
    return getApiError(query.error).code === 'SET_NOT_FOUND' ? (
      <NotFoundState backTo={`/app/${language.code}/practice`} backLabel={t('practice.words.back')} />
    ) : (
      <ErrorState onRetry={() => void query.refetch()} />
    )
  }

  // Keyed by set: another set starts with an empty search.
  return <WordList key={setId} data={query.data} />
}

/** The search text and page live in the address (?q=…&page=2) so "back" from flashcards keeps them. */
function WordList({ data }: { data: SetItemsPage }) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const { language } = useStudy()
  const start = useStartGame()
  const [params, setParams] = useSearchParams()
  // Typed text lives here, the address follows (see SearchField).
  const [search, setSearch] = useState(() => params.get('q') ?? '')
  const listRef = useRef<HTMLDivElement>(null)

  const { set, items: words } = data
  const title = loc(set.title)
  const matching = searchList(words, search, searchableText)
  const { items, page, pageCount } = paginate(matching, Number(params.get('page')) || 1, WORDS_PER_PAGE)

  const updateParams = (changes: Record<string, string | null>) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  const onSearch = (value: string) => {
    setSearch(value)
    updateParams({ q: value.trim() ? value : null, page: null })
  }

  const onPage = (next: number) => {
    updateParams({ page: next > 1 ? String(next) : null })
    listRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

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
          <p className="text-muted">{t('practice.set.items', { count: words.length })}</p>
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

      <div ref={listRef} className="scroll-mt-32 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SearchField
            value={search}
            onChange={onSearch}
            label={t('practice.words.search')}
            placeholder={t('practice.words.searchPlaceholder')}
            className="w-full sm:max-w-md"
          />
          {search.trim() && matching.length > 0 && (
            <p aria-live="polite" className="text-sm text-muted tabular-nums">
              {t('practice.words.found', { count: matching.length, total: words.length })}
            </p>
          )}
        </div>

        {matching.length === 0 ? (
          <p role="status" className="rounded-2xl border border-dashed border-line-soft p-6 text-center text-muted">
            {t('practice.words.noMatch', { query: search.trim() })}
          </p>
        ) : (
          <ul aria-label={t('practice.words.pageLabel')} className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {items.map((item) => (
              <WordRow key={item.id} item={item} languageCode={language.code} />
            ))}
          </ul>
        )}
      </div>

      <Pagination page={page} pageCount={pageCount} label={t('practice.words.pageLabel')} onChange={onPage} />
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
    <li className="flex items-start gap-3 rounded-2xl border border-line-soft bg-surface-raised px-4 py-3 shadow-sm sm:px-5">
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
