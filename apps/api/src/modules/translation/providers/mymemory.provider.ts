import type { TranslationLanguage } from '../languages.js';
import { requestJson, TranslationProvider, TranslationProviderError } from './translation-provider.js';

const ENDPOINT = 'https://api.mymemory.translated.net/get';
/** MyMemory refuses queries over 500 bytes (UTF-8): Vietnamese and Japanese use 2–3 bytes per letter. */
const MAX_BYTES = 480;

interface MyMemoryResponse {
  responseData: { translatedText: string };
  responseStatus: number | string;
  responseDetails?: string;
  quotaFinished?: boolean;
}

const ENTITIES: Record<string, string> = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>' };
const decodeEntities = (text: string) => text.replace(/&(amp|quot|#39|lt|gt);/g, (entity) => ENTITIES[entity]);
const byteLength = (text: string) => Buffer.byteLength(text, 'utf8');

/** Where to cut `text` so the first piece fits in `maxBytes`: the last space before the limit, if any. */
function cutIndex(text: string, maxBytes: number): number {
  let end = text.length;
  while (end > 1 && byteLength(text.slice(0, end)) > maxBytes) end--;
  const space = text.lastIndexOf(' ', end);
  return space > 0 ? space : end;
}

/** Splits long text at sentence ends (or spaces) into pieces MyMemory accepts. */
export function splitForMyMemory(text: string, maxBytes = MAX_BYTES): string[] {
  const pieces: string[] = [];
  let current = '';
  for (const sentence of text.match(/[^.!?。！？\n]+[.!?。！？\n]*\s*/g) ?? [text]) {
    if (current && byteLength(current + sentence) > maxBytes) {
      pieces.push(current.trim());
      current = '';
    }
    let rest = sentence;
    while (byteLength(rest) > maxBytes) {
      const cut = cutIndex(rest, maxBytes);
      pieces.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut);
    }
    current += rest;
  }
  if (current.trim()) pieces.push(current.trim());
  return pieces;
}

/**
 * MyMemory (translated.net): free without a key, 5,000 characters a day, or 50,000 when an
 * e-mail address is sent along (MYMEMORY_EMAIL). Mixes machine translation with a shared memory.
 */
export class MyMemoryProvider extends TranslationProvider {
  readonly name = 'mymemory';

  constructor(private readonly email?: string) {
    super();
  }

  async translate(text: string, source: TranslationLanguage, target: TranslationLanguage): Promise<string> {
    const translated: string[] = [];
    for (const piece of splitForMyMemory(text)) {
      const params = new URLSearchParams({ q: piece, langpair: `${source}|${target}` });
      if (this.email) params.set('de', this.email);
      const data = await requestJson<MyMemoryResponse>(this.name, `${ENDPOINT}?${params}`);
      if (data.quotaFinished) throw new TranslationProviderError(this.name, 'daily quota used up');
      if (Number(data.responseStatus) !== 200 || !data.responseData?.translatedText) {
        throw new TranslationProviderError(this.name, data.responseDetails || `status ${data.responseStatus}`);
      }
      translated.push(decodeEntities(data.responseData.translatedText));
    }
    return translated.join(' ');
  }
}
