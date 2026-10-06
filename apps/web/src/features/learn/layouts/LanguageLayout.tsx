import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, AudioLines, BookOpen, Compass, Gamepad2, PenLine } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router'
import { ErrorState, LoadingState, NotFoundState } from '../components/ContentState'
import SpeakButton from '../components/SpeakButton'
import { StudyContext } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import { findStudyLanguage } from '../languages'
import { stopSpeaking } from '../lib/speech'
import { studyContentQuery } from '../queries'
import type { StudyLanguage } from '../types'

function LanguageLayout() {
  const { lang } = useParams()
  const language = findStudyLanguage(lang)

  if (!language) return <NotFoundState />

  // The key remounts the shell when switching languages, which also stops any audio still playing.
  return <LanguageShell key={language.code} language={language} />
}

function LanguageShell({ language }: { language: StudyLanguage }) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const { data: content, isPending, isError, refetch } = useQuery(studyContentQuery(language))
  const { pathname } = useLocation()
  const tabListRef = useRef<HTMLUListElement>(null)

  useEffect(() => stopSpeaking, [])

  // On small screens the tab bar scrolls sideways: keep the active tab visible.
  useEffect(() => {
    const list = tabListRef.current
    const activeItem = list?.querySelector('[aria-current="page"]')?.parentElement
    if (!list || !activeItem) return
    list.scrollTo({ left: activeItem.offsetLeft - (list.clientWidth - activeItem.clientWidth) / 2 })
  }, [pathname])

  const studyValue = useMemo(() => (content ? { language, content } : null), [language, content])

  const tabs = [
    { to: '.', end: true, Icon: Compass, label: t('learn.tabs.overview') },
    { to: 'writing', end: false, Icon: PenLine, label: loc(language.writingLabel) },
    { to: 'pronunciation', end: false, Icon: AudioLines, label: t('learn.tabs.pronunciation') },
    { to: 'grammar', end: false, Icon: BookOpen, label: t('learn.tabs.grammar') },
    { to: 'practice', end: false, Icon: Gamepad2, label: t('learn.tabs.practice') },
  ]

  return (
    // keep-all stops Korean words from breaking mid-word; Korean puts spaces between words like English.
    <div className={`flex flex-1 flex-col ${language.code === 'ko' ? 'break-keep wrap-break-word' : ''}`}>
      <section className="border-b border-line-soft bg-surface-raised/50">
        <div className="mx-auto w-full max-w-app px-4 pt-4 pb-5 sm:px-6 sm:pt-6 sm:pb-7 lg:px-8">
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t('learn.allLanguages')}
          </Link>

          <div className="mt-3 flex items-center gap-3 sm:gap-4">
            <language.Flag className="h-9 w-[3.4rem] shrink-0 rounded-md shadow-sm sm:h-11 sm:w-[4.1rem]" />
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {loc(language.name)}{' '}
                <span lang={language.code} className="font-semibold text-muted">
                  · {language.nativeName}
                </span>
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2">
                <span lang={language.code} className="font-semibold text-accent">
                  {language.greeting}
                </span>
                {language.greetingRoman && <span className="text-sm text-muted italic">{language.greetingRoman}</span>}
                <SpeakButton text={language.greeting} lang={language.speechLang} className="size-7" />
              </div>
            </div>
          </div>
          <p className="mt-3 hidden max-w-3xl text-muted sm:block">{loc(language.tagline)}</p>
        </div>
      </section>

      <nav aria-label={t('learn.sectionsNav')} className="sticky top-14 z-30 border-b border-line-soft bg-surface/90 backdrop-blur-md">
        <ul ref={tabListRef} className="relative mx-auto flex w-full max-w-app gap-1 overflow-x-auto px-4 py-2 scrollbar-none sm:px-6 lg:px-8">
          {tabs.map(({ to, end, Icon, label }) => (
            <li key={to} className="shrink-0">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                    isActive ? 'bg-primary-500 text-primary-950 shadow-sm' : 'text-muted hover:bg-surface-raised hover:text-fg'
                  }`
                }
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto w-full max-w-app flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {isPending ? (
          <LoadingState />
        ) : isError || !studyValue ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : (
          <StudyContext value={studyValue}>
            <Outlet />
          </StudyContext>
        )}
      </div>
    </div>
  )
}

export default LanguageLayout
