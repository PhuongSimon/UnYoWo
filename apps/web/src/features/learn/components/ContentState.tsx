import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import BunnyMascot from '@/components/BunnyMascot'
import Button from '@/components/ui/Button'
import DotsLoader from '@/components/ui/DotsLoader'

export function LoadingState() {
  const { t } = useTranslation()

  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-24 text-muted">
      <DotsLoader />
      <p className="text-sm">{t('learn.loading')}</p>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation()

  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <BunnyMascot size={96} interactive={false} />
      <p className="text-muted">{t('learn.loadError')}</p>
      <Button onClick={onRetry}>
        <RotateCcw size={18} />
        {t('learn.retry')}
      </Button>
    </div>
  )
}

interface NotFoundStateProps {
  title?: string
  backTo?: string
  backLabel?: string
}

export function NotFoundState({ title, backTo = '/app', backLabel }: NotFoundStateProps) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
      <BunnyMascot size={110} interactive={false} />
      <h2 className="text-xl font-bold">{title ?? t('learn.notFound.title')}</h2>
      <p className="text-muted">{t('learn.notFound.description')}</p>
      <Link
        to={backTo}
        className="mt-2 inline-flex items-center gap-2 rounded-xl border border-line-soft bg-surface-raised px-5 py-2.5 text-sm font-bold transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-primary-400"
      >
        <ArrowLeft size={18} />
        {backLabel ?? t('learn.notFound.back')}
      </Link>
    </div>
  )
}
