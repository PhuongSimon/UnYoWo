import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { GeneratedQuestion, UiLocale } from '../entities/game-session.entity.js';
import { shuffle, type Random } from '../random.js';
import { pickDistractors } from './distractors.js';
import { CHOICE_FIELDS, choiceKindsFor, fieldValue, revealFor, typingKindsFor, type ChoiceKind } from './fields.js';

export interface GeneratorContext {
  /** Items the wrong options may come from */
  pool: PracticeItem[];
  locale: UiLocale;
  random: Random;
  /** How many questions the game wants */
  count: number;
}

/** Builds a question about one item, or null when the item cannot be asked this way. */
export type ItemQuestionGenerator = (item: PracticeItem, context: GeneratorContext) => GeneratedQuestion | null;

/** Builds all questions of a session at once (a matching board needs to see every pair together). */
export type SessionGenerator = (items: PracticeItem[], context: GeneratorContext) => GeneratedQuestion[];

const OPTION_COUNT = 4;

/** One question per item, skipping items the generator cannot use. */
export function eachItem(generate: ItemQuestionGenerator): SessionGenerator {
  return (items, context) => items.flatMap((item) => generate(item, context) ?? []).slice(0, context.count);
}

export const generateFlashcard: ItemQuestionGenerator = (item, { locale }) => ({
  itemId: item.id,
  kind: 'FLASHCARD',
  prompt: item.text,
  options: null,
  correctOptionId: null,
  acceptedAnswers: [],
  reveal: revealFor(item, locale),
});

export const generateMultipleChoice: ItemQuestionGenerator = (item, { pool, locale, random }) => {
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
      acceptedAnswers: [],
      reveal: revealFor(item, locale),
    };
  }
  return null;
};

/** Every spelling accepted when the user types the answer to `kind`. */
export function acceptedTypedAnswers(item: PracticeItem, kind: ChoiceKind): string[] {
  const romanizations = item.romanization ? [item.romanization, ...item.acceptedAnswers] : [];
  if (CHOICE_FIELDS[kind].answer === 'ROMANIZATION') return romanizations;

  const article = item.attributes?.article;
  return [
    item.text,
    // German nouns: "Apfel" and "der Apfel" are both right.
    ...(article ? [`${article} ${item.text}`] : []),
    // Japanese words: kana works without a kanji keyboard.
    ...(item.reading ? [item.reading] : []),
    // Japanese and Korean words may also be typed in Latin letters (さくら → sakura).
    ...romanizations,
  ];
}

export const generateTyping: ItemQuestionGenerator = (item, { locale, random }) => {
  const [kind] = shuffle(typingKindsFor(item, locale), random);
  if (!kind) return null;

  const prompt = fieldValue(item, CHOICE_FIELDS[kind].prompt, locale);
  const acceptedAnswers = acceptedTypedAnswers(item, kind);
  if (!prompt || acceptedAnswers.length === 0) return null;

  return {
    itemId: item.id,
    kind,
    prompt,
    options: null,
    correctOptionId: null,
    acceptedAnswers,
    reveal: revealFor(item, locale),
  };
};

const MATCH_KINDS: ChoiceKind[] = ['TEXT_TO_ROMANIZATION', 'TEXT_TO_MEANING', 'EMOJI_TO_TEXT'];
const key = (value: string) => value.trim().toLowerCase();

/**
 * A board of pairs (ぬ ↔ nu, Apfel ↔ quả táo). Every card on a side must be unique,
 * otherwise じ and ぢ ("ji" twice) would both fit the same card.
 */
export const generateMatchingBoard: SessionGenerator = (items, { locale, random, count }) => {
  const supported = (kind: ChoiceKind) => items.filter((item) => choiceKindsFor(item, locale).includes(kind));
  const kind = [...MATCH_KINDS].sort((a, b) => supported(b).length - supported(a).length)[0];
  const { prompt, answer } = CHOICE_FIELDS[kind];

  const seenPrompts = new Set<string>();
  const seenAnswers = new Set<string>();
  const pairs: { item: PracticeItem; prompt: string; answer: string }[] = [];
  for (const item of supported(kind)) {
    const promptText = fieldValue(item, prompt, locale);
    const answerText = fieldValue(item, answer, locale);
    if (!promptText || !answerText || seenPrompts.has(key(promptText)) || seenAnswers.has(key(answerText))) continue;
    seenPrompts.add(key(promptText));
    seenAnswers.add(key(answerText));
    pairs.push({ item, prompt: promptText, answer: answerText });
    if (pairs.length === count) break;
  }
  if (pairs.length < 2) return [];

  const cards = shuffle(pairs, random).map((pair, index) => ({ id: String(index + 1), text: pair.answer, itemId: pair.item.id }));
  const cardOf = new Map(cards.map((card) => [card.itemId, card.id]));

  return pairs.map(({ item, prompt: promptText }) => ({
    itemId: item.id,
    kind,
    prompt: promptText,
    options: cards,
    correctOptionId: cardOf.get(item.id) ?? null,
    acceptedAnswers: [],
    reveal: revealFor(item, locale),
  }));
};
