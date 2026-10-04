import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, ScrollRestoration } from 'react-router'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import UserMenu from '@/components/UserMenu'
import { useTimezoneSync } from '@/features/auth/hooks/useTimezoneSync'
import { useLocalized } from '@/features/learn/hooks/useLocalized'
import { STUDY_LANGUAGES } from '@/features/learn/languages'

function AppLayout() {
  const { t } = useTranslation()
  const loc = useLocalized()
  useTimezoneSync()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line-soft bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Logo className="text-xl" />

          <nav aria-label={t('learn.languagesNav')} className="ml-4 hidden md:block">
            <ul className="flex items-center gap-1">
              {STUDY_LANGUAGES.map((language) => (
                <li key={language.code}>
                  <NavLink
                    to={`/app/${language.code}`}
                    title={loc(language.name)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 ${
                        isActive ? 'bg-primary-500/15 text-accent' : 'text-muted hover:bg-surface-raised hover:text-fg'
                      }`
                    }
                  >
                    <language.Flag className="h-3.5 w-5 rounded-[2px] shadow-sm" />
                    <span className="hidden lg:inline">{loc(language.name)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-line-soft px-4 py-6 text-center text-xs text-muted">
        {t('auth.layout.copyright', { year: new Date().getFullYear() })}
      </footer>

      {/* The first page loaded in a tab always has the key "default"; keying it by path stops a fresh load
          from inheriting the scroll position of a different page. */}
      <ScrollRestoration getKey={(location) => (location.key === 'default' ? location.pathname : location.key)} />
    </div>
  )
}

export default AppLayout
