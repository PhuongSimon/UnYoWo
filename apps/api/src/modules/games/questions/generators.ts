import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { GeneratedQuestion, UiLocale } from '../entities/game-session.entity.js';
import { shuffle, type Random } from '../random.js';
import { pickDistractors } from './distractors.js';
import { CHOICE_FIELDS, choiceKindsFor, fieldValue, revealFor } from './fields.js';

export interface GeneratorContext {
  /** Items the wrong options may come from */
  pool: PracticeItem[];
  locale: UiLocale;
  random: Random;
}

/** Builds a question about one item, or null when the item cannot be asked this way. */
export type QuestionGenerator = (item: PracticeItem, context: GeneratorContext) => GeneratedQuestion | null;

const OPTION_COUNT = 4;

export const generateFlashcard: QuestionGenerator = (item, { locale }) => ({
  itemId: item.id,
  kind: 'FLASHCARD',
  prompt: item.text,
  options: null,
  correctOptionId: null,
  reveal: revealFor(item, locale),
});

export const generateMultipleChoice: QuestionGenerator = (item, { pool, locale, random }) => {
  for (const kind of shuffle(choiceKindsFor(item, locale), random)) {
    const { prompt, answer } = CHOICE_FIELDS[kind];
    const promptText = fieldValue(item, prompt, locale);
    if (!promptText) continue;

    const distractors = pickDistractors(item, pool, kind, locale, OPTION_COUNT - 1, random);
    if (distractors.length === 0) continue;

    const ordered = shuffle([item, ...distractors], random);
    return {
      itemId: item.id,
      kind,
      prompt: promptText,
      options: ordered.map((option, index) => ({
        id: String(index + 1),
        text: fieldValue(option, answer, locale) ?? '',
        itemId: option.id,
      })),
      correctOptionId: String(ordered.indexOf(item) + 1),
      reveal: revealFor(item, locale),
    };
  }
  return null;
};
