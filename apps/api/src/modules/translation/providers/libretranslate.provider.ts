import type { TranslationLanguage } from '../languages.js';
import { requestJson, TranslationProvider, TranslationProviderError } from './translation-provider.js';

/**
 * LibreTranslate: open source, self-hosted (docker compose profile "translate"), no quota.
 * Quality for Japanese and Korean is lower than the hosted services.
 */
export class LibreTranslateProvider extends TranslationProvider {
  readonly name = 'libretranslate';

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {
    super();
  }

  async translate(text: string, source: TranslationLanguage, target: TranslationLanguage): Promise<string> {
    const data = await requestJson<{ translatedText?: string; error?: string }>(this.name, `${this.baseUrl.replace(/\/$/, '')}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text', ...(this.apiKey ? { api_key: this.apiKey } : {}) }),
    });
    if (!data.translatedText) throw new TranslationProviderError(this.name, data.error ?? 'empty response');
    return data.translatedText;
  }
}
