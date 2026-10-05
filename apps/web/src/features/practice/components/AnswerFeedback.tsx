import { ArrowRight, CircleCheck, CircleX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import type { QuestionReveal } from '../types'
import RevealDetails from './RevealDetails'

interface AnswerFeedbackProps {
  isCorrect: boolean
  reveal: QuestionReveal
  studyLang: string
  speechLang: string
  isLast: boolean
  onNext: () => void
}

function AnswerFeedback({ isCorrect, reveal, studyLang, speechLang, isLast, onNext }: AnswerFeedbackProps) {
  const { t } = useTranslation()
  const Icon = isCorrect ? CircleCheck : CircleX

  return (
    <div
      role="status"
      className={`mt-5 rounded-2xl border-2 p-4 motion-safe:animate-fade-in sm:p-5 ${
        isCorrect
          ? 'border-emerald-600/50 bg-emerald-50 dark:bg-emerald-950/40'
          : 'border-red-600/50 bg-red-50 dark:bg-red-950/40'
      }`}
    >
      <p
        className={`flex items-center gap-2 text-lg font-extrabold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}
      >
        <Icon size={24} aria-hidden="true" />
        {t(isCorrect ? 'practice.correct' : 'practice.incorrect')}
      </p>
      <div className="mt-3">
        <RevealDetails reveal={reveal} studyLang={studyLang} speechLang={speechLang} />
      </div>
      {/* Focus moves here so Enter (or a tap) continues; the result above is announced first. */}
      <Button autoFocus onClick={onNext} className="mt-4 w-full sm:w-auto">
        {t(isLast ? 'practice.finish' : 'practice.next')}
        <ArrowRight size={18} aria-hidden="true" />
      </Button>
    </div>
  )
}

export default AnswerFeedback
