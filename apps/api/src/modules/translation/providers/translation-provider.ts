import type { TranslationLanguage } from '../languages.js';

/** A provider could not translate (quota used up, network, unsupported pair): the next one is tried. */
export class TranslationProviderError extends Error {
  constructor(
    readonly provider: string,
    message: string,
  ) {
    super(`${provider}: ${message}`);
  }
}

/** One machine translation service. Strategy pattern: the service tries each configured one in turn. */
export abstract class TranslationProvider {
  abstract readonly name: string;
  abstract translate(text: string, source: TranslationLanguage, target: TranslationLanguage): Promise<string>;
}

/** Sends a request and returns the JSON body, turning timeouts and HTTP errors into TranslationProviderError. */
export async function requestJson<T>(provider: string, url: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
  } catch (error) {
    throw new TranslationProviderError(provider, `request failed (${(error as Error).message})`);
  }
  if (!response.ok) throw new TranslationProviderError(provider, `HTTP ${response.status}`);
  return (await response.json()) as T;
}
