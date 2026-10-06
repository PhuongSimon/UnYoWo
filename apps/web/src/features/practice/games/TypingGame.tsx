import { ArrowRight, HelpCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import AnswerFeedback from '../components/AnswerFeedback'
import PromptCard from '../components/PromptCard'
import RequestError from '../components/RequestError'
import { useHotkeys } from '../hooks/useHotkeys'
import type { TypedQuestion } from '../types'
import { ANSWER_FIELD, fieldLang } from './question-fields'
import type { GameScreenProps } from './registry'

function TypingGame(props: GameScreenProps) {
  const question = props.state.session.questions[props.state.index]
  // Keyed by question so the input starts empty (and focused) for every new prompt.
  return question.kind !== 'FLASHCARD' && question.kind !== 'BUILD' && question.options === null ? (
    <TypingRound key={question.id} {...props} question={question} />
  ) : null
}

function TypingRound({ state, game, studyLang, speechLang, question }: GameScreenProps & { question: TypedQuestion }) {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState('')
  const playing = state.status === 'playing'
  const answerField = ANSWER_FIELD[question.kind]
  const isLast = state.session.questions.every((q, i) => i <= state.index || q.result)
  const hintKey = `practice.typing.hint.${studyLang}`
  const hint = answerField === 'text' && i18n.exists(hintKey) ? t(hintKey) : null

  useHotkeys({ Enter: game.next }, state.status === 'answered')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (text.trim()) game.answer({ text })
  }

  return (
    <>
      <PromptCard question={question} studyLang={studyLang} instruction={t(`practice.typing.prompt.${question.kind}`)} />

      <form onSubmit={submit} className="mt-5">
        <label htmlFor="typed-answer" className="sr-only">
          {t('practice.typing.label')}
        </label>
        <div className="flex gap-2">
          <input
            id="typed-answer"
            lang={fieldLang(answerField, studyLang, i18n.language)}
            value={state.status === 'answered' ? (question.result?.givenAnswer ?? '') : text}
            onChange={(event) => setText(event.target.value)}
            disabled={!playing}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="done"
            maxLength={100}
            placeholder={t('practice.typing.placeholder')}
            aria-describedby={hint ? 'typed-answer-hint' : undefined}
            className="min-h-14 min-w-0 flex-1 rounded-2xl border-2 border-line-soft bg-surface-raised px-4 text-lg font-semibold transition-colors outline-none placeholder:font-normal placeholder:text-muted focus:border-primary-500 disabled:opacity-70"
          />
          <Button type="submit" disabled={!playing || !text.trim()} loading={state.status === 'answering' && !state.failed} className="shrink-0">
            <ArrowRight size={20} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{t('practice.typing.submit')}</span>
          </Button>
        </div>
        {hint && (
          <p id="typed-answer-hint" className="mt-2 text-sm text-muted">
            {hint}
          </p>
        )}
        {playing && (
          <button
            type="button"
            onClick={() => game.answer({ text: '' })}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-primary-400"
          >
            <HelpCircle size={16} aria-hidden="true" />
            {t('practice.typing.dontKnow')}
          </button>
        )}
      </form>

      {state.status === 'answering' && state.failed && <RequestError message={t('practice.sendFailed')} onRetry={game.retry} />}

      {state.status === 'answered' && question.result && question.reveal && (
        <AnswerFeedback
          isCorrect={question.result.isCorrect}
          reveal={question.reveal}
          studyLang={studyLang}
          speechLang={speechLang}
          isLast={isLast}
          xpGained={state.xpGained}
          yourAnswer={question.result.givenAnswer}
          onNext={game.next}
        />
      )}
    </>
  )
}

export default TypingGame
