import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import type { WordLookup, WordMatch } from '../content/entities/content.entity.js';
import { ContentRepository } from '../content/repositories/content.repository.js';
import type { TranslateDto } from './dto/translate.dto.js';
import type { CachedTranslation, TranslationResult } from './entities/translation.entity.js';
import { detectLanguage, type TranslationLanguage } from './languages.js';
import { TRANSLATION_PROVIDERS } from './providers/build-providers.js';
import type { TranslationProvider } from './providers/translation-provider.js';
import { TranslationCacheRepository } from './repositories/translation-cache.repository.js';

const DICTIONARY_LIMIT = 6;
const STUDY_LANGUAGES = new Set<TranslationLanguage>(['en', 'de', 'ja', 'ko']);
const UI_LANGUAGES = new Set<TranslationLanguage>(['vi', 'en']);

/** Only a word or a short phrase is worth looking up in the word lists. */
const looksLikeAWord = (text: string) => text.length <= 40 && text.split(/\s+/).length <= 4;

/**
 * Translates with the first provider that answers (cached per text, so repeats cost no quota)
 * and looks the text up in the app's own word lists, which know levels and readings that a
 * machine translation does not.
 */
@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(
    @Inject(TRANSLATION_PROVIDERS) private readonly providers: TranslationProvider[],
    private readonly cache: TranslationCacheRepository,
    private readonly content: ContentRepository,
  ) {}

  async translate({ text, source: requested, target }: TranslateDto): Promise<TranslationResult> {
    const detected = requested === 'auto';
    const source = detected ? detectLanguage(text) : requested;
    if (source === target) throw new ApiError(HttpStatus.BAD_REQUEST, 'TRANSLATION_SAME_LANGUAGE', { source });

    const [dictionary, machine] = await Promise.all([this.lookUp(text, source, target), this.machineTranslate(text, source, target)]);
    if (!machine && dictionary.length === 0) throw new ApiError(HttpStatus.SERVICE_UNAVAILABLE, 'TRANSLATION_UNAVAILABLE');

    return {
      source,
      target,
      detected,
      translation: machine?.translatedText ?? null,
      provider: machine?.provider ?? null,
      cached: machine?.cached ?? false,
      dictionary,
    };
  }

  private async machineTranslate(text: string, source: TranslationLanguage, target: TranslationLanguage) {
    const key = { source, target, text };
    const cached = await this.cache.find(key);
    if (cached) return { ...cached, cached: true };

    for (const provider of this.providers) {
      try {
        const translatedText = (await provider.translate(text, source, target)).trim();
        if (!translatedText) continue;
        const result: CachedTranslation = { translatedText, provider: provider.name };
        await this.cache.save(key, result);
        return { ...result, cached: false };
      } catch (error) {
        // Quota used up, network down, pair not supported: the next provider may still answer.
        this.logger.warn(`Translation failed, trying the next provider: ${(error as Error).message}`);
      }
    }
    return null;
  }

  /** Words written like the text in its language, and words whose meaning is the text (con mèo → 猫). */
  private async lookUp(text: string, source: TranslationLanguage, target: TranslationLanguage): Promise<WordMatch[]> {
    if (!looksLikeAWord(text)) return [];

    const lookups: WordLookup[] = [];
    if (STUDY_LANGUAGES.has(source)) lookups.push({ language: source, text });
    if (STUDY_LANGUAGES.has(target) && UI_LANGUAGES.has(source)) {
      lookups.push({ language: target, meaning: text, meaningLanguage: source as 'vi' | 'en' });
    }

    const matches = (await Promise.all(lookups.map((lookup) => this.content.lookupWords(lookup, DICTIONARY_LIMIT)))).flat();
    const seen = new Set<string>();
    return matches.filter((match) => !seen.has(match.itemId) && seen.add(match.itemId)).slice(0, DICTIONARY_LIMIT);
  }
}
