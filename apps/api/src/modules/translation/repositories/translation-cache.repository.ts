import type { CachedTranslation } from '../entities/translation.entity.js';

export interface CacheKey {
  source: string;
  target: string;
  text: string;
}

export abstract class TranslationCacheRepository {
  /** Also counts the hit, so popular entries can be kept when the cache is ever trimmed. */
  abstract find(key: CacheKey): Promise<CachedTranslation | null>;
  abstract save(key: CacheKey, value: CachedTranslation): Promise<void>;
}
