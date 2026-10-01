import { createContext, useContext } from 'react'
import type { StudyContent, StudyLanguage } from './types'

interface StudyContextValue {
  language: StudyLanguage
  content: StudyContent
}

export const StudyContext = createContext<StudyContextValue | null>(null)

export function useStudy() {
  const value = useContext(StudyContext)
  if (!value) throw new Error('useStudy must be used inside LanguageLayout')
  return value
}
