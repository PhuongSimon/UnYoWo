import { ArrowRight, AudioLines, BookOpen, PenLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { queryClient } from '@/lib/query-client'
import { useLocalized } from '../hooks/useLocalized'
import { studyContentQuery } from '../queries'
import type { StudyLanguage } from '../types'
import SpeakButton from './SpeakButton'

interface LanguageCardProps {
  language: StudyLanguage
}

function LanguageCard({ language }: LanguageCardProps) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const basePath = `/app/${language.code}`

  // Start downloading the lessons as soon as the user shows interest, so the next page opens instantly.
  const prefetch = () => void queryClient.prefetchQuery(studyContentQuery(language))

  const name = loc(language.name)
  const sections = [
    { to: `${basePath}/writing`, Icon: PenLine, label: loc(language.writingLabel) },
    { to: `${basePath}/pronunciation`, Icon: AudioLines, label: t('learn.tabs.pronunciation') },
    { to: `${basePath}/grammar`, Icon: BookOpen, label: t('learn.tabs.grammar'), hint: `${language.levelLabels.A1}–${language.levelLabels.A2}` },
  ]

  return (
    <article
      onPointerEnter={prefetch}
      onFocus={prefetch}
      className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-line-soft bg-surface-raised p-5 shadow-float transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:p-6"
    >
      <span
        aria-hidden="true"
        lang={language.code}
        className="pointer-events-none absolute -top-4 -right-1 text-[7.5rem] leading-none font-black text-primary-500/10 select-none sm:text-[9rem] dark:text-primary-400/10"
      >
        {language.glyph}
      </span>

      <header className="relative flex items-center gap-3">
        <language.Flag className="h-8 w-12 shrink-0 rounded-md shadow-sm" />
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold">{name}</h3>
          {language.nativeName !== name && (
            <p lang={language.code} className="text-sm text-muted">
              {language.nativeName}
            </p>
          )}
        </div>
      </header>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p lang={language.code} className="text-2xl font-bold text-accent">
          {language.greeting}
        </p>
        {language.greetingRoman && <span className="text-sm text-muted italic">{language.greetingRoman}</span>}
        <SpeakButton text={language.greeting} lang={language.speechLang} />
      </div>

      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">{loc(language.tagline)}</p>

      <ul className="relative mt-5 grid grid-cols-3 gap-2">
        {sections.map(({ to, Icon, label, hint }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex h-full flex-col items-center gap-1 rounded-xl border border-line-soft bg-surface px-1.5 py-3 text-center text-xs font-semibold text-label transition-colors hover:border-primary-400 hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400 sm:text-sm"
            >
              <Icon size={20} className="mb-0.5 text-accent" aria-hidden="true" />
              {label}
              {hint && <span className="text-[11px] font-medium text-muted sm:text-xs">{hint}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to={basePath}
        className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-xl border-b-4 border-primary-700 bg-primary-500 px-5 py-3 text-sm font-bold tracking-wide text-primary-950 shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 active:translate-y-0.5 active:border-b-2"
      >
        {t('home.start')}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  )
}

export default LanguageCard
