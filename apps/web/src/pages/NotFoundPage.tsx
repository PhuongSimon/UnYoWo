import { ArrowLeft, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import Button from '@/components/ui/Button'

const HOME_PATH = '/login'

const TRANSLATIONS = [
  { text: 'Not found', lang: 'en' },
  { text: 'Nicht gefunden', lang: 'de' },
  { text: '見つかりません', lang: 'ja' },
  { text: '찾을 수 없음', lang: 'ko' },
]

function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate(HOME_PATH)
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-surface px-4 py-6 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/15 blur-3xl sm:size-[40rem]"
      />

      <header className="relative flex items-center justify-between">
        <Logo className="text-xl" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center py-12 text-center">
        <p
          aria-hidden="true"
          className="bg-linear-to-br from-primary-400 via-primary-500 to-primary-700 bg-clip-text text-[7rem] leading-none font-extrabold tracking-tighter text-transparent select-none sm:text-[11rem] dark:from-primary-300 dark:via-primary-400 dark:to-primary-600"
        >
          404
        </p>

        <ul aria-hidden="true" className="mt-4 flex max-w-md flex-wrap justify-center gap-2">
          {TRANSLATIONS.map((item, index) => (
            <li
              key={item.lang}
              lang={item.lang}
              style={{ animationDelay: `${index * 120}ms` }}
              className="rounded-full border border-line-soft bg-surface-raised px-3 py-1 text-xs font-semibold text-muted motion-safe:animate-fade-in motion-safe:[animation-fill-mode:both]"
            >
              {item.text}
            </li>
          ))}
        </ul>

        <h1 className="mt-8 text-2xl font-bold sm:text-3xl">{t('notFound.title')}</h1>
        <p className="mt-3 max-w-md text-muted">{t('notFound.description')}</p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Button onClick={() => navigate(HOME_PATH)} className="w-full sm:w-auto">
            <Home size={18} />
            {t('notFound.home')}
          </Button>
          <Button variant="outline" onClick={goBack} className="w-full sm:w-auto">
            <ArrowLeft size={18} />
            {t('notFound.back')}
          </Button>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage
