import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useParams } from 'react-router'
import { NotFoundState } from '../components/ContentState'
import DataTable from '../components/DataTable'
import ExampleList from '../components/ExampleList'
import RichText from '../components/RichText'
import TipList from '../components/TipList'
import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import type { GrammarTopic, Section } from '../types'

interface ListState {
  /** Search params of the lesson list, so "back" restores the filter the user had. */
  listSearch?: string
}

function GrammarTopicPage() {
  const { topicId } = useParams()
  const { t } = useTranslation()
  const { language, content } = useStudy()
  const loc = useLocalized()
  const location = useLocation()

  const listPath = `/app/${language.code}/grammar`
  const listSearch = (location.state as ListState | null)?.listSearch ?? ''
  const linkState: ListState = { listSearch }
  const index = content.grammar.findIndex((topic) => topic.id === topicId)

  if (index === -1) {
    return <NotFoundState title={t('learn.grammar.notFound')} backTo={listPath} backLabel={t('learn.grammar.backToList')} />
  }

  const topic = content.grammar[index]
  const previous = content.grammar[index - 1]
  const next = content.grammar[index + 1]

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block">
        <nav aria-label={t('learn.grammar.contents')} className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto pr-2">
          <p className="mb-2 px-2 text-xs font-bold tracking-wide text-muted uppercase">{t('learn.grammar.contents')}</p>
          <ol className="space-y-0.5">
            {content.grammar.map((item, itemIndex) => (
              <li key={item.id}>
                <NavLink
                  to={`${listPath}/${item.id}`}
                  state={linkState}
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 ${
                      isActive ? 'bg-primary-500/15 font-semibold text-accent' : 'text-muted hover:bg-surface-raised hover:text-fg'
                    }`
                  }
                >
                  <span className="w-5 shrink-0 text-right text-xs leading-5 tabular-nums opacity-70">{itemIndex + 1}</span>
                  <span>{loc(item.title)}</span>
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <article className="min-w-0">
        <Link
          to={{ pathname: listPath, search: listSearch }}
          className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t('learn.grammar.backToList')}
        </Link>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-primary-500/15 px-3 py-0.5 font-extrabold text-accent">{language.levelLabels[topic.level]}</span>
            <span className="text-muted">{t('learn.grammar.lessonOf', { current: index + 1, total: content.grammar.length })}</span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{loc(topic.title)}</h2>
          <p className="mt-2 leading-relaxed text-muted sm:text-lg">
            <RichText text={loc(topic.summary)} />
          </p>
        </header>

        <div className="mt-8 space-y-8">
          {topic.sections.map((section, sectionIndex) => (
            <TopicSection key={sectionIndex} section={section} />
          ))}
          {topic.tips && <TipList title={t('learn.grammar.tips')} tips={topic.tips} />}
        </div>

        <nav aria-label={t('learn.grammar.pagination')} className="mt-10 grid gap-3 border-t border-line-soft pt-6 sm:grid-cols-2">
          {previous && <PagerLink to={`${listPath}/${previous.id}`} state={linkState} topic={previous} direction="previous" />}
          {next && <PagerLink to={`${listPath}/${next.id}`} state={linkState} topic={next} direction="next" />}
        </nav>
      </article>
    </div>
  )
}

function TopicSection({ section }: { section: Section }) {
  const loc = useLocalized()

  return (
    <section className="space-y-4">
      {section.title && <h3 className="text-lg font-bold sm:text-xl">{loc(section.title)}</h3>}
      {section.body && (
        <p className="leading-relaxed text-fg/90">
          <RichText text={loc(section.body)} />
        </p>
      )}
      {section.bullets && (
        <ul className="space-y-2">
          {section.bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
              <span>
                <RichText text={loc(bullet)} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {section.table && <DataTable table={section.table} />}
      {section.examples && <ExampleList examples={section.examples} />}
    </section>
  )
}

interface PagerLinkProps {
  to: string
  state: ListState
  topic: GrammarTopic
  direction: 'previous' | 'next'
}

function PagerLink({ to, state, topic, direction }: PagerLinkProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const isNext = direction === 'next'

  return (
    <Link
      to={to}
      state={state}
      className={`group flex flex-col rounded-2xl border border-line-soft bg-surface-raised p-4 transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-primary-400 ${
        isNext ? 'sm:col-start-2 sm:items-end sm:text-right' : ''
      }`}
    >
      <span className="flex items-center gap-1 text-xs font-bold tracking-wide text-muted uppercase">
        {!isNext && <ChevronLeft size={14} aria-hidden="true" />}
        {t(isNext ? 'learn.grammar.next' : 'learn.grammar.previous')}
        {isNext && <ChevronRight size={14} aria-hidden="true" />}
      </span>
      <span className="mt-1 font-semibold transition-colors group-hover:text-accent">{loc(topic.title)}</span>
    </Link>
  )
}

export default GrammarTopicPage
