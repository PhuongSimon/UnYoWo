import { useTranslation } from 'react-i18next'
import AnswerFeedback from '../components/AnswerFeedback'
import OptionGrid from '../components/OptionGrid'
import PromptCard from '../components/PromptCard'
import RequestError from '../components/RequestError'
import { useHotkeys } from '../hooks/useHotkeys'
import type { ChoiceQuestion } from '../types'
import type { GameScreenProps } from './registry'

function MultipleChoiceGame(props: GameScreenProps) {
  const question = props.state.session.questions[props.state.index]
  return question.kind === 'FLASHCARD' || question.kind === 'BUILD' || question.options === null ? null : (
    <ChoiceRound {...props} question={question} />
  )
}

function ChoiceRound({ state, game, studyLang, speechLang, question }: GameScreenProps & { question: ChoiceQuestion }) {
  const { t } = useTranslation()
  const pendingId = state.status === 'answering' && 'optionId' in state.answer ? state.answer.optionId : null
  const isLast = state.session.questions.every((q, i) => i <= state.index || q.result)

  useHotkeys(
    state.status === 'playing'
      ? Object.fromEntries(question.options.map((option, index) => [String(index + 1), () => game.answer({ optionId: option.id })]))
      : { Enter: game.next },
    state.status !== 'answering',
  )

  return (
    <>
      <PromptCard question={question} studyLang={studyLang} speechLang={speechLang} />
      <OptionGrid
        question={question}
        studyLang={studyLang}
        pendingId={pendingId}
        disabled={state.status !== 'playing'}
        onSelect={(optionId) => game.answer({ optionId })}
      />

      {state.status === 'answering' && state.failed && <RequestError message={t('practice.sendFailed')} onRetry={game.retry} />}

      {state.status === 'answered' && question.result && question.reveal && (
        <AnswerFeedback
          isCorrect={question.result.isCorrect}
          reveal={question.reveal}
          studyLang={studyLang}
          speechLang={speechLang}
          isLast={isLast}
          xpGained={state.xpGained}
          onNext={game.next}
        />
      )}
    </>
  )
}

export default MultipleChoiceGame
