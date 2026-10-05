import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { GeneratedQuestion, UiLocale } from '../entities/game-session.entity.js';
import { shuffle, type Random } from '../random.js';
import { pickDistractors } from './distractors.js';
import {
  CHOICE_FIELDS,
  choiceKindsFor,
  fieldValue,
  listeningKindsFor,
  promptFor,
  revealFor,
  typingKindsFor,
  type ChoiceKind,
} from './fields.js';

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
  audioUrl: item.audioUrl,
  reveal: revealFor(item, locale),
});

/** One right option plus up to three wrong ones, for whichever of `kinds` the item supports. */
function choiceQuestion(item: PracticeItem, kinds: ChoiceKind[], { pool, locale, random }: GeneratorContext): GeneratedQuestion | null {
  for (const kind of shuffle(kinds, random)) {
    const prompt = promptFor(item, kind, locale);
    if (!prompt) continue;

    const distractors = pickDistractors(item, pool, kind, locale, OPTION_COUNT - 1, random);
    if (distractors.length === 0) continue;

    const { answer } = CHOICE_FIELDS[kind];
    const ordered = shuffle([item, ...distractors], random);
    return {
      itemId: item.id,
      kind,
      prompt,
      options: ordered.map((option, index) => ({
        id: String(index + 1),
        text: fieldValue(option, answer, locale) ?? '',
        itemId: option.id,
      })),
      correctOptionId: String(ordered.indexOf(item) + 1),
      acceptedAnswers: [],
      audioUrl: item.audioUrl,
      reveal: revealFor(item, locale),
    };
  }
  return null;
}

export const generateMultipleChoice: ItemQuestionGenerator = (item, context) =>
  choiceQuestion(item, choiceKindsFor(item, context.locale), context);

export const generateListening: ItemQuestionGenerator = (item, context) =>
  choiceQuestion(item, listeningKindsFor(item, context.locale), context);

/**
 * Keeps asking until `count` questions exist, going round the items again and again (a
 * timed round needs more questions than a small set has items). Never the same item twice in a row.
 */
export function cycling(generate: ItemQuestionGenerator): SessionGenerator {
  return (items, context) => {
    const questions: GeneratedQuestion[] = [];
    while (questions.length < context.count) {
      const before = questions.length;
      for (const item of shuffle(items, context.random)) {
        if (questions.length === context.count) break;
        if (questions.at(-1)?.itemId === item.id && items.length > 1) continue;
        const question = generate(item, context);
        if (question) questions.push(question);
      }
      if (questions.length === before) break;
    }
    return questions;
  };
}

const TILES_PER_SLOT = 4;
const TILE_LETTERS = 'abcd';

/**
 * "gok" → pick ㄱ, then ㅗ, then ㄱ. One slot per part of the item, each with the right
 * part and wrong parts of the same role from the pool (other initials, other vowels…).
 */
export const generateBuilder: ItemQuestionGenerator = (item, { pool, locale, random }) => {
  if (item.components.length < 2 || !item.romanization) return null;
  // じ and ぢ are both "ji": the prompt would have two right answers.
  if (pool.some((other) => other.id !== item.id && other.romanization === item.romanization)) return null;

  const options: GeneratedQuestion['options'] = [];
  const correct: string[] = [];
  item.components.forEach(({ role, text }, slot) => {
    const sameRole = new Set(pool.flatMap((other) => other.components.filter((part) => part.role === role).map((part) => part.text)));
    sameRole.delete(text);
    const tiles = shuffle([text, ...shuffle([...sameRole], random).slice(0, TILES_PER_SLOT - 1)], random);

    tiles.forEach((tile, index) => {
      const id = `${slot + 1}${TILE_LETTERS[index]}`;
      options.push({ id, text: tile, itemId: null, slot, role });
      if (tile === text) correct.push(id);
    });
  });

  return {
    itemId: item.id,
    kind: 'BUILD',
    prompt: item.romanization,
    options,
    // The parts in order, e.g. "1b|2a|3c"
    correctOptionId: correct.join('|'),
    acceptedAnswers: [],
    audioUrl: item.audioUrl,
    reveal: revealFor(item, locale),
  };
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
    audioUrl: item.audioUrl,
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
    audioUrl: item.audioUrl,
    reveal: revealFor(item, locale),
  }));
};
