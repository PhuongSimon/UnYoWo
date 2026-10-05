import type { ChoiceKind, QuestionKind } from '../types'

type Field = 'text' | 'romanization' | 'meaning' | 'emoji'

/** What the prompt of each question kind shows; mirrors the API's question kinds. */
export const PROMPT_FIELD: Record<QuestionKind, Field> = {
  FLASHCARD: 'text',
  TEXT_TO_ROMANIZATION: 'text',
  ROMANIZATION_TO_TEXT: 'romanization',
  TEXT_TO_MEANING: 'text',
  MEANING_TO_TEXT: 'meaning',
  EMOJI_TO_TEXT: 'emoji',
}

export const ANSWER_FIELD: Record<ChoiceKind, Field> = {
  TEXT_TO_ROMANIZATION: 'romanization',
  ROMANIZATION_TO_TEXT: 'text',
  TEXT_TO_MEANING: 'meaning',
  MEANING_TO_TEXT: 'text',
  EMOJI_TO_TEXT: 'text',
}

/** `lang` attribute for a field, so screen readers and fonts treat 例 or 가 correctly. */
export function fieldLang(field: Field, studyLang: string, uiLang: string): string | undefined {
  if (field === 'text') return studyLang
  if (field === 'romanization') return `${studyLang}-Latn`
  if (field === 'meaning') return uiLang
  return undefined
}
