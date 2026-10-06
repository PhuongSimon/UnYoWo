import type { PracticeItem } from '../../content/entities/content.entity.js';
import type { UiLocale } from '../entities/game-session.entity.js';
import { shuffle, type Random } from '../random.js';
import { CHOICE_FIELDS, fieldValue, type ChoiceKind } from './fields.js';

const key = (value: string) => value.trim().toLowerCase();

/**
 * Picks wrong options for a question about `target`: curated look-alikes first, then
 * items from the same set, then any item of the same type in the pool. A candidate is
 * skipped when it would be a second right answer, e.g. じ and ぢ are both "ji".
 */
export function pickDistractors(
  target: PracticeItem,
  pool: PracticeItem[],
  kind: ChoiceKind,
  locale: UiLocale,
  count: number,
  random: Random,
): PracticeItem[] {
  const { prompt, answer } = CHOICE_FIELDS[kind];
  const targetPrompt = fieldValue(target, prompt, locale);
  const targetAnswer = fieldValue(target, answer, locale);
  if (!targetAnswer) return [];

  const confusable = new Set(target.confusableIds);
  const others = pool.filter((item) => item.id !== target.id);
  const tiers = [
    others.filter((item) => confusable.has(item.id)),
    others.filter((item) => !confusable.has(item.id) && item.setId === target.setId),
    others.filter((item) => !confusable.has(item.id) && item.setId !== target.setId && item.type === target.type),
  ];

  const usedAnswers = new Set([key(targetAnswer)]);
  const picked: PracticeItem[] = [];
  for (const tier of tiers) {
    for (const candidate of shuffle(tier, random)) {
      if (picked.length === count) return picked;

      const candidateAnswer = fieldValue(candidate, answer, locale);
      const candidatePrompt = fieldValue(candidate, prompt, locale);
      if (!candidateAnswer || usedAnswers.has(key(candidateAnswer))) continue;
      if (candidatePrompt !== null && targetPrompt !== null && key(candidatePrompt) === key(targetPrompt)) continue;

      usedAnswers.add(key(candidateAnswer));
      picked.push(candidate);
    }
  }
  return picked;
}
