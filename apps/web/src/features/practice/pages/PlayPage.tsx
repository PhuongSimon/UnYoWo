import { useQuery } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import DotsLoader from '@/components/ui/DotsLoader'
import { ErrorState, LoadingState, NotFoundState } from '@/features/learn/components/ContentState'
import { findStudyLanguage } from '@/features/learn/languages'
import { getApiError } from '@/lib/api-error'
import GameEnd from '../components/GameEnd'
import GameShell from '../components/GameShell'
import RequestError from '../components/RequestError'
import { useGameSession } from '../engine/useGameSession'
import { useMatchingBoard } from '../engine/useMatchingBoard'
import MatchingGame from '../games/MatchingGame'
import { SEQUENTIAL_SCREENS, type SequentialGameType } from '../games/registry'
import { practiceHome } from '../paths'
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
  const { gameType } = data
  return gameType === 'MATCHING' ? (
    <MatchingRunner key={data.id} initialSession={data} />
  ) : (
    <SequentialRunner key={data.id} initialSession={data} gameType={gameType} />
  )
}

const speechLangOf = (session: GameSession) => findStudyLanguage(session.language)?.speechLang ?? session.language

/** keep-all stops Korean words from breaking mid-word. */
function LanguageFrame({ session, children }: { session: GameSession; children: ReactNode }) {
  return <div className={`flex flex-1 flex-col ${session.language === 'ko' ? 'break-keep' : ''}`}>{children}</div>
}

function Completing({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  const { t } = useTranslation()
  if (failed) return <RequestError message={t('practice.completeFailed')} onRetry={onRetry} />
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-muted">
      <DotsLoader />
      <p className="text-sm">{t('practice.completing')}</p>
    </div>
  )
}

const answeredCount = (session: GameSession) => session.questions.filter((question) => question.result).length

function SequentialRunner({ initialSession, gameType }: { initialSession: GameSession; gameType: SequentialGameType }) {
  const { t } = useTranslation()
  const game = useGameSession(initialSession)
  const { state } = game
  const { Screen, hintKey } = SEQUENTIAL_SCREENS[gameType]

  if (state.status === 'completed') return <GameEnd session={state.session} summary={state.summary} />
  if (state.status === 'expired') return <GameEnd session={state.session} summary={null} />

  const { session } = state
  return (
    <LanguageFrame session={session}>
      <GameShell
        answered={answeredCount(session)}
        total={session.questions.length}
        combo={state.combo}
        backTo={practiceHome(session)}
        hint={t(hintKey)}
      >
        {state.status === 'completing' ? (
          <Completing failed={state.failed} onRetry={game.retry} />
        ) : (
          <Screen state={state} game={game} studyLang={session.language} speechLang={speechLangOf(session)} />
        )}
      </GameShell>
    </LanguageFrame>
  )
}

function MatchingRunner({ initialSession }: { initialSession: GameSession }) {
  const { t } = useTranslation()
  const board = useMatchingBoard(initialSession)
  const { state } = board

  if (state.status === 'completed') return <GameEnd session={state.session} summary={state.summary} />
  if (state.status === 'expired') return <GameEnd session={state.session} summary={null} />

  const { session } = state
  return (
    <LanguageFrame session={session}>
      <GameShell
        answered={answeredCount(session)}
        total={session.questions.length}
        combo={state.combo}
        backTo={practiceHome(session)}
        hint={t('practice.hint.MATCHING')}
        extra={
          state.mistakes > 0 && (
            <span
              aria-label={t('practice.matching.mistakes', { count: state.mistakes })}
              className="flex shrink-0 items-center gap-0.5 text-sm font-bold text-red-700 tabular-nums dark:text-red-300"
            >
              <CircleX size={16} aria-hidden="true" />
              {state.mistakes}
            </span>
          )
        }
      >
        {state.status === 'completing' ? (
          <Completing failed={state.failed} onRetry={board.retry} />
        ) : (
          <MatchingGame state={state} studyLang={session.language} onPick={board.pick} onRetry={board.retry} />
        )}
      </GameShell>
    </LanguageFrame>
  )
}

export default PlayPage
