import { ArrowLeft, TimerOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import { useStartGame } from '../hooks/useStartGame'
import { practiceHome } from '../paths'
import type { GameSession, SessionSummary } from '../types'
import GameResult from './GameResult'

/** Results of a finished session (summary given) or the expired screen; both offer another round. */
function GameEnd({ session, summary }: { session: GameSession; summary: SessionSummary | null }) {
  const { t } = useTranslation()
  const start = useStartGame({ replace: true })
  const backTo = practiceHome(session)
  const playAgain = () =>
    start.mutate({ gameType: session.gameType, language: session.language, source: session.source, setId: session.setId ?? undefined })

  if (summary) {
    return <GameResult gameType={session.gameType} summary={summary} backTo={backTo} starting={start.isPending} onPlayAgain={playAgain} />
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
      <TimerOff size={40} aria-hidden="true" className="text-accent" />
      <h1 className="text-xl font-bold">{t('practice.expired.title')}</h1>
      <p className="text-muted">{t('practice.expired.description')}</p>
      <Button onClick={playAgain} loading={start.isPending} className="mt-2">
        {t('practice.result.playAgain')}
      </Button>
      <Link to={backTo} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft size={16} aria-hidden="true" />
        {t('practice.result.back')}
      </Link>
    </div>
  )
}

export default GameEnd
