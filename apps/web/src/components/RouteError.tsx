import { House, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteError } from 'react-router'
import BunnyMascot from './BunnyMascot'
import Button from './ui/Button'

/**
 * Last line of defence for a page that crashed or whose code failed to download
 * (e.g. right after a new version was deployed). Reloading fixes both.
 */
function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface px-4 text-center text-fg">
      <BunnyMascot size={110} interactive={false} />
      <h1 className="text-2xl font-extrabold">{t('routeError.title')}</h1>
      <p className="max-w-md text-muted">{t('routeError.description')}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => window.location.reload()}>
          <RotateCcw size={18} aria-hidden="true" />
          {t('routeError.reload')}
        </Button>
        <a
          href="/app"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-b-4 border-line-soft bg-surface-raised px-6 py-3 text-sm font-bold hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent"
        >
          <House size={18} aria-hidden="true" />
          {t('routeError.home')}
        </a>
      </div>
    </main>
  )
}

export default RouteError
