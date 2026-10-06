import type { ConfigService } from '@nestjs/config';
import { DeepLProvider } from './deepl.provider.js';
import { LibreTranslateProvider } from './libretranslate.provider.js';
import { MyMemoryProvider } from './mymemory.provider.js';
import type { TranslationProvider } from './translation-provider.js';

export const TRANSLATION_PROVIDERS = Symbol('TRANSLATION_PROVIDERS');

/** Best quality first; MyMemory needs no setup, so it is always there as the last resort. */
const DEFAULT_ORDER = ['deepl', 'libretranslate', 'mymemory'];

/**
 * The providers to try, in order. Only configured ones are used: DeepL needs DEEPL_API_KEY,
 * LibreTranslate needs LIBRETRANSLATE_URL. TRANSLATION_PROVIDERS ("libretranslate,mymemory")
 * changes the order or leaves some out.
 */
export function buildTranslationProviders(config: ConfigService): TranslationProvider[] {
  const available: Record<string, () => TranslationProvider | null> = {
    deepl: () => {
      const key = config.get<string>('DEEPL_API_KEY');
      return key ? new DeepLProvider(key) : null;
    },
    libretranslate: () => {
      const url = config.get<string>('LIBRETRANSLATE_URL');
      return url ? new LibreTranslateProvider(url, config.get<string>('LIBRETRANSLATE_API_KEY') || undefined) : null;
    },
    mymemory: () => new MyMemoryProvider(config.get<string>('MYMEMORY_EMAIL') || undefined),
  };
  const order = (config.get<string>('TRANSLATION_PROVIDERS') || DEFAULT_ORDER.join(','))
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name in available);
  return order.flatMap((name) => available[name]() ?? []);
}
