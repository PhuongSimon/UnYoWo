import type { Prisma } from '../../generated/prisma/client.js';
import type { Localized, Meaning } from './entities/content.entity.js';

/** JSON { en, vi } columns (set titles, concept glosses) read back with a runtime check. */
export function toLocalized(value: Prisma.JsonValue): Localized {
  if (value && typeof value === 'object' && !Array.isArray(value) && typeof value.en === 'string' && typeof value.vi === 'string') {
    return { en: value.en, vi: value.vi };
  }
  throw new Error(`Expected a { en, vi } object, got ${JSON.stringify(value)}`);
}

export function toAttributes(value: Prisma.JsonValue | null): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

/**
 * A word's meaning in each UI language: its own `meaning` first (word lists), else the gloss of
 * the concept it shares with other languages (starter sets). Null when neither has any text.
 */
export function toMeaning(own: Prisma.JsonValue | null, gloss: Prisma.JsonValue | null | undefined): Meaning | null {
  const pick = (value: Prisma.JsonValue | null | undefined, key: keyof Localized) =>
    value && typeof value === 'object' && !Array.isArray(value) && typeof value[key] === 'string' && value[key] ? value[key] : undefined;
  const en = pick(own, 'en') ?? pick(gloss, 'en');
  const vi = pick(own, 'vi') ?? pick(gloss, 'vi');
  if (!en && !vi) return null;
  return { ...(en ? { en } : {}), ...(vi ? { vi } : {}) };
}
