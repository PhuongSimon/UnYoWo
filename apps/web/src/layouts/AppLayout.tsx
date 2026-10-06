import { Languages, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, ScrollRestoration, useMatches } from 'react-router'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import UserMenu from '@/components/UserMenu'
import { useTimezoneSync } from '@/features/auth/hooks/useTimezoneSync'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import { STUDY_LANGUAGES } from '@/features/learn/languages'
import ProgressBadges from '@/features/progress/components/ProgressBadges'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 ${
    isActive ? 'bg-primary-500/15 text-accent' : 'text-muted hover:bg-surface-raised hover:text-fg'
  }`

const fitsViewport = (handle: unknown) =>
  typeof handle === 'object' && handle !== null && 'fitViewport' in handle && handle.fitViewport === true

function AppLayout() {
  const { t } = useTranslation()
  const loc = useLocalized()
  useTimezoneSync()
  // The dashboard fills exactly one screen on tablets and desktops instead of scrolling.
  const fit = useMatches().some((match) => fitsViewport(match.handle))

  return (
    <div className={`flex min-h-dvh flex-col ${fit ? 'fit:h-dvh fit:overflow-hidden' : ''}`}>
      <header className="sticky top-0 z-40 shrink-0 border-b border-line-soft bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-app items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Logo className="text-xl" />

          <nav aria-label={t('learn.languagesNav')} className="ml-4 hidden md:block">
            <ul className="flex items-center gap-1">
              {STUDY_LANGUAGES.map((language) => (
                <li key={language.code}>
                  <NavLink to={`/app/${language.code}`} title={loc(language.name)} className={navClass}>
                    <language.Flag className="h-3.5 w-5 rounded-[2px] shadow-sm" />
                    <span className="hidden whitespace-nowrap xl:inline">{loc(language.name)}</span>
                  </NavLink>
                </li>
              ))}
              <li className="ml-1 border-l border-line-soft pl-2">
                <NavLink to="/app/review" title={t('review.title')} className={navClass}>
                  <RotateCcw size={16} aria-hidden="true" />
                  <span className="hidden whitespace-nowrap xl:inline">{t('review.title')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/app/translate" title={t('translate.title')} className={navClass}>
                  <Languages size={16} aria-hidden="true" />
                  <span className="hidden whitespace-nowrap xl:inline">{t('translate.title')}</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ProgressBadges />
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="shrink-0 border-t border-line-soft px-4 py-3 text-center text-xs text-muted">
        {t('auth.layout.copyright', { year: new Date().getFullYear() })}
      </footer>

      {/* The first page loaded in a tab always has the key "default"; keying it by path stops a fresh load
          from inheriting the scroll position of a different page. */}
      <ScrollRestoration getKey={(location) => (location.key === 'default' ? location.pathname : location.key)} />
    </div>
  )
}

export default AppLayout
