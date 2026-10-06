import type { WordLookup, WordMatch } from '../content/entities/content.entity.js';
import { ContentRepository } from '../content/repositories/content.repository.js';
import type { CachedTranslation } from './entities/translation.entity.js';
import type { TranslationLanguage } from './languages.js';
import { TranslationProvider, TranslationProviderError } from './providers/translation-provider.js';
import { TranslationCacheRepository, type CacheKey } from './repositories/translation-cache.repository.js';
import { TranslationService } from './translation.service.js';

class FakeProvider extends TranslationProvider {
  calls: string[] = [];
  constructor(
    readonly name: string,
    private readonly answer: (text: string, target: TranslationLanguage) => string,
  ) {
    super();
  }
  async translate(text: string, _source: TranslationLanguage, target: TranslationLanguage) {
    this.calls.push(text);
    return this.answer(text, target);
  }
}

class InMemoryCache extends TranslationCacheRepository {
  rows = new Map<string, CachedTranslation>();
  private id = ({ source, target, text }: CacheKey) => `${source}|${target}|${text}`;
  async find(key: CacheKey) {
    return this.rows.get(this.id(key)) ?? null;
  }
  async save(key: CacheKey, value: CachedTranslation) {
    this.rows.set(this.id(key), value);
  }
}

const cat: WordMatch = {
  itemId: 'neko',
  setId: 'n5-animals-1',
  language: 'ja',
  text: '猫',
  reading: 'ねこ',
  romanization: 'neko',
  meaning: { vi: 'con mèo', en: 'cat' },
  partOfSpeech: 'NOUN',
  level: 'N5',
  attributes: { hanViet: 'MIÊU' },
};

const content = (matches: (lookup: WordLookup) => WordMatch[]) => {
  const lookups: WordLookup[] = [];
  const repo = { lookupWords: async (lookup: WordLookup) => (lookups.push(lookup), matches(lookup)) } as unknown as ContentRepository;
  return { repo, lookups };
};

const failing = new FakeProvider('deepl', () => {
  throw new TranslationProviderError('deepl', 'quota');
});

describe('TranslationService', () => {
  it('uses the first provider that answers and caches the result', async () => {
    const mymemory = new FakeProvider('mymemory', (text) => `vi(${text})`);
    const cache = new InMemoryCache();
    const service = new TranslationService([failing, mymemory], cache, content(() => []).repo);

    const first = await service.translate({ text: 'Guten Morgen, wie geht es dir?', source: 'de', target: 'vi' });
    expect(first).toMatchObject({ translation: 'vi(Guten Morgen, wie geht es dir?)', provider: 'mymemory', cached: false });

    const again = await service.translate({ text: 'Guten Morgen, wie geht es dir?', source: 'de', target: 'vi' });
    expect(again).toMatchObject({ provider: 'mymemory', cached: true });
    expect(mymemory.calls).toHaveLength(1);
  });

  it('guesses the source language when asked to', async () => {
    const service = new TranslationService([new FakeProvider('mymemory', () => 'xin chào')], new InMemoryCache(), content(() => []).repo);
    await expect(service.translate({ text: '안녕하세요', source: 'auto', target: 'vi' })).resolves.toMatchObject({ source: 'ko', detected: true });
    await expect(service.translate({ text: 'xin chào', source: 'auto', target: 'vi' })).rejects.toMatchObject({
      response: { code: 'TRANSLATION_SAME_LANGUAGE' },
    });
  });

  it('looks a short text up in the word lists both ways', async () => {
    const { repo, lookups } = content((lookup) => ('meaning' in lookup ? [cat] : []));
    const service = new TranslationService([new FakeProvider('mymemory', () => '猫')], new InMemoryCache(), repo);

    const result = await service.translate({ text: 'con mèo', source: 'vi', target: 'ja' });
    expect(lookups).toEqual([{ language: 'ja', meaning: 'con mèo', meaningLanguage: 'vi' }]);
    expect(result.dictionary).toEqual([cat]);

    lookups.length = 0;
    await service.translate({ text: 'cat', source: 'en', target: 'ja' });
    expect(lookups).toEqual([
      { language: 'en', text: 'cat' },
      { language: 'ja', meaning: 'cat', meaningLanguage: 'en' },
    ]);
  });

  it('skips the word lists for whole sentences', async () => {
    const { repo, lookups } = content(() => [cat]);
    const service = new TranslationService([new FakeProvider('mymemory', () => 'ok')], new InMemoryCache(), repo);
    await service.translate({ text: 'Tôi muốn học tiếng Nhật mỗi ngày với bạn bè', source: 'vi', target: 'ja' });
    expect(lookups).toEqual([]);
  });

  it('still answers from the word lists when every provider fails, and errors when nothing is found', async () => {
    const service = new TranslationService([failing], new InMemoryCache(), content((lookup) => ('text' in lookup ? [cat] : [])).repo);
    await expect(service.translate({ text: '猫', source: 'ja', target: 'vi' })).resolves.toMatchObject({
      translation: null,
      provider: null,
      dictionary: [cat],
    });

    const empty = new TranslationService([failing], new InMemoryCache(), content(() => []).repo);
    await expect(empty.translate({ text: 'Katze', source: 'de', target: 'vi' })).rejects.toMatchObject({
      response: { code: 'TRANSLATION_UNAVAILABLE', statusCode: 503 },
    });
  });
});
