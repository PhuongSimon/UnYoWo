import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface RequestErrorProps {
  message: string
  onRetry: () => void
}

function RequestError({ message, onRetry }: RequestErrorProps) {
  const { t } = useTranslation()

  return (
    <div
      role="alert"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-600/40 bg-red-50 p-3 text-sm dark:bg-red-950/40"
    >
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-soft bg-surface-raised px-4 font-bold transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent"
      >
        <RotateCcw size={16} aria-hidden="true" />
        {t('practice.retry')}
      </button>
    </div>
  )
}

export default RequestError
