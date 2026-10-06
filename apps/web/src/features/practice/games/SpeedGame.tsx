import { useTranslation } from 'react-i18next'
import OptionGrid from '../components/OptionGrid'
import PromptCard from '../components/PromptCard'
import RequestError from '../components/RequestError'
import { useHotkeys } from '../hooks/useHotkeys'
import type { ChoiceQuestion } from '../types'
import type { GameScreenProps } from './registry'

function SpeedGame(props: GameScreenProps) {
  const question = props.state.session.questions[props.state.index]
  return question.kind === 'FLASHCARD' || question.kind === 'BUILD' || question.options === null ? null : (
    <SpeedRound {...props} question={question} />
  )
}

/** Answers move straight on; the card flashes green or red for the previous answer instead of stopping. */
function SpeedRound({ state, game, studyLang, speechLang, question }: GameScreenProps & { question: ChoiceQuestion }) {
  const { t } = useTranslation()
  const pendingId = state.status === 'answering' && 'optionId' in state.answer ? state.answer.optionId : null
  const flash = state.status === 'playing' ? state.flash : null

  useHotkeys(
    Object.fromEntries(question.options.map((option, index) => [String(index + 1), () => game.answer({ optionId: option.id })])),
    state.status === 'playing',
  )

  return (
    <>
      <div
        key={question.id}
        className={`rounded-3xl ring-4 ring-transparent transition-shadow ${
          flash ? (flash.isCorrect ? 'motion-safe:animate-flash-good' : 'motion-safe:animate-flash-bad') : ''
        }`}
      >
        <PromptCard question={question} studyLang={studyLang} speechLang={speechLang} />
      </div>
      <p role="status" className="sr-only">
        {flash ? t(flash.isCorrect ? 'practice.correct' : 'practice.incorrect') : ''}
      </p>
      <OptionGrid
        question={question}
        studyLang={studyLang}
        pendingId={pendingId}
        disabled={state.status !== 'playing'}
        onSelect={(optionId) => game.answer({ optionId })}
      />
      {state.status === 'answering' && state.failed && <RequestError message={t('practice.sendFailed')} onRetry={game.retry} />}
    </>
  )
}

export default SpeedGame
