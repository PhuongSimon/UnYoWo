import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import BunnyMascot from '@/components/BunnyMascot'
import FloatingWords from '@/features/auth/components/FloatingWords'

const LEARNING_LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'JA', name: '日本語' },
  { code: 'KO', name: '한국어' },
]

const CARD_MASCOT_PAGES = ['/login', '/register']

function AuthLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const copyright = t('auth.layout.copyright', { year: new Date().getFullYear() })
  const showCardMascot = CARD_MASCOT_PAGES.includes(pathname)

  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary-950 p-12 text-secondary-100 lg:flex">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary-600/40 blur-3xl" />
        <div className="absolute -right-24 -bottom-40 size-[28rem] rounded-full bg-primary-500/20 blur-3xl" />
        <FloatingWords />

        <Logo tone="light" className="relative text-2xl" />

        <div className="relative flex flex-col gap-6">
          <h2 lang="en" className="text-6xl leading-[1.05] font-extrabold tracking-tight xl:text-7xl">
            <span className="text-primary-400">Un</span>lock
            <br />
            <span className="text-primary-400">Yo</span>ur
            <br />
            <span className="relative inline-block">
              <span className="text-primary-400">Wo</span>rld
              <BunnyMascot interactive={false} size={120} className="absolute bottom-[-0.12em] left-full ml-1" />
            </span>
          </h2>
          <p className="max-w-md text-xl font-semibold text-secondary-200">
            {t('auth.layout.tagline')}
          </p>
          <p className="max-w-md text-secondary-200/70">{t('auth.layout.description')}</p>

          <ul className="flex flex-wrap gap-2">
            {LEARNING_LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                className="flex items-center gap-2 rounded-full border border-primary-800 bg-primary-900/60 px-3 py-1 text-sm text-secondary-100 backdrop-blur"
              >
                <span className="font-semibold text-primary-400">{lang.code}</span>
                {lang.name}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-secondary-200/50">{copyright}</p>
      </aside>

      <main className="flex flex-col px-4 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo className="text-xl lg:invisible" />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center pt-24 pb-10">
          <div className="relative w-full max-w-sm rounded-2xl [view-transition-name:auth-card] border-2 border-line-soft bg-surface p-4 shadow-float sm:max-w-md sm:p-8">
            {showCardMascot && (
              <div className="absolute right-5 -top-[78px]">
                <BunnyMascot size={84} />
              </div>
            )}
            <div className="[view-transition-name:auth-content]">
              <Outlet />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted lg:hidden">{copyright}</p>
      </main>
    </div>
  )
}

export default AuthLayout
