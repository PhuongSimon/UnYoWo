import { Injectable } from '@nestjs/common';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import type { CachedTranslation } from '../entities/translation.entity.js';
import { TranslationCacheRepository, type CacheKey } from './translation-cache.repository.js';

const uniqueKey = ({ source, target, text }: CacheKey) => ({
  sourceLang_targetLang_sourceText: { sourceLang: source, targetLang: target, sourceText: text },
});

@Injectable()
export class PrismaTranslationCacheRepository extends TranslationCacheRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  async find(key: CacheKey): Promise<CachedTranslation | null> {
    const rows = await this.db.translationCache.updateManyAndReturn({
      where: { sourceLang: key.source, targetLang: key.target, sourceText: key.text },
      data: { hits: { increment: 1 }, lastUsedAt: new Date() },
      select: { translatedText: true, provider: true },
    });
    return rows[0] ?? null;
  }

  async save(key: CacheKey, { translatedText, provider }: CachedTranslation): Promise<void> {
    await this.db.translationCache.upsert({
      where: uniqueKey(key),
      create: { sourceLang: key.source, targetLang: key.target, sourceText: key.text, translatedText, provider },
      update: { translatedText, provider, lastUsedAt: new Date() },
    });
  }
}
