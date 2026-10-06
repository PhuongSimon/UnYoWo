import { ChevronRight, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import RichText from '../components/RichText'
import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import type { GrammarTopic, Level } from '../types'

const LEVELS: Level[] = ['A1', 'A2']

/** Lower-cases and strips accents so "cau truc" finds "Cấu trúc". */
function normalize(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/[đĐ]/g, 'd')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

interface NumberedTopic {
  topic: GrammarTopic
  number: number
}

function GrammarListPage() {
  const { t } = useTranslation()
  const { language, content } = useStudy()
  const loc = useLocalized()
  const [searchParams, setSearchParams] = useSearchParams()
  // Local state keeps typing smooth (IME input included); the URL keeps the filter when coming back from a lesson.
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const levelParam = searchParams.get('level')
  const level = LEVELS.find((item) => item === levelParam) ?? null

  const needle = normalize(query.trim())
  const searched: NumberedTopic[] = content.grammar
    .map((topic, index) => ({ topic, number: index + 1 }))
    .filter(({ topic }) => !needle || normalize(`${loc(topic.title)} ${loc(topic.summary)}`).includes(needle))
  const visible = level ? searched.filter(({ topic }) => topic.level === level) : searched

  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setSearchParams(next, { replace: true, preventScrollReset: true })
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    updateParams({ q: value.trim() || null })
  }

  function clearFilters() {
    setQuery('')
    updateParams({ q: null, level: null })
  }

  const filters = [
    { value: null, label: t('learn.grammar.all'), count: searched.length },
    ...LEVELS.map((item) => ({
      value: item,
      label: language.levelLabels[item],
      count: searched.filter(({ topic }) => topic.level === item).length,
    })),
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t('learn.grammar.searchPlaceholder')}
            aria-label={t('learn.grammar.searchLabel')}
            className="h-11 w-full rounded-xl border border-line-soft bg-surface-raised pr-3 pl-10 text-base transition-colors outline-none placeholder:text-muted/70 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 sm:text-sm"
          />
        </div>

        <div role="group" aria-label={t('learn.grammar.levelFilter')} className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
          {filters.map((filter) => {
            const active = filter.value === level
            return (
              <button
                key={filter.value ?? 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => updateParams({ level: filter.value })}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  active ? 'border-brand-edge bg-brand text-on-brand' : 'border-line-soft bg-surface-raised text-muted hover:border-primary-400 hover:text-fg'
                }`}
              >
                {filter.label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-primary-950/15' : 'bg-surface'}`}>{filter.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-soft px-4 py-14 text-center">
          <p className="text-muted">{t('learn.grammar.empty', { query: query.trim() })}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-line-soft bg-surface-raised px-4 py-2 text-sm font-semibold transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X size={16} aria-hidden="true" />
            {t('learn.grammar.clear')}
          </button>
        </div>
      ) : (
        LEVELS.map((item) => {
          const items = visible.filter(({ topic }) => topic.level === item)
          if (items.length === 0) return null

          return (
            <section key={item} aria-labelledby={`level-${item}`} className="space-y-4">
              <h2 id={`level-${item}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-bold sm:text-xl">
                <span className="rounded-full bg-brand/15 px-3 py-0.5 text-sm font-extrabold text-accent">{language.levelLabels[item]}</span>
                {t(`learn.grammar.level.${item}`)}
                <span className="text-sm font-medium text-muted">{t('learn.grammar.lessonCount', { count: items.length })}</span>
              </h2>
              <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {items.map(({ topic, number }) => (
                  <li key={topic.id}>
                    <Link
                      to={topic.id}
                      state={{ listSearch: searchParams.toString() }}
                      className="group flex h-full items-start gap-3 rounded-2xl border border-line-soft bg-surface-raised p-4 transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-800 tabular-nums dark:bg-espresso-700 dark:text-secondary-200">
                        {number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-fg transition-colors group-hover:text-accent">{loc(topic.title)}</span>
                        <span className="mt-0.5 line-clamp-2 block text-sm text-muted">
                          <RichText text={loc(topic.summary)} />
                        </span>
                      </span>
                      <ChevronRight size={18} aria-hidden="true" className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}

export default GrammarListPage
