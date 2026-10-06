import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import PromptCard from '../components/PromptCard'
import RatingButtons from '../components/RatingButtons'
import RequestError from '../components/RequestError'
import RevealDetails from '../components/RevealDetails'
import { useHotkeys } from '../hooks/useHotkeys'
import { REVIEW_RATINGS, type FlashcardQuestion } from '../types'
import type { GameScreenProps } from './registry'

function FlashcardGame(props: GameScreenProps) {
  const question = props.state.session.questions[props.state.index]
  return question.kind === 'FLASHCARD' ? <Flashcard {...props} question={question} /> : null
}

function Flashcard({ state, game, studyLang, speechLang, question }: GameScreenProps & { question: FlashcardQuestion }) {
  const { t } = useTranslation()
  const playing = state.status === 'playing'
  // While the rating is being saved the back stays visible.
  const revealed = !playing || state.revealed
  const pending = state.status === 'answering' && 'rating' in state.answer ? state.answer.rating : null

  useHotkeys(
    revealed
      ? Object.fromEntries(REVIEW_RATINGS.map((rating, index) => [String(index + 1), () => game.answer({ rating })]))
      : { ' ': game.reveal, Enter: game.reveal },
    playing,
  )

  return (
    <>
      <PromptCard question={question} studyLang={studyLang}>
        {revealed && (
          <div className="mt-6 border-t border-line-soft pt-6 motion-safe:animate-fade-in">
            <RevealDetails reveal={question.reveal} studyLang={studyLang} speechLang={speechLang} centered />
          </div>
        )}
      </PromptCard>

      <div className="mt-5">
        {revealed ? (
          <RatingButtons disabled={!playing} pending={pending} onRate={(rating) => game.answer({ rating })} />
        ) : (
          <Button autoFocus onClick={game.reveal} className="w-full">
            <Eye size={18} aria-hidden="true" />
            {t('practice.showAnswer')}
          </Button>
        )}
      </div>

      {state.status === 'answering' && state.failed && <RequestError message={t('practice.sendFailed')} onRetry={game.retry} />}
    </>
  )
}

export default FlashcardGame
