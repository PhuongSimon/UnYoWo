import type { QuestionKind } from '../../../generated/prisma/enums.js';
import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { QuestionReveal, UiLocale } from '../entities/game-session.entity.js';

type Field = 'TEXT' | 'ROMANIZATION' | 'MEANING' | 'EMOJI';

export type ChoiceKind = Exclude<QuestionKind, 'FLASHCARD'>;

/** Each multiple-choice kind shows one field of the item and asks for another. */
export const CHOICE_FIELDS: Record<ChoiceKind, { prompt: Field; answer: Field }> = {
  TEXT_TO_ROMANIZATION: { prompt: 'TEXT', answer: 'ROMANIZATION' },
  ROMANIZATION_TO_TEXT: { prompt: 'ROMANIZATION', answer: 'TEXT' },
  TEXT_TO_MEANING: { prompt: 'TEXT', answer: 'MEANING' },
  MEANING_TO_TEXT: { prompt: 'MEANING', answer: 'TEXT' },
  EMOJI_TO_TEXT: { prompt: 'EMOJI', answer: 'TEXT' },
};

export function fieldValue(item: PracticeItem, field: Field, locale: UiLocale): string | null {
  switch (field) {
    case 'TEXT':
      return item.text;
    case 'ROMANIZATION':
      return item.romanization;
    case 'MEANING':
      return item.meaning?.[locale] ?? null;
    case 'EMOJI':
      return item.emoji;
  }
}

/** The multiple-choice questions that make sense for an item. */
export function choiceKindsFor(item: PracticeItem, locale: UiLocale): ChoiceKind[] {
  if (item.type !== 'WORD') return item.romanization ? ['TEXT_TO_ROMANIZATION', 'ROMANIZATION_TO_TEXT'] : [];
  // "What does 'apple' mean?" is pointless when the UI is in English too: show the picture instead.
  if (item.languageCode === locale) return item.emoji ? ['EMOJI_TO_TEXT'] : [];
  return item.meaning ? ['TEXT_TO_MEANING', 'MEANING_TO_TEXT'] : [];
}

/** Typing needs an answer the user can type on any keyboard (or in the study language's own script). */
export function typingKindsFor(item: PracticeItem, locale: UiLocale): ChoiceKind[] {
  if (item.type !== 'WORD') return item.romanization ? ['TEXT_TO_ROMANIZATION'] : [];
  if (item.languageCode === locale) return item.emoji ? ['EMOJI_TO_TEXT'] : [];
  return item.meaning ? ['MEANING_TO_TEXT'] : [];
}

export function revealFor(item: PracticeItem, locale: UiLocale): QuestionReveal {
  return {
    text: item.text,
    reading: item.reading,
    romanization: item.romanization,
    meaning: item.meaning?.[locale] ?? null,
    emoji: item.emoji,
  };
}
