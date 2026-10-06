import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, RotateCcw } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import SearchField from '@/components/ui/SearchField'
import { ErrorState, LoadingState } from '@/features/learn/components/ContentState'
import { useStudy } from '@/features/learn/context'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import DrillEntryCard from '@/features/script-drill/components/DrillEntryCard'
import SetCard from '../components/SetCard'
import { useStartGame } from '../hooks/useStartGame'
import { contentSourcesQuery, learningSetsQuery } from '../queries'
import { filterSets, groupIntoShelves, paginate, type Shelf } from '../shelves'
import type { LearningSet, NewGame } from '../types'

interface StartProps {
  busy: boolean
  startingFor: (setId: string) => NewGame['gameType'] | null
  onStart: (set: LearningSet, gameType: NewGame['gameType']) => void
}

const GRID = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
/** A level has up to 29 topics. 12 fills whole rows of 2, 3 or 4 cards; a phone shows one column, so fewer. */
const SETS_PER_PAGE = { wide: 12, phone: 6 }

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
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand/15 text-accent">
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

      <DrillEntryCard language={language.code} />

      {shelves.length > 1 && (
        <ShelfPicker shelves={shelves} active={active} onPick={(key) => params.update({ shelf: key, q: null, topic: null, page: null })} />
      )}

      {/* Keyed by shelf so the search box starts empty on another level. */}
      {active && <ShelfSection key={active.key} shelf={active} {...startProps} />}

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
                className={`flex min-h-11 flex-col items-start justify-center rounded-xl border px-4 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  selected
                    ? 'border-brand-edge bg-brand text-on-brand shadow-sm'
                    : 'border-line-soft bg-surface-raised hover:border-primary-400'
                }`}
              >
                <span className="text-sm font-bold whitespace-nowrap">
                  {shelf.level ? shelf.level.code : t(`practice.shelves.${shelf.kind}`)}
                </span>
                <span className={`text-xs whitespace-nowrap tabular-nums ${selected ? 'text-on-brand/80' : 'text-muted'}`}>
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

/** One tab: a page of set cards. An exam level (one set per topic, ~30 topics) adds a search box and topic chips. */
function ShelfSection({ shelf, ...startProps }: { shelf: Shelf } & StartProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const params = useShelfParams()
  const { ref, scrollToTop } = usePageScroll()
  const wide = useMediaQuery('(min-width: 48rem)')
  // Typed text lives here, the address follows (see SearchField).
  const [query, setQuery] = useState(params.query)
  const searchable = shelf.kind === 'level'

  const search = (value: string) => {
    setQuery(value)
    params.update({ q: value.trim() ? value : null, topic: null, page: null })
  }

  const matching = searchable ? filterSets(shelf.sets, query) : shelf.sets
  const chosen = params.topic ? shelf.sets.filter((set) => set.topic?.slug === params.topic) : []
  const visible = chosen.length > 0 ? chosen : matching
  const { items, page, pageCount } = paginate(visible, params.page, wide ? SETS_PER_PAGE.wide : SETS_PER_PAGE.phone)

  return (
    <section ref={ref} aria-labelledby="shelf-title" className="scroll-mt-32 space-y-5">
      <div>
        <h2 id="shelf-title" className="text-xl font-bold">
          {shelf.level ? loc(shelf.level.title) : t(`practice.shelves.${shelf.kind}`)}
        </h2>
        {searchable && (
          <p className="text-sm text-muted">
            {t('practice.set.items', { count: shelf.itemCount })} · {t('practice.shelves.topics', { count: shelf.sets.length })}
          </p>
        )}
      </div>

      {searchable && (
        <>
          <SearchField
            value={query}
            onChange={search}
            label={t('practice.shelves.search')}
            placeholder={t('practice.shelves.searchPlaceholder')}
            className="max-w-xl"
          />
          <TopicChips sets={matching} selected={params.topic} onPick={(topic) => params.update({ topic, page: null })} />
        </>
      )}

      {visible.length === 0 ? (
        <p role="status" className="rounded-2xl border border-dashed border-line-soft p-6 text-center text-muted">
          {t('practice.shelves.noTopic', { query: query.trim() })}
        </p>
      ) : (
        <>
          {searchable && (
            <p aria-live="polite" className="text-sm text-muted">
              {t('practice.shelves.showing', { count: visible.length })}
            </p>
          )}
          <div className={GRID}>
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
            label={t(searchable ? 'practice.shelves.topicsLabel' : 'practice.shelves.setsLabel')}
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

/** One chip per topic: tap to show only that topic, tap again to show them all. Scrolls sideways on a phone. */
function TopicChips({ sets, selected, onPick }: { sets: LearningSet[]; selected: string | null; onPick: (topic: string | null) => void }) {
  const { t } = useTranslation()
  const loc = useLocalized()

  return (
    <nav aria-label={t('practice.shelves.jump')} className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
      <ul className="flex gap-2 sm:flex-wrap">
        {sets.flatMap(({ topic }) => {
          if (!topic) return []
          const pressed = selected === topic.slug
          return (
            <li key={topic.slug} className="shrink-0">
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => onPick(pressed ? null : topic.slug)}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-accent sm:min-h-9 ${
                  pressed ? 'border-brand-edge bg-brand text-on-brand' : 'border-line-soft bg-surface-raised hover:border-primary-400'
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
