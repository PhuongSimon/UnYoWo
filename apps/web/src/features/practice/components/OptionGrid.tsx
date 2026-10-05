import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUiLanguage } from '@/features/learn/hooks/useLocalized'
import { ANSWER_FIELD, fieldLang } from '../games/question-fields'
import type { ChoiceQuestion } from '../types'

interface OptionGridProps {
  question: ChoiceQuestion
  studyLang: string
  /** Option sent to the server and waiting for its verdict */
  pendingId: string | null
  disabled: boolean
  onSelect: (optionId: string) => void
}

type OptionState = 'idle' | 'pending' | 'correct' | 'wrong' | 'dimmed'

const STATE_CLASSES: Record<OptionState, string> = {
  idle: 'border-line-soft bg-surface-raised hover:-translate-y-0.5 hover:border-primary-400 motion-reduce:hover:translate-y-0',
  pending: 'border-primary-500 bg-surface-raised ring-2 ring-primary-300 dark:ring-primary-700',
  correct:
    'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-50',
  wrong: 'border-red-600 bg-red-50 text-red-950 dark:border-red-500 dark:bg-red-950/60 dark:text-red-50',
  dimmed: 'border-line-soft bg-surface-raised opacity-55',
}

function OptionGrid({ question, studyLang, pendingId, disabled, onSelect }: OptionGridProps) {
  const { t } = useTranslation()
  const uiLang = useUiLanguage()
  const result = question.result
  const lang = fieldLang(ANSWER_FIELD[question.kind], studyLang, uiLang)

  const stateOf = (optionId: string): OptionState => {
    if (result) {
      if (optionId === result.correctOptionId) return 'correct'
      return optionId === result.selectedOptionId ? 'wrong' : 'dimmed'
    }
    return optionId === pendingId ? 'pending' : 'idle'
  }

  return (
    <ul className="mt-5 grid grid-cols-2 gap-3">
      {question.options.map((option, index) => {
        const state = stateOf(option.id)
        return (
          <li key={option.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.id)}
              className={`relative flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl border-2 border-b-4 px-3 py-3 text-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-default sm:min-h-20 sm:text-xl ${STATE_CLASSES[state]}`}
            >
              <kbd
                aria-hidden="true"
                className="absolute top-1.5 left-2 hidden font-sans text-[11px] font-bold text-muted sm:block"
              >
                {index + 1}
              </kbd>
              {state === 'correct' && <Check size={20} strokeWidth={3} aria-hidden="true" className="shrink-0" />}
              {state === 'wrong' && <X size={20} strokeWidth={3} aria-hidden="true" className="shrink-0" />}
              <span lang={lang} className="break-words">
                {option.text}
              </span>
              {state === 'correct' && <span className="sr-only">({t('practice.optionCorrect')})</span>}
              {state === 'wrong' && <span className="sr-only">({t('practice.optionYours')})</span>}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default OptionGrid
