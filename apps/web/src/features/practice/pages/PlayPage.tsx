import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TimerOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import DotsLoader from '@/components/ui/DotsLoader'
import { ErrorState, LoadingState, NotFoundState } from '@/features/learn/components/ContentState'
import { findStudyLanguage } from '@/features/learn/languages'
import { getApiError } from '@/lib/api-error'
import GameResult from '../components/GameResult'
import GameShell from '../components/GameShell'
import RequestError from '../components/RequestError'
import { useGameSession } from '../engine/useGameSession'
import { GAME_SCREENS } from '../games/registry'
import { useStartGame } from '../hooks/useStartGame'
import { gameSessionQuery } from '../queries'
import type { GameSession } from '../types'

function PlayPage() {
  const { t } = useTranslation()
  const { sessionId = '' } = useParams()
  const { data, isPending, isError, error, refetch } = useQuery(gameSessionQuery(sessionId))

  if (isPending) return <LoadingState label={t('practice.loading')} />
  if (isError) {
    return getApiError(error).code === 'GAME_SESSION_NOT_FOUND' ? <NotFoundState /> : <ErrorState onRetry={() => void refetch()} />
  }
  // Keyed by id so "play again" starts from a fresh state machine.
  return <GameRunner key={data.id} initialSession={data} />
}

function GameRunner({ initialSession }: { initialSession: GameSession }) {
  const { t } = useTranslation()
  const game = useGameSession(initialSession)
  const start = useStartGame({ replace: true })
  const { state } = game
  const { session } = state

  const studyLang = session.language
  const speechLang = findStudyLanguage(session.language)?.speechLang ?? session.language
  const backTo = `/app/${session.language}/practice`
  const playAgain = () =>
    start.mutate({ gameType: session.gameType, language: session.language, source: session.source, setId: session.setId ?? undefined })

  if (state.status === 'completed') {
    return <GameResult summary={state.summary} backTo={backTo} starting={start.isPending} onPlayAgain={playAgain} />
  }

  if (state.status === 'expired') {
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

  const { Screen, hintKey } = GAME_SCREENS[session.gameType]

  return (
    // keep-all stops Korean words from breaking mid-word.
    <div className={`flex flex-1 flex-col ${session.language === 'ko' ? 'break-keep' : ''}`}>
      <GameShell
        answered={session.questions.filter((question) => question.result).length}
        total={session.questions.length}
        combo={state.combo}
        backTo={backTo}
        hint={t(hintKey)}
      >
        {state.status === 'completing' ? (
          state.failed ? (
            <RequestError message={t('practice.completeFailed')} onRetry={game.retry} />
          ) : (
            <div role="status" className="flex flex-col items-center gap-3 py-16 text-muted">
              <DotsLoader />
              <p className="text-sm">{t('practice.completing')}</p>
            </div>
          )
        ) : (
          <Screen state={state} game={game} studyLang={studyLang} speechLang={speechLang} />
        )}
      </GameShell>
    </div>
  )
}

export default PlayPage
