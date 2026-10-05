import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiLanguage } from '@/features/learn/hooks/useLocalized'
import { fieldLang, PROMPT_FIELD } from '../games/question-fields'
import type { Question } from '../types'

interface PromptCardProps {
  question: Question
  studyLang: string
  children?: ReactNode
}

function promptSize(field: string, prompt: string) {
  if (field === 'emoji') return 'text-7xl sm:text-8xl'
  if (field === 'meaning') return 'text-2xl font-bold sm:text-3xl'
  // A single kana or Hangul block reads best really big; words a bit smaller.
  return [...prompt].length <= 2 ? 'text-7xl font-bold sm:text-8xl' : 'text-4xl font-bold sm:text-5xl'
}

function PromptCard({ question, studyLang, children }: PromptCardProps) {
  const { t } = useTranslation()
  const uiLang = useUiLanguage()
  const headingId = useId()
  const field = PROMPT_FIELD[question.kind]

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-3xl border border-line-soft bg-surface-raised px-4 py-7 text-center shadow-sm sm:px-8 sm:py-10"
    >
      <h2 id={headingId} className="text-sm font-semibold text-muted">
        {t(`practice.prompt.${question.kind}`)}
      </h2>
      <p lang={fieldLang(field, studyLang, uiLang)} className={`mt-3 leading-tight break-words ${promptSize(field, question.prompt)}`}>
        {question.prompt}
      </p>
      {children}
    </section>
  )
}

export default PromptCard
