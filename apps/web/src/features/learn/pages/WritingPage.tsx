import { useTranslation } from 'react-i18next'
import GlyphCard from '../components/GlyphCard'
import GlyphGrid from '../components/GlyphGrid'
import HangulBuilder from '../components/HangulBuilder'
import JumpLinks from '../components/JumpLinks'
import RichText from '../components/RichText'
import TipList from '../components/TipList'
import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import { useScrollToHash } from '../hooks/useScrollToHash'
import type { ScriptChart } from '../types'

function WritingPage() {
  const { t } = useTranslation()
  const { content } = useStudy()
  const loc = useLocalized()
  const { intro, charts } = content.writing
  useScrollToHash()

  return (
    <div className="space-y-10 sm:space-y-12">
      <header className="space-y-4">
        <p className="max-w-3xl leading-relaxed text-fg/90">
          <RichText text={loc(intro)} />
        </p>
        <JumpLinks label={t('learn.jumpTo')} links={charts.map((chart) => ({ id: chart.id, label: loc(chart.title) }))} />
      </header>

      {charts.map((chart) => (
        <ChartSection key={chart.id} chart={chart} />
      ))}
    </div>
  )
}

function ChartSection({ chart }: { chart: ScriptChart }) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const titleId = `${chart.id}-title`

  return (
    <section id={chart.id} aria-labelledby={titleId} className="scroll-mt-32 space-y-4">
      <div>
        <h2 id={titleId} className="text-xl font-bold sm:text-2xl">
          {loc(chart.title)}
        </h2>
        {chart.intro && (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            <RichText text={loc(chart.intro)} />
          </p>
        )}
      </div>

      {chart.kind === 'cards' && chart.glyphs && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {chart.glyphs.map((glyph, index) => (
            <GlyphCard key={`${glyph.char}-${index}`} glyph={glyph} />
          ))}
        </div>
      )}

      {chart.kind === 'grid' && chart.columns && chart.rows && <GlyphGrid columns={chart.columns} rows={chart.rows} />}

      {chart.kind === 'hangul-builder' && <HangulBuilder />}

      {chart.notes && <TipList title={t('learn.writing.notes')} tips={chart.notes} />}
    </section>
  )
}

export default WritingPage
