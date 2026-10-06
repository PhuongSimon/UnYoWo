import type { TranslationLanguage } from '../languages.js';
import { requestJson, TranslationProvider, TranslationProviderError } from './translation-provider.js';

/** DeepL wants a regional variant for English targets. */
const TARGET: Record<TranslationLanguage, string> = { vi: 'VI', en: 'EN-US', de: 'DE', ja: 'JA', ko: 'KO' };

/**
 * DeepL API Free: the best quality, 500,000 characters a month, but signing up needs a credit
 * card. Free keys end in ":fx" and use their own host.
 */
export class DeepLProvider extends TranslationProvider {
  readonly name = 'deepl';

  constructor(private readonly apiKey: string) {
    super();
  }

  async translate(text: string, source: TranslationLanguage, target: TranslationLanguage): Promise<string> {
    const host = this.apiKey.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
    const data = await requestJson<{ translations?: { text: string }[] }>(this.name, `${host}/v2/translate`, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: [text], source_lang: source.toUpperCase(), target_lang: TARGET[target] }),
    });
    const translated = data.translations?.[0]?.text;
    if (!translated) throw new TranslationProviderError(this.name, 'empty response');
    return translated;
  }
}
