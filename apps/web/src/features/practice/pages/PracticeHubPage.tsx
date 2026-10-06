import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, RotateCcw, Search, X } from 'lucide-react'
import { useId, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import { ErrorState, LoadingState } from '@/features/learn/components/ContentState'
import { useStudy } from '@/features/learn/context'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import SetCard from '../components/SetCard'
import { useStartGame } from '../hooks/useStartGame'
import { contentSourcesQuery, learningSetsQuery } from '../queries'
import { filterTopics, groupIntoShelves, paginate, type Shelf, type TopicGroup } from '../shelves'
import type { LearningSet, NewGame } from '../types'

interface StartProps {
  busy: boolean
  startingFor: (setId: string) => NewGame['gameType'] | null
  onStart: (set: LearningSet, gameType: NewGame['gameType']) => void
}

const GRID = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
/** A level has up to 29 topics of 1–4 parts: a few topics per page keeps the page short. */
const TOPICS_PER_PAGE = 4
const SETS_PER_PAGE = 12

/**
 * The shelf, topic filter, search text and page live in the address (?shelf=N5&q=food&page=2),
 * so the back button from a game or a word list returns to the same place.
 */
function useShelfParams() {
  const [params, setParams] = useSearchParams()
  const update = (changes: Record<string, string | null>) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )
  return {
    shelf: params.get('shelf'),
    query: params.get('q') ?? '',
    topic: params.get('topic'),
    page: Number(params.get('page')) || 1,
    update,
  }
}

function PracticeHubPage() {
  const { t } = useTranslation()
  const { language } = useStudy()
  const params = useShelfParams()
  const { data: sets, isPending, isError, refetch } = useQuery(learningSetsQuery(language.code))
  const start = useStartGame()
  const shelves = useMemo(() => (sets ? groupIntoShelves(sets) : []), [sets])

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const startGame = (game: Omit<NewGame, 'language'>) => start.mutate({ ...game, language: language.code })
  const startingFor = (setId: string | undefined) =>
    start.isPending && start.variables?.setId === setId ? start.variables.gameType : null
  const startProps: StartProps = {
    busy: start.isPending,
    startingFor,
    onStart: (set, gameType) => startGame({ gameType, source: 'SET', setId: set.id }),
  }

  const due = sets.reduce((sum, set) => sum + set.progress.due, 0)
  const active = shelves.find((shelf) => shelf.key === params.shelf) ?? shelves[0]

  return (
    <div className="space-y-8">
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

      {shelves.length > 1 && (
        <ShelfPicker shelves={shelves} active={active} onPick={(key) => params.update({ shelf: key, q: null, topic: null, page: null })} />
      )}

      {active && (active.kind === 'level' ? <LevelShelf shelf={active} {...startProps} /> : <PlainShelf shelf={active} {...startProps} />)}

      <SourceCredits language={language.code} />
    </div>
  )
}

/** Alphabet, starter words and each exam level: one tap away, scrolling sideways on a phone. */
function ShelfPicker({ shelves, active, onPick }: { shelves: Shelf[]; active: Shelf | undefined; onPick: (key: string) => void }) {
  const { t } = useTranslation()
  const loc = useLocalized()

  return (
    <nav aria-label={t('practice.shelves.label')} className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
      <ul className="flex gap-2">
        {shelves.map((shelf) => {
          const selected = shelf.key === active?.key
          return (
            <li key={shelf.key} className="shrink-0">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onPick(shelf.key)}
                title={shelf.level ? loc(shelf.level.title) : undefined}
                className={`flex min-h-11 flex-col items-start justify-center rounded-xl border px-4 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 ${
                  selected
                    ? 'border-primary-600 bg-primary-500 text-primary-950 shadow-sm'
                    : 'border-line-soft bg-surface-raised hover:border-primary-400'
                }`}
              >
                <span className="text-sm font-bold whitespace-nowrap">
                  {shelf.level ? shelf.level.code : t(`practice.shelves.${shelf.kind}`)}
                </span>
                <span className={`text-xs whitespace-nowrap tabular-nums ${selected ? 'text-primary-950/80' : 'text-muted'}`}>
                  {t('practice.set.items', { count: shelf.itemCount })}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Scrolls the list back to its heading when the page changes, so the first new item is in view. */
function usePageScroll() {
  const ref = useRef<HTMLElement>(null)
  return {
    ref,
    scrollToTop: () => ref.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }),
  }
}

function PlainShelf({ shelf, ...startProps }: { shelf: Shelf } & StartProps) {
  const { t } = useTranslation()
  const params = useShelfParams()
  const { ref, scrollToTop } = usePageScroll()
  const { items, page, pageCount } = paginate(shelf.sets, params.page, SETS_PER_PAGE)

  return (
    <section ref={ref} aria-labelledby="shelf-title" className="scroll-mt-32">
      <h2 id="shelf-title" className="text-xl font-bold">
        {t(`practice.shelves.${shelf.kind}`)}
      </h2>
      <div className={`mt-4 ${GRID}`}>
        {items.map((set) => (
          <SetCard
            key={set.id}
            set={set}
            starting={startProps.startingFor(set.id)}
            disabled={startProps.busy}
            onStart={(gameType) => startProps.onStart(set, gameType)}
          />
        ))}
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        label={t('practice.shelves.setsLabel')}
        onChange={(next) => {
          params.update({ page: String(next) })
          scrollToTop()
        }}
        className="mt-6"
      />
    </section>
  )
}

/** An exam level: search and topic chips to narrow it down, then a page of topics with their parts. */
function LevelShelf({ shelf, ...startProps }: { shelf: Shelf } & StartProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const params = useShelfParams()
  const searchId = useId()
  const { ref, scrollToTop } = usePageScroll()

  const chosen = params.topic ? shelf.topics.filter((group) => group.topic.slug === params.topic) : []
  const visible = chosen.length > 0 ? chosen : filterTopics(shelf.topics, params.query)
  const { items, page, pageCount } = paginate(visible, params.page, TOPICS_PER_PAGE)

  return (
    <section ref={ref} aria-labelledby="shelf-title" className="scroll-mt-32 space-y-5">
      <div>
        <h2 id="shelf-title" className="text-xl font-bold">
          {shelf.level ? loc(shelf.level.title) : ''}
        </h2>
        <p className="text-sm text-muted">
          {t('practice.set.items', { count: shelf.itemCount })} · {t('practice.shelves.topics', { count: shelf.topics.length })}
        </p>
      </div>

      <div role="search" className="relative max-w-xl">
        <label htmlFor={searchId} className="sr-only">
          {t('practice.shelves.search')}
        </label>
        <Search size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
        <input
          id={searchId}
          type="search"
          value={params.query}
          onChange={(event) => params.update({ q: event.target.value || null, topic: null, page: null })}
          placeholder={t('practice.shelves.searchPlaceholder')}
          autoComplete="off"
          enterKeyHint="search"
          className="min-h-11 w-full rounded-xl border-2 border-line bg-surface py-2 pr-11 pl-10 text-base text-fg outline-none transition-colors placeholder:text-muted/60 hover:border-primary-400 focus:border-primary-500 [&::-webkit-search-cancel-button]:hidden"
        />
        {params.query && (
          <button
            type="button"
            onClick={() => params.update({ q: null, page: null })}
            aria-label={t('practice.shelves.clearSearch')}
            className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label={t('practice.shelves.jump')} className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
        <ul className="flex gap-2 sm:flex-wrap">
          {filterTopics(shelf.topics, params.query).map(({ topic }) => {
            const selected = params.topic === topic.slug
            return (
              <li key={topic.slug} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => params.update({ topic: selected ? null : topic.slug, page: null })}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 sm:min-h-9 ${
                    selected ? 'border-primary-600 bg-primary-500 text-primary-950' : 'border-line-soft bg-surface-raised hover:border-primary-400'
                  }`}
                >
                  {topic.emoji && <span aria-hidden="true">{topic.emoji}</span>}
                  {loc(topic.title)}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {visible.length === 0 ? (
        <p role="status" className="rounded-2xl border border-dashed border-line-soft p-6 text-center text-muted">
          {t('practice.shelves.noTopic', { query: params.query })}
        </p>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-muted">
            {t('practice.shelves.showing', { count: visible.length })}
          </p>
          {items.map((group) => (
            <TopicSection key={group.topic.slug} group={group} {...startProps} />
          ))}
          <Pagination
            page={page}
            pageCount={pageCount}
            label={t('practice.shelves.topicsLabel')}
            onChange={(next) => {
              params.update({ page: String(next) })
              scrollToTop()
            }}
          />
        </>
      )}
    </section>
  )
}

function TopicSection({ group, ...startProps }: { group: TopicGroup } & StartProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const { topic, sets } = group

  return (
    // scroll-mt keeps the heading clear of the sticky header and tab bar after a jump.
    <section id={`topic-${topic.slug}`} aria-labelledby={`topic-${topic.slug}-title`} className="scroll-mt-32">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 id={`topic-${topic.slug}-title`} className="text-lg font-bold">
          {topic.emoji && (
            <span aria-hidden="true" className="mr-1.5">
              {topic.emoji}
            </span>
          )}
          {loc(topic.title)}
        </h3>
        <p className="text-sm text-muted tabular-nums">{t('practice.set.seen', { seen: group.seen, total: group.itemCount })}</p>
      </div>
      <div className={`mt-3 ${GRID}`}>
        {sets.map((set) => (
          <SetCard
            key={set.id}
            set={set}
            heading={sets.length > 1 ? t('practice.shelves.part', { part: set.part ?? 1 }) : t('practice.shelves.allWords')}
            headingLevel={4}
            starting={startProps.startingFor(set.id)}
            disabled={startProps.busy}
            onStart={(gameType) => startProps.onStart(set, gameType)}
          />
        ))}
      </div>
    </section>
  )
}

/** Open data licences (CC BY, CC BY-SA) ask for credit wherever the words are shown. */
function SourceCredits({ language }: { language: string }) {
  const { t } = useTranslation()
  const { data: sources } = useQuery(contentSourcesQuery(language))
  if (!sources || sources.length === 0) return null

  return (
    <footer className="border-t border-line-soft pt-4 text-xs text-muted">
      <p className="font-semibold">{t('practice.sources.title')}</p>
      <ul className="mt-1 space-y-0.5">
        {sources.map((source) => (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-fg">
              {source.name}
            </a>{' '}
            · {source.license}. {source.attribution}
          </li>
        ))}
      </ul>
    </footer>
  )
}

export default PracticeHubPage
