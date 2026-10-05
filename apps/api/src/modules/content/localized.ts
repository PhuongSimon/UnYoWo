import type { Prisma } from '../../generated/prisma/client.js';
import type { Localized } from './entities/content.entity.js';

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
