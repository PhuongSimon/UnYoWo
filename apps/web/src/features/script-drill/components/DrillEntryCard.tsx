import { ArrowRight, Keyboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { StudyLanguageCode } from '@/features/learn/types'
import { drillScriptsFor } from '../scripts'

/** The way into the romanisation drill, for languages with their own script (Japanese, Korean). */
function DrillEntryCard({ language }: { language: StudyLanguageCode }) {
  const { t } = useTranslation()
  const scripts = drillScriptsFor(language)
  if (scripts.length === 0) return null

  return (
    <section
      aria-labelledby="drill-entry"
      className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface-raised p-5 shadow-sm sm:flex-row sm:items-center"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-accent">
        <Keyboard size={24} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id="drill-entry" className="text-lg font-bold">
          {t('drill.entry.title')}
        </h2>
        <p className="text-muted">{t(`drill.entry.description.${language}`)}</p>
      </div>
      <Link
        to={`/app/${language}/practice/script`}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-b-4 border-line-soft bg-surface-raised px-6 py-3 text-sm font-bold transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-primary-400 sm:w-auto"
      >
        {t('drill.entry.open')}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  )
}

export default DrillEntryCard
