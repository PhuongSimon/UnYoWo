import type { QuestionKind } from '../../../generated/prisma/enums.js';
import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { QuestionReveal, UiLocale } from '../entities/game-session.entity.js';

/** AUDIO is what the item sounds like: compared by romanization, so じ and ぢ ("ji") count as the same sound. */
type Field = 'TEXT' | 'ROMANIZATION' | 'MEANING' | 'EMOJI' | 'AUDIO';

/** Question kinds answered by picking (or typing) one value; flashcards and the builder work differently. */
export type ChoiceKind = Exclude<QuestionKind, 'FLASHCARD' | 'BUILD'>;

/** Each multiple-choice kind shows one field of the item and asks for another. */
export const CHOICE_FIELDS: Record<ChoiceKind, { prompt: Field; answer: Field }> = {
  TEXT_TO_ROMANIZATION: { prompt: 'TEXT', answer: 'ROMANIZATION' },
  ROMANIZATION_TO_TEXT: { prompt: 'ROMANIZATION', answer: 'TEXT' },
  TEXT_TO_MEANING: { prompt: 'TEXT', answer: 'MEANING' },
  MEANING_TO_TEXT: { prompt: 'MEANING', answer: 'TEXT' },
  EMOJI_TO_TEXT: { prompt: 'EMOJI', answer: 'TEXT' },
  AUDIO_TO_TEXT: { prompt: 'AUDIO', answer: 'TEXT' },
  AUDIO_TO_MEANING: { prompt: 'AUDIO', answer: 'MEANING' },
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
    case 'AUDIO':
      return item.romanization ?? item.text;
  }
}

/** What speech synthesis should say for the item: Korean jamo carry a spoken form (ㄱ → 기역). */
export const spokenText = (item: PracticeItem) => item.attributes?.speak ?? item.text;

/** The prompt sent to the client. For listening it is the text to speak, never shown on screen. */
export function promptFor(item: PracticeItem, kind: ChoiceKind, locale: UiLocale): string | null {
  return CHOICE_FIELDS[kind].prompt === 'AUDIO' ? spokenText(item) : fieldValue(item, CHOICE_FIELDS[kind].prompt, locale);
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

/** Hear it, then pick the character, or the meaning of a foreign word. */
export function listeningKindsFor(item: PracticeItem, locale: UiLocale): ChoiceKind[] {
  if (item.type !== 'WORD' || item.languageCode === locale) return ['AUDIO_TO_TEXT'];
  return item.meaning ? ['AUDIO_TO_MEANING'] : [];
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
