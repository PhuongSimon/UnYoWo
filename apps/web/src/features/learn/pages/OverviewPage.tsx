import { ArrowRight, AudioLines, BookOpen, PenLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import RichText from '../components/RichText'
import TipList from '../components/TipList'
import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'

function OverviewPage() {
  const { t } = useTranslation()
  const { language, content } = useStudy()
  const loc = useLocalized()

  const glyphCount = content.writing.charts.reduce(
    (total, chart) => total + (chart.glyphs?.length ?? 0) + (chart.rows?.reduce((sum, row) => sum + row.cells.filter(Boolean).length, 0) ?? 0),
    0,
  )
  const soundCount = content.pronunciation.groups.reduce((total, group) => total + group.sounds.length, 0)

  const sections = [
    {
      to: 'writing',
      Icon: PenLine,
      title: loc(language.writingLabel),
      description: t('learn.overview.writingDescription'),
      stat: t('learn.overview.charStat', { count: glyphCount }),
    },
    {
      to: 'pronunciation',
      Icon: AudioLines,
      title: t('learn.tabs.pronunciation'),
      description: t('learn.overview.pronunciationDescription'),
      stat: `${t('learn.overview.soundStat', { count: soundCount })} · ${t('learn.overview.ruleStat', { count: content.pronunciation.rules.length })}`,
    },
    {
      to: 'grammar',
      Icon: BookOpen,
      title: t('learn.tabs.grammar'),
      description: t('learn.overview.grammarDescription'),
      stat: `${t('learn.grammar.lessonCount', { count: content.grammar.length })} · ${language.levelLabels.A1}–${language.levelLabels.A2}`,
    },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      <div className="space-y-8">
        <section aria-labelledby="overview-about" className="rounded-3xl border-2 border-line-soft bg-surface-raised p-5 shadow-float sm:p-7">
          <h2 id="overview-about" className="text-xl font-bold">
            {t('learn.overview.about')}
          </h2>
          <p className="mt-3 leading-relaxed text-fg/90">
            <RichText text={loc(content.overview)} />
          </p>
        </section>

        <section aria-labelledby="overview-start">
          <h2 id="overview-start" className="text-xl font-bold">
            {t('learn.overview.start')}
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {sections.map(({ to, Icon, title, description, stat }, index) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex h-full flex-col rounded-2xl border border-line-soft bg-surface-raised p-5 transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand/15 text-sm font-extrabold text-accent">{index + 1}</span>
                    <Icon size={20} className="text-accent" aria-hidden="true" />
                  </span>
                  <span className="mt-4 block text-lg font-bold group-hover:text-accent">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{description}</span>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs font-semibold text-label">
                    {stat}
                    <ArrowRight size={16} className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="lg:sticky lg:top-36 lg:self-start">
        <TipList title={t('learn.overview.tips')} tips={content.tips} />
      </div>
    </div>
  )
}

export default OverviewPage
