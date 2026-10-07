import { Play, Zap } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import RequestError from './RequestError'

/** Before a timed round: the clock only starts when the player says so. */
function ReadyScreen({ limitSeconds, onStart }: { limitSeconds: number; onStart: () => Promise<void> }) {
  const { t } = useTranslation()
  const [starting, setStarting] = useState(false)
  const [failed, setFailed] = useState(false)

  const start = () => {
    setStarting(true)
    setFailed(false)
    onStart().catch(() => {
      setFailed(true)
      setStarting(false)
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand/15 text-accent">
        <Zap size={32} aria-hidden="true" />
      </span>
      <h1 className="text-2xl font-extrabold">{t('practice.speed.title')}</h1>
      <p className="max-w-sm text-muted">{t('practice.speed.description', { count: limitSeconds })}</p>
      <Button autoFocus onClick={start} loading={starting} className="mt-2 w-full max-w-xs">
        <Play size={18} aria-hidden="true" />
        {t('practice.speed.start')}
      </Button>
      {failed && <RequestError message={t('practice.sendFailed')} onRetry={start} />}
    </div>
  )
}

export default ReadyScreen
